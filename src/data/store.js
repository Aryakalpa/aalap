import { create } from 'zustand';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export const useStore = create((set, get) => ({
  user: null,
  profile: null,
  view: 'main', 
  viewData: null,
  bookmarks: [],
  theme: localStorage.getItem('aalap-theme') || 'paper',
  
  setView: (view, data = null) => set({ view, viewData: data }),
  
  initAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const saved = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
        set({ user, profile, bookmarks: saved });
      }
    } catch (e) { console.error("Auth Error", e); }
  },

  toggleBookmark: (post) => {
    const { bookmarks } = get();
    const exists = bookmarks.find(b => b.id === post.id);
    let newBookmarks;
    if (exists) {
        newBookmarks = bookmarks.filter(b => b.id !== post.id);
        toast.message('আঁতৰোৱা হ\'ল'); // Removed
    } else {
        newBookmarks = [post, ...bookmarks];
        toast.success('সাঁচি থোৱা হ\'ল'); // Saved
    }
    set({ bookmarks: newBookmarks });
    localStorage.setItem('aalap-bookmarks', JSON.stringify(newBookmarks));
  },

  setTheme: (theme) => {
    localStorage.setItem('aalap-theme', theme);
    set({ theme });
    document.body.className = `theme-${theme}`;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, view: 'main' });
    toast('পুনৰ লগ পাম।'); // Will meet again
  }
}));