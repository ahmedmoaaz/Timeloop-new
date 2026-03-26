# TimeLoop - AI-Powered Productivity Tracker

A full-stack web application that helps you track productivity, analyze time usage, and get AI-powered insights about your daily activities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure Google OAuth login via NextAuth.js
- **Event Management**: Create, read, update, and delete productivity events
- **Smart Search**: Search events by title, content, or tags
- **Date Filtering**: Filter events by date range
- **Timeline View**: Beautiful chronological display of events grouped by date

### Analytics & Insights
- **Visual Analytics**: Interactive charts showing time distribution by activity
- **Daily & Weekly Views**: Toggle between different time periods
- **Website Tracking**: Integration with Chrome extension for automatic browser activity tracking
- **AI Summaries**: OpenAI-powered productivity insights and recommendations

### Chrome Extension
- **Automatic Tracking**: Tracks time spent on websites
- **Background Sync**: Sends data to backend every 5 minutes
- **Privacy-Focused**: Only tracks domain-level data
- **Real-time Stats**: View browsing activity in extension popup

## 🛠️ Tech Stack

### Frontend & Backend
- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with native driver
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI**: OpenAI API (GPT-4o-mini)

### Chrome Extension
- **Manifest V3**: Modern extension architecture
- **Service Worker**: Background tracking
- **Chrome Storage API**: Local data persistence

## 📦 Installation

### Prerequisites
- Node.js 18+ and Yarn
- MongoDB running locally or remotely
- Google OAuth credentials
- OpenAI API key

### Setup

1. **Clone and install dependencies**:
```bash
cd /app
yarn install
```

2. **Environment Variables**:
The `.env` file is already configured with:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=timeloop_db
NEXT_PUBLIC_BASE_URL=https://productivity-ai-35.preview.emergentagent.com
NEXTAUTH_URL=https://productivity-ai-35.preview.emergentagent.com
NEXTAUTH_SECRET=timeloop-secret-key-2024-production-ready
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
```

3. **Start the development server**:
```bash
sudo supervisorctl restart all
```

The app will be available at: https://productivity-ai-35.preview.emergentagent.com

## 📱 Usage

### Web Application

1. **Sign In**: Click "Get Started" and sign in with your Google account

2. **Add Events**: 
   - Click "Add Event" button
   - Fill in title, description, date/time, duration
   - Add tags to categorize (e.g., "coding", "meeting", "learning")
   - Save event

3. **View Timeline**:
   - Events are grouped by date
   - Each event shows duration and tags
   - Edit or delete events using the buttons

4. **Search & Filter**:
   - Use the search bar to find events by title, content, or tags
   - Set date range filters to narrow down results

5. **View Analytics**:
   - Switch to "Analytics" tab
   - Toggle between daily and weekly views
   - See charts showing time distribution by activity
   - View top websites from browser tracking

6. **Get AI Insights**:
   - Switch to "AI Insights" tab
   - Choose daily or weekly period
   - Click "Generate Summary"
   - Receive personalized productivity analysis and suggestions

### Chrome Extension

1. **Install Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `/app/chrome-extension` folder

2. **Configure**:
   - Click the TimeLoop extension icon
   - Enter your User ID (find this in your dashboard - it's the user ID from Google OAuth)
   - Click "Save Configuration"

3. **Automatic Tracking**:
   - Extension automatically tracks time on websites
   - Data syncs every 5 minutes
   - View current session stats in the popup
   - Manual sync available with "Sync Now" button

## 🗂️ Project Structure

```
/app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth.js routes
│   │   ├── events/                 # CRUD operations for events
│   │   ├── analytics/              # Analytics data endpoint
│   │   ├── ai-summary/             # AI summary generation
│   │   └── activity-log/           # Chrome extension data receiver
│   ├── dashboard/                  # Main dashboard page
│   ├── auth/signin/                # Custom sign-in page
│   ├── layout.js                   # Root layout with providers
│   └── page.js                     # Landing page
├── components/
│   ├── dashboard/
│   │   ├── EventForm.js           # Form for creating/editing events
│   │   ├── EventCard.js           # Single event display
│   │   ├── EventList.js           # Timeline list of events
│   │   ├── Analytics.js           # Analytics charts and stats
│   │   └── AISummary.js           # AI insights component
│   ├── ui/                        # shadcn/ui components
│   └── Providers.js               # Session provider wrapper
├── lib/
│   ├── mongodb.js                 # MongoDB connection handler
│   └── auth.js                    # NextAuth configuration
├── chrome-extension/
│   ├── manifest.json              # Extension manifest
│   ├── background.js              # Service worker for tracking
│   ├── popup.html                 # Extension popup UI
│   ├── popup.js                   # Popup functionality
│   └── README.md                  # Extension documentation
└── .env                           # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out

### Events
- `GET /api/events` - Get all events (with optional search/filter params)
- `POST /api/events` - Create new event
- `PUT /api/events` - Update existing event
- `DELETE /api/events?id={eventId}` - Delete event

### Analytics
- `GET /api/analytics?period={daily|weekly}` - Get analytics data

### AI Summary
- `GET /api/ai-summary?period={daily|weekly}` - Generate AI summary

### Activity Tracking
- `POST /api/activity-log` - Receive data from Chrome extension
- `GET /api/activity-log?userId={userId}` - Get activity logs

## 📊 Database Schema

### Users Collection
```javascript
{
  userId: String,      // From Google OAuth
  email: String,
  name: String,
  image: String,
  createdAt: Date
}
```

### Events Collection
```javascript
{
  id: UUID,
  userId: String,
  title: String,
  content: String,
  tags: [String],
  date: Date,
  duration: Number,    // in hours
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Logs Collection
```javascript
{
  id: UUID,
  userId: String,
  website: String,     // domain name
  url: String,
  timeSpent: Number,   // in minutes
  timestamp: Date,
  createdAt: Date
}
```

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible design:
- Button, Input, Textarea
- Card, Avatar
- Tabs, Dialog
- Charts (Recharts integration)

## 🔐 Security

- **Authentication**: Secure Google OAuth via NextAuth.js
- **Session Management**: Server-side session handling
- **Data Isolation**: Each user can only access their own data
- **API Protection**: All endpoints check authentication
- **Environment Variables**: Sensitive keys stored in `.env`

## 🚢 Deployment

The application is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

MongoDB connection and all other services will work automatically.

## 🧪 Testing

After making changes, test the following flows:

### Authentication Flow
1. Sign in with Google
2. Verify redirect to dashboard
3. Check session persistence
4. Sign out

### Events CRUD
1. Create event with tags
2. Edit event details
3. Delete event
4. Search events
5. Filter by date range

### Analytics
1. View daily analytics
2. Switch to weekly view
3. Verify charts render correctly

### AI Summary
1. Generate daily summary
2. Generate weekly summary
3. Verify meaningful output

### Chrome Extension
1. Install and configure
2. Browse websites
3. Check tracking in popup
4. Verify sync to backend
5. See data in dashboard analytics

## 🐛 Troubleshooting

### Common Issues

**Authentication not working:**
- Verify Google OAuth credentials in `.env`
- Check NEXTAUTH_URL matches your deployment URL
- Ensure callback URL is configured in Google Console

**Database connection failed:**
- Check MongoDB is running: `sudo systemctl status mongodb`
- Verify MONGO_URL in `.env`
- Check network connectivity

**AI summary fails:**
- Verify OPENAI_API_KEY is valid
- Check API quota/billing
- Look at server logs for error details

**Chrome extension not syncing:**
- Verify User ID is entered correctly
- Check browser console for errors
- Ensure backend URL is accessible
- Try manual sync

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional chart types
- Export functionality
- Mobile app
- Team collaboration features
- More AI insights

## 📧 Support

For issues or questions:
- Check documentation above
- Review code comments
- Check browser/server console logs

---

Built with ❤️ using Next.js, MongoDB, and OpenAI
