import { useStore } from '../data/store';
import AuthScreen from '../auth/AuthScreen';
import AuthorProfile from './AuthorProfile';

export default function Profile() {
  const { user } = useStore();

  // If guest, show the Login Screen here
  if (!user) {
    return <AuthScreen />;
  }

  // If logged in, show their own profile
  return <AuthorProfile authorId={user.id} isOwnProfile={true} />;
}