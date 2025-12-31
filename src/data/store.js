import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
  user: null,
  view: 'main',
  viewData: null,
  theme: 'paper',
  bookmarks: JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]'),
  
  // NEW: Global Tab State (so we can switch tabs from anywhere)
  // We'll expose this via a setter, but the state usually lives in AppShell.
  // Actually, keeping state in AppShell is cleaner for React, but for deep links
  // we might need a global trigger. For now, let's keep it simple.
  // Wait, `AppShell` owns the `tab` state. We can't easily control it from `PostCard`
  // unless we move it to the store. Let's move it!
  
  activeTab: 'home',
  setTab: (tab) => set({ activeTab: tab, view: 'main' }),

  setUser: (user) => set({ user }),
  setView: (view, data = null) => set({ view, viewData: data }),
  setTheme: (theme) => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('aalap-theme', theme);
    set({ theme });
  },
  
  toggleBookmark: (post) => {
    const { bookmarks } = get();
    const exists = bookmarks.some(b => b.id === post.id);
    const newBookmarks = exists 
      ? bookmarks.filter(b => b.id !== post.id) 
      : [post, ...bookmarks];
    
    localStorage.setItem('aalap-bookmarks', JSON.stringify(newBookmarks));
    set({ bookmarks: newBookmarks });
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, view: 'main', activeTab: 'home' });
  }
}));