'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, Chrome } from 'lucide-react';
import { useState } from 'react';

export default function ExtensionSetup() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const copyUserId = () => {
    if (session?.user?.id) {
      navigator.clipboard.writeText(session.user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            Please sign in to configure Chrome extension
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg">
          <Chrome className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Chrome Extension Setup</h2>
          <p className="text-sm text-gray-600">Connect your browser tracking to this account</p>
        </div>
      </div>

      {/* Step 1: Download */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-indigo-600">
              1
            </div>
            <CardTitle>Download Extension</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Download the TimeLoop Chrome extension to your computer
          </p>
          <Button
            onClick={() => window.location.href = '/download-extension'}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Extension
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Your User ID */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white">
              2
            </div>
            <div className="flex-1">
              <CardTitle>Your User ID</CardTitle>
              <CardDescription>Copy this ID and paste it in the Chrome extension</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border-2 border-green-300 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Your User ID:</p>
                <code className="text-lg font-mono font-bold text-indigo-600 break-all">
                  {session.user.id}
                </code>
              </div>
              <Button
                onClick={copyUserId}
                variant="outline"
                size="sm"
                className="ml-4 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> This ID connects the extension to YOUR account. 
              Keep it safe and don't share it.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Configure Extension */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-purple-600">
              3
            </div>
            <CardTitle>Configure Extension</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="text-purple-600 font-bold">a.</div>
              <div>
                <p className="font-medium">Install the extension in Chrome</p>
                <p className="text-gray-600">Extract ZIP → chrome://extensions/ → Load unpacked</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-purple-600 font-bold">b.</div>
              <div>
                <p className="font-medium">Click the ⏰ TimeLoop icon in Chrome toolbar</p>
                <p className="text-gray-600">Look for the clock icon next to your profile picture</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-purple-600 font-bold">c.</div>
              <div>
                <p className="font-medium">Paste your User ID (from Step 2 above)</p>
                <p className="text-gray-600">Enter it in the "Your User ID" field</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-purple-600 font-bold">d.</div>
              <div>
                <p className="font-medium">Click "Save Configuration"</p>
                <p className="text-gray-600">You should see "✓ Configured" in the Debug tab</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Test */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600">
              4
            </div>
            <CardTitle>Test & Verify</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="text-blue-600 font-bold">1.</div>
              <p>Browse to YouTube or any website for 15 seconds</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-600 font-bold">2.</div>
              <p>Switch to a different tab (this triggers save)</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-600 font-bold">3.</div>
              <p>Click extension icon → Check <strong>History</strong> tab → See your visit!</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-600 font-bold">4.</div>
              <p>Click <strong>"Sync Now"</strong> button in extension</p>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-600 font-bold">5.</div>
              <p>Come back here and check <strong>Browser Activity</strong> tab!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.href = '/download-extension'}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Extension
            </Button>
            <Button
              onClick={copyUserId}
              variant="outline"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy My User ID
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
