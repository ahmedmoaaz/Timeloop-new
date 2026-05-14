'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Globe, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function BrowserActivity() {
  const { data: session } = useSession();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSites: 0,
    totalHours: 0,
    todayHours: 0,
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchActivityLogs();
    }
  }, [session]);

  const fetchActivityLogs = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/activity-log?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.logs || []);
        calculateStats(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
    setLoading(false);
  };

  const calculateStats = (logs) => {
    const uniqueSites = new Set(logs.map(log => log.website)).size;
    const totalMinutes = logs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);
    const totalHours = totalMinutes / 60;

    // Calculate today's hours
    const today = new Date().toDateString();
    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp).toDateString();
      return logDate === today;
    });
    const todayMinutes = todayLogs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);
    const todayHours = todayMinutes / 60;

    setStats({
      totalSites: uniqueSites,
      totalHours: parseFloat(totalHours.toFixed(2)),
      todayHours: parseFloat(todayHours.toFixed(2)),
    });
  };

  // Group logs by website
  const groupedLogs = activityLogs.reduce((acc, log) => {
    if (!acc[log.website]) {
      acc[log.website] = {
        website: log.website,
        visits: [],
        totalTime: 0,
      };
    }
    acc[log.website].visits.push(log);
    acc[log.website].totalTime += log.timeSpent || 0;
    return acc;
  }, {});

  const sortedWebsites = Object.values(groupedLogs).sort((a, b) => b.totalTime - a.totalTime);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            Please sign in to view browser activity
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">Loading browser activity...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browser Activity</h2>
        <Button onClick={fetchActivityLogs} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Websites Visited</p>
                <p className="text-2xl font-bold">{stats.totalSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Hours</p>
                <p className="text-2xl font-bold">{stats.todayHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website List */}
      <Card>
        <CardHeader>
          <CardTitle>Websites by Time Spent</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedWebsites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No browser activity tracked yet</p>
              <p className="text-sm text-gray-400">
                Install the Chrome extension and start browsing to see your activity here!
              </p>
              <Button
                onClick={() => window.location.href = '/download-extension'}
                variant="outline"
                className="mt-4"
              >
                Download Extension
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedWebsites.map((site) => {
                const hours = site.totalTime / 60;
                const percentage = Math.min((hours / stats.totalHours) * 100, 100);
                
                return (
                  <div key={site.website} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-indigo-100 p-2 rounded">
                          <Globe className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{site.website}</p>
                          <p className="text-xs text-gray-500">{site.visits.length} visits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">{formatTime(site.totalTime)}</p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      {activityLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.slice(0, 20).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{log.website}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), 'MMM d, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-indigo-600">
                      {formatTime(log.timeSpent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
