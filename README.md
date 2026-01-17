# আলাপা (Aalap) - A Premium Assamese Literature Platform

**Aalap** is a modern, feature-rich social platform dedicated to Assamese literature. Built with React, Vite, and Supabase, it provides a sanctuary for writers to share their stories and for readers to explore the rich tapestry of Assamese language and culture.

![Aalap Preview](https://raw.githubusercontent.com/Aryakalpa/aalap/main/public/preview.png)

## 🌟 Key Features

### 📖 Immersive Reading
- **Personalized Reader**: Adjust font size, font family (Tiro Bangla or Hind Siliguri), and text alignment on the fly.
- **Reading Themes**: Switch between Light, Dark (AMOLED), and Paper modes for maximum comfort.
- **Progress Tracking**: Automatically saves your scroll position so you can resume exactly where you left off.
- **Series & Collections**: Experience structured storytelling with a "Playlist-style" navigator for connected writings (Dharabahik).

### ✍️ Empowering Writers
- **Elegant Editor**: A distraction-free writing environment with real-time word count and auto-save functionality.
- **Draft Management**: Save your work as a draft until you're ready to share it with the world.
- **Metadata Support**: Easily add cover images, category tags, and series info to your posts.

### 🤝 Community & Engagement
- **Social Interactions**: Like, comment, and bookmark your favorite writings.
- **Follow System**: Connect with your favorite authors and stay updated on their latest works.
- **Real-time Notifications**: Get instant alerts for likes, comments, and new followers.
- **Gamified Profiles**: Earn badges and achievements based on your writing activity and community impact.

### 🎯 Discovery
- **Trending Feed**: Explore popular literature based on daily, weekly, or monthly engagement.
- **Full-text Search**: Find specific stories, poems, or authors with ease.
- **Category Filtering**: Browse by Poetry (কবিতা), Story (গল্প), Essay (প্ৰৱন্ধ), and more.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6
- **Backend & Auth**: Supabase (PostgreSQL + Real-time)
- **Styling**: Modern Vanilla CSS with CSS Variables & Glassmorphism
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryakalpa/aalap.git
   cd aalap
   ```

2. **Run the setup script:**
   ```powershell
   # On Windows
   .\setup.ps1
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

Aalap is designed to feel like a premium physical book in a digital space. We prioritize:
- **Assamese First**: Native language support is at the core of every design decision.
- **Minimalism**: Focusing on the content without distracting UI elements.
- **Performance**: Near-instant load times and smooth transitions.
- **Accessibility**: Ensuring the beauty of Assamese literature is accessible to everyone on any device.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

আলাপ - শব্দৰ অনুভূতি, সাহিত্যৰ সাৰথি।
