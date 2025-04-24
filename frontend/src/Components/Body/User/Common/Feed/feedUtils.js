import { toast } from 'react-toastify';

export const handleShare = (feedId) => {
  const shareUrl = `${window.location.origin}/dashboard/feed/${feedId}`;
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch(() => {
      toast.error('Failed to copy link', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const renderActionButtons = (feed, handleLike, toggleComments, handleShare) => {
  return (
    <div className="feed-details-actions">
      <button 
        className={`feed-action-button ${feed.isLiked ? 'liked' : ''}`}
        onClick={handleLike}
      >
        <span className="feed-icon">👍</span>
        <span className="feed-action-text">{feed.isLiked ? 'Liked' : 'Like'}</span>
      </button>
      <button 
        className="feed-action-button"
        onClick={toggleComments}
      >
        <span className="feed-icon">💬</span>
        <span className="feed-action-text">Comment</span>
      </button>
      <button 
        className="feed-action-button"
        onClick={() => handleShare(feed.id)}
      >
        <span className="feed-icon">↗️</span>
        <span className="feed-action-text">Share</span>
      </button>
    </div>
  );
}; 