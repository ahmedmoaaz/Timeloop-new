import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily'; // daily or weekly

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    const activityLogsCollection = db.collection('activity_logs');

    const now = new Date();
    let startDate, endDate;

    if (period === 'daily') {
      startDate = startOfDay(now);
      endDate = endOfDay(now);
    } else {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
    }

    // Get events in date range
    const events = await eventsCollection
      .find({
        userId: session.user.id,
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray();

    // Get activity logs from Chrome extension
    const activityLogs = await activityLogsCollection
      .find({
        userId: session.user.id,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .toArray();

    // Calculate time by tags from events
    const tagTimeMap = {};
    let totalEventHours = 0;
    
    events.forEach((event) => {
      const hours = event.duration || 1; // Default 1 hour if no duration
      totalEventHours += hours;
      
      event.tags?.forEach((tag) => {
        tagTimeMap[tag] = (tagTimeMap[tag] || 0) + hours;
      });
    });

    // Calculate time by website from activity logs
    const websiteTimeMap = {};
    activityLogs.forEach((log) => {
      const minutes = log.timeSpent || 0;
      const hours = minutes / 60;
      websiteTimeMap[log.website] = (websiteTimeMap[log.website] || 0) + hours;
    });

    // Format for charts
    const tagStats = Object.entries(tagTimeMap).map(([name, hours]) => ({
      name,
      hours: parseFloat(hours.toFixed(2)),
    }));

    const websiteStats = Object.entries(websiteTimeMap)
      .map(([name, hours]) => ({
        name,
        hours: parseFloat(hours.toFixed(2)),
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Top 10 websites

    const totalWebsiteHours = websiteStats.reduce((sum, item) => sum + item.hours, 0);

    return NextResponse.json({
      period,
      tagStats,
      websiteStats,
      totalHours: parseFloat(totalEventHours.toFixed(2)), // Total from ALL events, not just tags
      totalWebsiteHours: parseFloat(totalWebsiteHours.toFixed(2)),
      eventCount: events.length,
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
