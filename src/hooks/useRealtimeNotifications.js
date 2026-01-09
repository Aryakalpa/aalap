import { useEffect, useRef } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import toast from 'react-hot-toast';

export function useRealtimeNotifications() {
    const { user } = useStore();
    const myPostIds = useRef(new Set());

    useEffect(() => {
        if (!user) return;

        // 1. Fetch user's post IDs to know which likes to care about
        const fetchMyPosts = async () => {
            const { data } = await supabase.from('posts').select('id').eq('author_id', user.id);
            if (data) {
                myPostIds.current = new Set(data.map(p => p.id));
            }
        };
        fetchMyPosts();

        // 2. Subscribe to Realtime Likes
        const channel = supabase
            .channel('public:likes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, async (payload) => {
                const newLike = payload.new;

                // Filter: Must be on my post AND not by me
                if (myPostIds.current.has(newLike.post_id) && newLike.user_id !== user.id) {

                    // Fetch liker's name for better UX
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('display_name')
                        .eq('id', newLike.user_id)
                        .single();

                    const name = profile?.display_name || 'Someone';

                    toast(`${name} liked your story!`, {
                        icon: '❤️',
                        style: {
                            borderRadius: '20px',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-light)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        duration: 4000
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);
}
