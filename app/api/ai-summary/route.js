import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import OpenAI from 'openai';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format } from 'date-fns';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    const activityLogsCollection = db.collection('activity_logs');

    const now = new Date();
    let startDate, endDate, periodLabel;

    if (period === 'daily') {
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      periodLabel = format(now, 'MMMM d, yyyy');
    } else {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
      periodLabel = `Week of ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    }

    // Get events
    const events = await eventsCollection
      .find({
        userId: session.user.id,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .toArray();

    // Get activity logs
    const activityLogs = await activityLogsCollection
      .find({
        userId: session.user.id,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .toArray();

    // Calculate tag statistics
    const tagTimeMap = {};
    events.forEach((event) => {
      const hours = event.duration || 1;
      event.tags?.forEach((tag) => {
        tagTimeMap[tag] = (tagTimeMap[tag] || 0) + hours;
      });
    });

    // Calculate website statistics
    const websiteTimeMap = {};
    activityLogs.forEach((log) => {
      const hours = (log.timeSpent || 0) / 60;
      websiteTimeMap[log.website] = (websiteTimeMap[log.website] || 0) + hours;
    });

    // Prepare data for AI
    const eventsData = events.map((e) => ({
      title: e.title,
      content: e.content,
      tags: e.tags,
      date: format(new Date(e.date), 'MMM d, HH:mm'),
    }));

    const topTags = Object.entries(tagTimeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, hours]) => `${tag}: ${hours.toFixed(1)}h`);

    const topWebsites = Object.entries(websiteTimeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([site, hours]) => `${site}: ${hours.toFixed(1)}h`);

    // Create prompt for OpenAI
    const prompt = `You are a productivity coach analyzing someone's ${period} activity.

Period: ${periodLabel}

Events logged (${events.length} total):
${eventsData.map((e) => `- ${e.date}: ${e.title} [${e.tags?.join(', ')}]${e.content ? ' - ' + e.content : ''}`).join('\n')}

Top activities by time:
${topTags.length > 0 ? topTags.join('\n') : 'No activity data'}

Top websites visited (from browser tracking):
${topWebsites.length > 0 ? topWebsites.join('\n') : 'No tracking data'}

Provide a concise, encouraging summary (3-4 sentences) that:
1. Highlights the most productive activities
2. Notes any patterns or insights
3. Offers one actionable suggestion for improvement
4. Keeps a positive, motivating tone`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an encouraging productivity coach who provides brief, actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({
      period,
      periodLabel,
      summary,
      stats: {
        eventCount: events.length,
        topTags: topTags.slice(0, 3),
        topWebsites: topWebsites.slice(0, 3),
      },
    });
  } catch (error) {
    console.error('GET /api/ai-summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error.message },
      { status: 500 }
    );
  }
}
