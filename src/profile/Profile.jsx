import { useStore } from '../data/store';
import AuthScreen from '../auth/AuthScreen';
import AuthorProfile from './AuthorProfile';
export default function Profile() {
  const { user } = useStore();
  if (!user) return <AuthScreen />;
  return <AuthorProfile authorId={user.id} isOwnProfile={true} />;
}