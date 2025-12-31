import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
  user: null,
  view: 'main',
  viewData: null,
  activeTab: 'home',
  theme: localStorage.getItem('aalap-theme') || 'night',
  bookmarks: (() => {
    try { return JSON.parse(localStorage.getItem('aalap-bookmarks')) || []; } 
    catch { return []; }
  })(),

  setUser: (user) => set({ user }),
  setView: (view, data = null) => set({ view, viewData: data }),
  setTab: (tab) => set({ activeTab: tab, view: 'main' }),
  
  toggleTheme: () => {
    const next = get().theme === 'night' ? 'paper' : 'night';
    if (next === 'paper') document.documentElement.classList.add('theme-paper');
    else document.documentElement.classList.remove('theme-paper');
    localStorage.setItem('aalap-theme', next);
    set({ theme: next });
  },

  setTheme: (theme) => {
    if (theme === 'paper') document.documentElement.classList.add('theme-paper');
    else document.documentElement.classList.remove('theme-paper');
    localStorage.setItem('aalap-theme', theme);
    set({ theme });
  },

  toggleBookmark: (post) => {
    const { bookmarks } = get();
    const safe = Array.isArray(bookmarks) ? bookmarks : [];
    const exists = safe.some(b => b && b.id === post.id);
    const next = exists ? safe.filter(b => b.id !== post.id) : [post, ...safe];
    localStorage.setItem('aalap-bookmarks', JSON.stringify(next));
    set({ bookmarks: next });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, view: 'main', activeTab: 'home' });
  }
}));