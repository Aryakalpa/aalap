import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
  user: null,
  view: 'main',
  viewData: null,
  activeTab: 'home',
  theme: localStorage.getItem('aalap-theme') || 'night',
  // CRASH GUARD: Default to empty array if local storage fails
  bookmarks: (() => {
    try { return JSON.parse(localStorage.getItem('aalap-bookmarks')) || []; } 
    catch { return []; }
  })(),

  setUser: (user) => set({ user }),
  setView: (view, data = null) => set({ view, viewData: data }),
  setTab: (tab) => set({ activeTab: tab, view: 'main' }),
  
  toggleTheme: () => {
    const next = get().theme === 'night' ? 'paper' : 'night';
    if (next === 'paper') document.body.classList.add('theme-paper');
    else document.body.classList.remove('theme-paper');
    localStorage.setItem('aalap-theme', next);
    set({ theme: next });
  },

  toggleBookmark: (post) => {
    const { bookmarks } = get();
    // CRASH GUARD: Defensive checks
    const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
    const exists = safeBookmarks.some(b => b && b.id === post.id);
    const newBookmarks = exists 
       ? safeBookmarks.filter(b => b.id !== post.id) 
       : [post, ...safeBookmarks];
    
    localStorage.setItem('aalap-bookmarks', JSON.stringify(newBookmarks));
    set({ bookmarks: newBookmarks });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, view: 'main', activeTab: 'home' });
  }
}));