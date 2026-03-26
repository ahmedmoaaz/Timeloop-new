'use client';

import EventCard from './EventCard';
import { format, isSameDay, parseISO } from 'date-fns';

export default function EventList({ events, onEdit, onDelete }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No events found</p>
        <p className="text-sm mt-2">Start tracking your productivity by adding your first event!</p>
      </div>
    );
  }

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = format(new Date(event.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {format(new Date(date), 'd')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-500">
                {groupedEvents[date].length} event{groupedEvents[date].length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="ml-6 pl-6 border-l-2 border-gray-200 space-y-3">
            {groupedEvents[date].map((event) => (
              <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
