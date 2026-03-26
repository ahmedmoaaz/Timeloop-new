'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(event.date), 'MMM d, yyyy • HH:mm')}
              </span>
              {event.duration && (
                <span className="text-indigo-600 font-medium">{event.duration}h</span>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {(event.content || event.tags?.length > 0) && (
        <CardContent className="pt-0">
          {event.content && <p className="text-sm text-gray-700 mb-2">{event.content}</p>}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
