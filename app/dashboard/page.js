'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, Search, LogOut, LayoutDashboard, TrendingUp, 
  Brain, Calendar, Plus, Loader2 
} from 'lucide-react';
import EventForm from '@/components/dashboard/EventForm';
import EventList from '@/components/dashboard/EventList';
import Analytics from '@/components/dashboard/Analytics';
import AISummary from '@/components/dashboard/AISummary';
import BrowserActivity from '@/components/dashboard/BrowserActivity';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, router]);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, dateFrom, dateTo]);

  const fetchEvents = async () => {
    try {
      let url = '/api/events';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    setFilteredEvents(events);
  };

  const handleCreateEvent = async (formData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchEvents();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdateEvent = async (formData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingEvent.id }),
      });
      if (res.ok) {
        await fetchEvents();
        setEditingEvent(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-2">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TimeLoop
          </h1>
        </div>

        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'events'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Events</span>
          </button>
          <button
            onClick={() => setActiveTab('browser')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'browser'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Browser Activity</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'ai'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="font-medium">AI Insights</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={session.user?.image} />
              <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Events Timeline</h2>
                <Button onClick={() => { setEditingEvent(null); setShowForm(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search events by title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From"
                  className="w-40"
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To"
                  className="w-40"
                />
                {(searchQuery || dateFrom || dateTo) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setDateFrom('');
                      setDateTo('');
                      fetchEvents();
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Event Form */}
              {showForm && (
                <EventForm
                  onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  onCancel={() => { setShowForm(false); setEditingEvent(null); }}
                  initialData={editingEvent}
                />
              )}

              {/* Events List */}
              <EventList
                events={filteredEvents}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            </div>
          )}

          {activeTab === 'browser' && <BrowserActivity />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'ai' && <AISummary />}
        </div>
      </div>
    </div>
  );
}
