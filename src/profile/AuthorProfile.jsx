import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import PostCard from '../posts/PostCard';
import { Settings, LogOut, Edit3, UserPlus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthorProfile({ authorId }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, signOut } = useStore();

    // Use prop if provided (cleaner for explicit profile view), else use param
    const activeId = authorId || id;

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0, likes_received: 0, comments_made: 0 }); // UPDATED

    const isOwnProfile = user && activeId && user.id === activeId;
    const badges = useStore.getState().getBadges({ posts: posts.length, likes: stats.likes_received, comments: stats.comments_made }); // CALCULATE BADGES

    useEffect(() => {
        if (!activeId) return;
        // 1. Get Profile
        supabase.from('profiles').select('*').eq('id', activeId).single().then(({ data }) => setProfile(data));
        // 2. Get Posts
        supabase.from('posts').select(`*, profiles(*)`).eq('author_id', activeId).order('created_at', { ascending: false }).then(({ data }) => setPosts(data || []));

        // 3. Get Follow Status & Counts
        const loadSocials = async () => {
            const { count: followers } = await supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', activeId);
            const { count: following } = await supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', activeId);

            // 4. Get Badge Stats
            const { data: myPostIds } = await supabase.from('posts').select('id').eq('author_id', activeId);
            let totalLikes = 0;
            if (myPostIds && myPostIds.length > 0) {
                const { count } = await supabase.from('likes').select('id', { count: 'exact', head: true }).in('post_id', myPostIds.map(p => p.id));
                totalLikes = count || 0;
            }

            const { count: comments_made } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', activeId);

            setStats({ followers: followers || 0, following: following || 0, likes_received: totalLikes, comments_made: comments_made || 0 });

            if (user && !isOwnProfile) {
                const { data } = await supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('following_id', activeId).maybeSingle();
                if (data) setIsFollowing(true);
            }
        };
        loadSocials();
    }, [activeId, user, isOwnProfile]);

    const handleFollow = async () => {
        if (!user) { toast.error('লগ-ইন কৰক'); navigate('/profile'); return; }

        if (isFollowing) {
            // Unfollow
            const { error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', activeId);
            if (!error) {
                setIsFollowing(false);
                setStats(s => ({ ...s, followers: s.followers - 1 }));
                toast.success('Unfollowed');
            }
        } else {
            // Follow
            const { error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: activeId });
            if (!error) {
                setIsFollowing(true);
                setStats(s => ({ ...s, followers: s.followers + 1 }));
                toast.success('Following');
            }
        }
    };

    if (!profile) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Loading...</div>;

    return (
        <div>
            <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <Avatar url={profile.avatar_url} size={80} />
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.2 }}>{profile.display_name}</h2>

                    {/* BADGES */}
                    <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                        {badges.map(b => (
                            <span key={b.id} style={{
                                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                                background: b.color, color: '#fff', fontWeight: 700
                            }}>
                                {b.label}
                            </span>
                        ))}
                    </div>

                    {/* Social Stats */}
                    <div style={{ display: 'flex', gap: 15, fontSize: 13, opacity: 0.8, marginTop: 10 }}>
                        <span><b>{stats.followers}</b> Followers</span>
                        <span><b>{stats.following}</b> Following</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
                {isOwnProfile ? (
                    <>
                        <button onClick={() => navigate('/profile/edit')} className="btn-soft"><Edit3 size={16} /> Edit</button>
                        <button onClick={() => navigate('/settings')} className="btn-soft"><Settings size={16} /> Settings</button>
                        <button onClick={signOut} className="btn-soft" style={{ color: 'var(--danger)', background: 'rgba(255,0,0,0.1)' }}><LogOut size={18} /></button>
                    </>
                ) : (
                    <button
                        onClick={handleFollow}
                        className="btn-soft"
                        style={{
                            background: isFollowing ? 'transparent' : 'var(--text-main)',
                            color: isFollowing ? 'var(--text-main)' : 'var(--bg-body)',
                            border: isFollowing ? '1px solid var(--border-light)' : 'none',
                            flex: 1, justifyContent: 'center'
                        }}
                    >
                        {isFollowing ? <><UserCheck size={18} /> Following</> : <><UserPlus size={18} /> Follow</>}
                    </button>
                )}
            </div>

            {profile.bio && <div style={{ padding: '0 20px 20px', opacity: 0.8, fontSize: 15, lineHeight: 1.5 }}>{profile.bio}</div>}

            <div style={{ padding: 20, borderTop: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: 12, opacity: 0.5, marginBottom: 20, letterSpacing: 1, fontFamily: 'Inter' }}>STORIES ({posts.length})</h3>
                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
        </div>
    );
}