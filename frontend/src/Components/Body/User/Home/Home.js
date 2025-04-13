import React, { useState } from 'react';
import { Feed } from '../Common/Feed/Feed';
import './Home.css';

export const Home = () => {
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        title: 'Computer Science Student'
      },
      content: 'Just completed my final year project!',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      likes: [
        { id: 1, user: 'Alice Smith' },
        { id: 2, user: 'Bob Johnson' }
      ],
      comments: [
        { 
          id: 1, 
          user: {
            name: 'Alice Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
          }, 
          text: 'Congratulations!', 
          timestamp: '1h ago' 
        },
        { 
          id: 2, 
          user: {
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
          },
          text: 'Great work!', 
          timestamp: '45m ago' 
        }
      ],
      timestamp: '2h ago',
      showComments: false
    }
  ]);

  const handlePostSubmit = (content, image, callback) => {
    if (content.trim() || image) {
      const newFeed = {
        id: feeds.length + 1,
        user: {
          name: 'Current User',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          title: 'Student'
        },
        content,
        image,
        likes: [],
        comments: [],
        timestamp: 'Just now',
        showComments: false
      };
      setFeeds([newFeed, ...feeds]);
      callback();
    }
  };

  const handleLike = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId 
        ? { 
            ...feed, 
            likes: [...feed.likes, { id: Date.now(), user: 'Current User' }]
          }
        : feed
    ));
  };

  const handleComment = (feedId, commentText) => {
    if (commentText.trim()) {
      setFeeds(feeds.map(feed => 
        feed.id === feedId 
          ? { 
              ...feed, 
              comments: [
                ...feed.comments, 
                { 
                  id: Date.now(), 
                  user: {
                    name: 'Current User',
                    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
                  },
                  text: commentText,
                  timestamp: 'Just now'
                }
              ]
            }
          : feed
      ));
    }
  };

  return (
    <div className="home-container">
      <Feed 
        feeds={feeds}
        onPostSubmit={handlePostSubmit}
        onLike={handleLike}
        onComment={handleComment}
        showCreatePost={true}
      />
    </div>
  );
};

