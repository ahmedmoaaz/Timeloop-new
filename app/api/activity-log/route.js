import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// POST activity log from Chrome extension
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, website, url, timeSpent, timestamp } = body;

    if (!userId || !website) {
      return NextResponse.json(
        { error: 'userId and website are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const activityLogsCollection = db.collection('activity_logs');

    const newLog = {
      id: uuidv4(),
      userId,
      website,
      url: url || '',
      timeSpent: timeSpent || 0, // in minutes
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
    };

    await activityLogsCollection.insertOne(newLog);

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error('POST /api/activity-log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET activity logs for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const activityLogsCollection = db.collection('activity_logs');

    const logs = await activityLogsCollection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('GET /api/activity-log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
