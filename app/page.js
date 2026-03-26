'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp, Brain, Calendar, Target, Zap } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TimeLoop
            </h1>
          </div>
          <Button 
            onClick={() => router.push('/auth/signin')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Get Started
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-6">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              AI-Powered Productivity Tracking
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Master Your Time,
            <br />
            Boost Your Productivity
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track every moment, understand your habits, and unlock your full potential with AI-powered insights
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/auth/signin')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8"
            >
              Start Tracking Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Event Tracking</h3>
              <p className="text-gray-600">
                Log your activities with detailed events. Track time spent, add tags, and organize your day effortlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
              <p className="text-gray-600">
                Beautiful charts and graphs show exactly where your time goes. Daily and weekly insights at a glance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Insights</h3>
              <p className="text-gray-600">
                Get personalized productivity summaries powered by OpenAI. Understand patterns and improve daily.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chrome Extension</h3>
              <p className="text-gray-600">
                Automatic website tracking. See exactly how much time you spend on different sites throughout your day.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find any event instantly. Search by title, content, tags, or date range. Your data, always accessible.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Timeline View</h3>
              <p className="text-gray-600">
                See your events in a beautiful chronological timeline. Grouped by date for easy navigation and review.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Productivity?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are taking control of their time with TimeLoop
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/auth/signin')}
            className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8"
          >
            Get Started Now - It's Free
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-600">
          <p>&copy; 2024 TimeLoop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
