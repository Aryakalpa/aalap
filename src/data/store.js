import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
  user: null,
  view: 'main',
  viewData: null,
  activeTab: 'home',
  theme: localStorage.getItem('aalap-theme') || 'night',
  bookmarks: JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]'),

  setUser: (user) => set({ user }),
  
  setView: (view, data = null) => set({ view, viewData: data }),
  
  setTab: (tab) => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ activeTab: tab, view: 'main' });
  },
  
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aalap-theme', theme);
    set({ theme });
  },

  toggleBookmark: (post) => {
    const { bookmarks } = get();
    const exists = bookmarks.some(b => b.id === post.id);
    let newBookmarks = exists ? bookmarks.filter(b => b.id !== post.id) : [post, ...bookmarks];
    localStorage.setItem('aalap-bookmarks', JSON.stringify(newBookmarks));
    set({ bookmarks: newBookmarks });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, view: 'main', activeTab: 'home' });
  }
}));