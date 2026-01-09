import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
  user: null,
  theme: localStorage.getItem('aalap-theme') || 'night',

  // NEW: Share State
  shareTarget: null,
  setShareTarget: (post) => set({ shareTarget: post }),

  // HELPER: Get Badges
  getBadges: (stats) => {
    const badges = [];
    // 1. Writer Status
    if (stats.posts < 5) badges.push({ id: 'nabagata', label: 'নৱাগত', color: '#888' });
    else badges.push({ id: 'kobi', label: 'কবি', color: '#FFD700' });

    // 2. Popularity
    if (stats.likes > 50) badges.push({ id: 'janapriya', label: 'জনপ্ৰিয়', color: '#ff4b4b' });

    // 3. Reader Status (Paathak)
    if (stats.comments > 20) badges.push({ id: 'paathak', label: 'পাঠক', color: '#4CAF50' });

    return badges;
  },

  bookmarks: (() => {
    try { return JSON.parse(localStorage.getItem('aalap-bookmarks')) || []; }
    catch { return []; }
  })(),

  setUser: (user) => set({ user }),

  setTheme: (theme) => {
    if (theme === 'paper') document.documentElement.classList.add('theme-paper');
    else document.documentElement.classList.remove('theme-paper');
    localStorage.setItem('aalap-theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'night' ? 'paper' : 'night';
    get().setTheme(next);
  },

  // NEW: Unread Notifications
  unreadCount: parseInt(localStorage.getItem('aalap-unread') || '0'),
  incUnread: () => {
    const next = get().unreadCount + 1;
    localStorage.setItem('aalap-unread', next);
    set({ unreadCount: next });
  },
  resetUnread: () => {
    localStorage.setItem('aalap-unread', '0');
    set({ unreadCount: 0 });
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
    set({ user: null });
  }
}));