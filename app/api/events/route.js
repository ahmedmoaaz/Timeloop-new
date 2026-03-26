import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET all events for logged-in user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    let query = { userId: session.user.id };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const events = await eventsCollection.find(query).sort({ date: -1 }).toArray();

    return NextResponse.json({ events });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new event
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, tags, date, duration } = body;

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const newEvent = {
      id: uuidv4(),
      userId: session.user.id,
      title,
      content: content || '',
      tags: tags || [],
      date: new Date(date),
      duration: duration || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await eventsCollection.insertOne(newEvent);

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update event
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, tags, date, duration } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const updateData = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (date) updateData.date = new Date(date);
    if (duration !== undefined) updateData.duration = duration;

    const result = await eventsCollection.updateOne(
      { id, userId: session.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const updatedEvent = await eventsCollection.findOne({ id, userId: session.user.id });

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error('PUT /api/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const result = await eventsCollection.deleteOne({ id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
