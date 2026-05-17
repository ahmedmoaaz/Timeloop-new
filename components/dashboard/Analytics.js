'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function Analytics() {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Analytics component mounted');
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    console.log('Fetching analytics for period:', period);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?period=${period}`);
      console.log('Analytics response status:', res.status);
      if (res.ok) {
        const json = await res.json();
        console.log('Analytics data:', json);
        setData(json);
      } else {
        setError('Failed to load analytics');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Error loading analytics');
    }
    setLoading(false);
  };

  console.log('Analytics render - loading:', loading, 'data:', data, 'error:', error);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant={period === 'daily' ? 'default' : 'outline'}
            onClick={() => setPeriod('daily')}
            size="sm"
          >
            Daily
          </Button>
          <Button
            variant={period === 'weekly' ? 'default' : 'outline'}
            onClick={() => setPeriod('weekly')}
            size="sm"
          >
            Weekly
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{data.eventCount || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.currentEventCount || 0} current, {data.upcomingEventCount || 0} upcoming
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours (Events)</p>
                <p className="text-2xl font-bold">{data.totalHours || 0}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Browser Time</p>
                <p className="text-2xl font-bold">{(data.totalWebsiteHours || 0).toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold">{data.upcomingEventCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Time Distribution */}
        {data.tagStats && data.tagStats.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Time by Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.tagStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Time by Activity</CardTitle>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-2">No event data yet</p>
                <p className="text-sm">Create events with tags to see activity breakdown</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Website Time Distribution */}
        {data.websiteStats && data.websiteStats.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Top Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.websiteStats.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {data.websiteStats.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Top Websites</CardTitle>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-2">No browser tracking data</p>
                <p className="text-sm">Install Chrome extension to track websites</p>
                <Button 
                  onClick={() => window.location.href = '/download-extension'}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Download Extension
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Events Section */}
      {data.upcomingEvents && data.upcomingEvents.length > 0 && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <p className="text-sm text-gray-600">Future scheduled events</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{data.upcomingEventCount}</p>
                <p className="text-xs text-gray-500">events</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{event.duration}h</span>
                      </div>
                    </div>
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {event.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {data.upcomingEvents.length > 5 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  +{data.upcomingEvents.length - 5} more upcoming events
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      {(!data.tagStats || data.tagStats.length === 0) && (!data.websiteStats || data.websiteStats.length === 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">How to Get Data Here</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>For Activity Charts:</strong></p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Go to <strong>Events</strong> tab</li>
                    <li>Click <strong>Add Event</strong></li>
                    <li>Add title, duration (in hours), and tags</li>
                    <li>Save event</li>
                    <li>Come back here to see charts!</li>
                  </ol>
                  <p className="mt-3"><strong>For Website Tracking:</strong></p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Download and install Chrome extension</li>
                    <li>Configure your User ID</li>
                    <li>Browse websites</li>
                    <li>Data syncs automatically!</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
