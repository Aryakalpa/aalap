import toast from 'react-hot-toast';

export const sharePost = async (post) => {
  const author = post.profiles?.display_name || 'Anonymous';
  const url = `${window.location.origin}/?post=${post.id}`;
  
  // The rich text that appears in WhatsApp/Messages
  const title = `✨ আলাপত পঢ়ক: "${post.title}"`;
  const text = `Read "${post.title}" by ${author} on Aalap.\n\n`;

  // 1. Try Native Share (Mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url
      });
      // No toast needed here, the OS handles UI
    } catch (err) {
      // User cancelled share, do nothing
      console.log('Share cancelled');
    }
  } 
  // 2. Fallback to Clipboard (Desktop)
  else {
    try {
      await navigator.clipboard.writeText(`${text}${url}`);
      toast.success('লিংক কপি কৰা হ’ল (Link Copied)');
    } catch (err) {
      toast.error('Failed to copy');
    }
  }
};