# Litera - Literature Social Media Platform

A minimal, feature-rich React + Vite web application for literature lovers. Share your stories, discover new voices, and connect with fellow writers.

## 🚀 Features

### Core
- ✅ **Light/Dark Theme** - Seamless theme switching with persistent preferences
- ✅ **Google OAuth** - Secure authentication via Supabase
- ✅ **Optional Login** - Browse and read without signing in

### Screens
- 🏠 **Home Feed** - Latest posts with category filtering
- 🔥 **Trending** - Popular posts by timeframe (today, week, month)
- ✍️ **Write** - Rich editor with auto-save, word count, and category selection
- 🔔 **Notifications** - Real-time alerts for likes, comments, follows
- 👤 **Profile** - Author pages with badges, achievements, and social links
- 📖 **Reader** - Feature-rich reading experience
- 🔍 **Search** - Full-text search with category filters

### Reading Experience
- Font size adjustment
- Line height controls
- Reading progress tracking
- Estimated reading time
- Auto-save scroll position
- Bookmark functionality

### Social Features
- Like, comment, bookmark posts
- Follow/unfollow authors
- Real-time notifications with unread counter
- Author profiles with badges & achievements
- Cover images for posts

### Achievements & Badges
- Novice (0-4 posts)
- Storyteller (5-19 posts)
- Rising Writer (20-49 posts)
- Acclaimed Author (50-99 posts)
- Master Wordsmith (100+ posts)

## 📦 Setup

### Prerequisites
- Node.js 18+
- Supabase account with configured database

### Installation

1. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```

2. **Configure environment variables:**
   - Open `.env` and add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url_here
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```

3. **Start the development server:**
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## 🗄️ Database Setup

Ensure your Supabase database has the schema matching the provided structure with these tables:
- `profiles` - User profiles
- `posts` - User-generated content
- `comments` - Post comments
- `likes` - Post likes
- `bookmarks` - Saved posts
- `follows` - User relationships
- `notifications` - Activity notifications
- `reading_progress` - Track reading position
- `works` - Literature works
- `literature` - Classic literature library

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Supabase** - Backend, auth, and real-time database
- **Vanilla CSS** - Styling with CSS variables

## 📁 Project Structure

```
antigravity/
├── src/
│   ├── components/      # Shared components
│   │   ├── Layout.jsx
│   │   ├── PostCard.jsx
│   │   └── ProfileBadge.jsx
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/           # Route pages
│   │   ├── Home.jsx
│   │   ├── Trending.jsx
│   │   ├── Write.jsx
│   │   ├── Notifications.jsx
│   │   ├── Profile.jsx
│   │   ├── Reader.jsx
│   │   └── Search.jsx
│   ├── utils/           # Helper functions
│   │   └── helpers.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── supabase.js      # Supabase client
├── index.html
├── package.json
├── vite.config.js
└── setup.ps1            # Setup script
```

## 🎨 Design Philosophy

- **Minimal Codebase** - Single-file components, no UI libraries
- **Premium Aesthetics** - Modern gradients, smooth animations, vibrant colors
- **Performance First** - Optimized bundle size, lazy loading
- **Accessibility** - Semantic HTML, keyboard navigation
- **Responsive** - Mobile-first design with bottom navigation

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication Flow

1. User clicks "Sign In with Google"
2. Redirected to Google OAuth
3. Profile automatically created in Supabase
4. Session persisted with localStorage
5. Real-time sync across tabs

## 📸 Features Showcase

### Real-time Notifications
- Instant updates when someone likes your post
- Comment notifications
- New follower alerts
- Unread badge counter

### Reading Progress
- Automatically saves scroll position
- Resume reading where you left off
- Track across all devices

### Badges & Achievements
- Earn badges based on post count and engagement
- Display achievements on profile
- Gamified writing experience

## 🚧 Future Enhancements

- Echo/repost functionality
- Rich text editor with markdown
- Image uploads via Supabase Storage
- PWA support for offline reading
- Export stories to PDF
- Reading lists/collections

## 📄 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

This is a minimal reference implementation. Fork and customize as needed!

---

Built with ❤️ for literature lovers everywhere.
