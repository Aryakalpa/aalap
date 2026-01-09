import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { Heart, MessageCircle, Trophy } from 'lucide-react';

export default function Notifications() {
    const { user, resetUnread } = useStore();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        resetUnread(); // Clear badge on view

        if (!user) return;
        const fetch = async () => {
            setLoading(true);
            // Fetch posts by current user to get their IDs
            const { data: myPosts } = await supabase.from('posts').select('id, title').eq('author_id', user.id);

            if (myPosts && myPosts.length > 0) {
                const postIds = myPosts.map(p => p.id);

                // Get Total Likes Count
                const { count: totalLikes } = await supabase
                    .from('likes')
                    .select('id', { count: 'exact', head: true })
                    .in('post_id', postIds);

                // Get Likes
                const { data: likes } = await supabase
                    .from('likes')
                    .select(`created_at, post_id, profiles(display_name, avatar_url)`)
                    .in('post_id', postIds)
                    .neq('user_id', user.id) // Don't show own likes
                    .order('created_at', { ascending: false })
                    .limit(20);

                // Get Comments
                const { data: comments } = await supabase
                    .from('comments')
                    .select(`created_at, post_id, body, profiles(display_name, avatar_url)`)
                    .in('post_id', postIds)
                    .neq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(20);

                // Merge & Sort
                const combined = [
                    ...(likes || []).map(i => ({ ...i, type: 'like', postTitle: myPosts.find(p => p.id === i.post_id)?.title })),
                    ...(comments || []).map(i => ({ ...i, type: 'comment', postTitle: myPosts.find(p => p.id === i.post_id)?.title }))
                ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                // Add Milestone (Total Likes)
                if (totalLikes > 0) {
                    combined.unshift({
                        type: 'milestone',
                        count: totalLikes,
                        created_at: new Date().toISOString() // Show at top
                    });
                }

                setList(combined);
            } else {
                setList([]);
            }
            setLoading(false);
        };
        fetch();
    }, [user]);

    if (!user) {
        return (
            <div style={{ padding: 40, textAlign: 'center', opacity: 0.8 }}>
                <p>Login to see notifications</p>
                <button onClick={() => navigate('/profile')} className="btn-soft">Login</button>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 100 }}>
            <h2 style={{ marginBottom: 20 }}>জাননী (Notifications)</h2>

            {loading && <div style={{ opacity: 0.5, textAlign: 'center' }}>লোড হৈ আছে...</div>}

            {!loading && list.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, border: '1px dashed var(--border-light)', borderRadius: 16 }}>
                    আপোনাৰ বাবে কোনো নতুন জাননী নাই
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                {list.map((item, i) => (
                    <div key={i} className="story-card" style={{ display: 'flex', alignItems: 'center', gap: 15, padding: 15, margin: 0 }}>

                        {/* MILESTONE RENDER */}
                        {item.type === 'milestone' ? (
                            <>
                                <div style={{
                                    minWidth: 40, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(255, 165, 0, 0.4)'
                                }}>
                                    <Trophy size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700 }}>অভিনন্দন! (Congratulations!)</div>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>
                                        আপুনি এতিয়ালৈকে মুঠ <b>{item.count}</b> টা লাইক অৰ্জন কৰিছে।
                                    </div>
                                </div>
                            </>
                        ) : (
                            // REGULAR NOTIFICATION RENDER
                            <>
                                <div style={{ position: 'relative' }}>
                                    <Avatar url={item.profiles?.avatar_url} size={40} />
                                    <div style={{
                                        position: 'absolute', bottom: -2, right: -2,
                                        background: 'var(--bg-card)', borderRadius: '50%', padding: 2
                                    }}>
                                        {item.type === 'like'
                                            ? <Heart size={14} fill="var(--danger)" color="var(--danger)" />
                                            : <MessageCircle size={14} fill="var(--text-main)" color="var(--text-main)" />}
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14 }}>
                                        <span style={{ fontWeight: 700 }}>{item.profiles?.display_name}</span>
                                        <span style={{ opacity: 0.8 }}>
                                            {item.type === 'like' ? ' আপোনাৰ লেখাত সঁহাৰি দিছে' : ' মন্তব্য কৰিছে'}
                                        </span>
                                    </div>

                                    {item.type === 'comment' && (
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                                            "{item.body}"
                                        </div>
                                    )}

                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                        {item.postTitle} • {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}