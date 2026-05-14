'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Chrome, CheckCircle2 } from 'lucide-react';

export default function DownloadExtension() {
  const handleDownload = () => {
    window.location.href = '/chrome-extension.zip';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <Chrome className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">TimeLoop Chrome Extension</h1>
          <p className="text-gray-600">Track your browsing activity automatically</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Extension
            </CardTitle>
            <CardDescription>
              Download the extension package and install it in Chrome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg py-6"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download chrome-extension.zip
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installation Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Download & Extract</h3>
                <p className="text-sm text-gray-600">
                  Click the download button above to get <code className="bg-gray-100 px-2 py-1 rounded">chrome-extension.zip</code>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Extract the ZIP file to a folder on your computer (right-click → Extract)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Open Chrome Extensions</h3>
                <p className="text-sm text-gray-600">
                  In Chrome, go to: <code className="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Or click: Menu (⋮) → Extensions → Manage Extensions
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Enable Developer Mode</h3>
                <p className="text-sm text-gray-600">
                  Toggle the <strong>Developer mode</strong> switch (top-right corner) to ON
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Load Unpacked Extension</h3>
                <p className="text-sm text-gray-600">
                  Click <strong>Load unpacked</strong> button
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Select the <strong>extracted chrome-extension folder</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pin the Extension</h3>
                <p className="text-sm text-gray-600">
                  Click the puzzle piece icon 🧩 in Chrome toolbar
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Find "TimeLoop Tracker" and click the pin icon 📌
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Configure & Start Tracking</h3>
                <p className="text-sm text-gray-600">
                  Click the ⏰ TimeLoop icon in toolbar
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your User ID and click Save
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Start browsing - data will appear in the History tab!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Tracking</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Visit pages for at least 3 seconds to track</li>
            <li>• Data saves when you switch tabs or close tabs</li>
            <li>• Click the extension icon to see your activity</li>
            <li>• Check the Debug tab to verify tracking is working</li>
            <li>• Data syncs to dashboard every 5 minutes</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
