'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';

export default function AISummary() {
  const [period, setPeriod] = useState('daily');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai-summary?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        const error = await res.json();
        setError(error.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <CardTitle>AI Productivity Summary</CardTitle>
          </div>
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
      </CardHeader>
      <CardContent>
        {!summary && !loading && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Get AI-powered insights about your productivity
            </p>
            <Button onClick={fetchSummary} className="bg-gradient-to-r from-purple-600 to-indigo-600">
              Generate {period === 'daily' ? 'Daily' : 'Weekly'} Summary
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-600">Analyzing your productivity...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {summary && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <p className="text-sm text-gray-500 mb-2">{summary.periodLabel}</p>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">{summary.summary}</p>
            </div>

            {summary.stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Events</p>
                  <p className="text-xl font-bold text-indigo-600">{summary.stats.eventCount}</p>
                </div>
                {summary.stats.topTags && summary.stats.topTags.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                    <p className="text-xs text-gray-500 mb-2">Top Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {summary.stats.topTags.map((tag, i) => (
                        <span key={i} className="text-sm text-gray-700 bg-indigo-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={fetchSummary}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Regenerate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
