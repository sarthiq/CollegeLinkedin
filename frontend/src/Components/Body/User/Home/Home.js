import React, { useState } from 'react';
import './Home.css';
import Header from '../Header/Header';

const Home = ({ onLogout }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      authorImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      authorTitle: 'Computer Science Student at Stanford University',
      content: 'Just finished my final project for Data Structures! Anyone interested in collaborating on a machine learning project this summer?',
      likes: 24,
      comments: 8,
      timestamp: '2h ago'
    },
    {
      id: 2,
      author: 'Michael Chen',
      authorImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      authorTitle: 'Electrical Engineering at MIT',
      content: 'Looking for internship opportunities in robotics. Any recommendations for companies working on autonomous systems?',
      likes: 15,
      comments: 12,
      timestamp: '5h ago'
    },
    {
      id: 3,
      author: 'Emily Rodriguez',
      authorImage: 'https://randomuser.me/api/portraits/women/3.jpg',
      authorTitle: 'Business Administration at Harvard University',
      content: 'Excited to announce I\'ll be interning at Goldman Sachs this summer! Would love to connect with other finance enthusiasts.',
      likes: 42,
      comments: 15,
      timestamp: '1d ago'
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() === '') return;
    
    const post = {
      id: posts.length + 1,
      author: 'You',
      authorImage: 'https://randomuser.me/api/portraits/men/4.jpg',
      authorTitle: 'Student',
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <Header onLogout={handleLogout} />
      <div className="home-container" style={{ marginTop: '72px' }}>
        <div className="home-left">
          <div className="profile-card">
            <div className="profile-background"></div>
            <div className="profile-info">
              <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Profile" className="profile-image" />
              <h2>Your Name</h2>
              <p>Computer Science Student</p>
              <p>University of Technology</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">500+</span>
                  <span className="stat-label">Connections</span>
                </div>
                <div className="stat">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sidebar-card">
            <h3>Recent</h3>
            <ul className="sidebar-list">
              <li>Your Profile</li>
              <li>My Network</li>
              <li>Jobs</li>
              <li>Messaging</li>
              <li>Notifications</li>
            </ul>
          </div>
          
          <div className="sidebar-card">
            <h3>Groups</h3>
            <ul className="sidebar-list">
              <li>Computer Science Majors</li>
              <li>Data Science Enthusiasts</li>
              <li>Startup Founders</li>
              <li>Research Opportunities</li>
            </ul>
          </div>
          
          <div className="sidebar-card">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
        
        <div className="home-main">
          <div className="post-form-card">
            <div className="post-form-header">
              <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Profile" className="post-form-image" />
              <form onSubmit={handlePostSubmit}>
                <input 
                  type="text" 
                  placeholder="Start a post..." 
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="post-input"
                />
              </form>
            </div>
            <div className="post-form-actions">
              <button className="post-action-btn">
                <i className="fas fa-image"></i> Photo
              </button>
              <button className="post-action-btn">
                <i className="fas fa-video"></i> Video
              </button>
              <button className="post-action-btn">
                <i className="fas fa-calendar"></i> Event
              </button>
              <button className="post-action-btn post-submit-btn" onClick={handlePostSubmit}>
                Post
              </button>
            </div>
          </div>
          
          <div className="posts-container">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img src={post.authorImage} alt={post.author} className="post-author-image" />
                  <div className="post-author-info">
                    <h3>{post.author}</h3>
                    <p>{post.authorTitle}</p>
                    <span className="post-timestamp">{post.timestamp}</span>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-actions">
                  <button className="post-action">
                    <i className="fas fa-thumbs-up"></i> Like ({post.likes})
                  </button>
                  <button className="post-action">
                    <i className="fas fa-comment"></i> Comment ({post.comments})
                  </button>
                  <button className="post-action">
                    <i className="fas fa-share"></i> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="home-right">
          <div className="sidebar-card">
            <h3>News</h3>
            <ul className="news-list">
              <li>
                <h4>New Research Grant Opportunities</h4>
                <p>5d ago • 1,234 readers</p>
              </li>
              <li>
                <h4>Upcoming Career Fair</h4>
                <p>1w ago • 3,456 readers</p>
              </li>
              <li>
                <h4>Study Abroad Programs</h4>
                <p>2w ago • 2,789 readers</p>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-card">
            <h3>People You May Know</h3>
            <div className="people-list">
              <div className="person-card">
                <img src="https://randomuser.me/api/portraits/women/5.jpg" alt="Person" className="person-image" />
                <div className="person-info">
                  <h4>Jessica Lee</h4>
                  <p>Biology at UCLA</p>
                </div>
                <button className="connect-btn">Connect</button>
              </div>
              <div className="person-card">
                <img src="https://randomuser.me/api/portraits/men/6.jpg" alt="Person" className="person-image" />
                <div className="person-info">
                  <h4>David Wilson</h4>
                  <p>Psychology at NYU</p>
                </div>
                <button className="connect-btn">Connect</button>
              </div>
              <div className="person-card">
                <img src="https://randomuser.me/api/portraits/women/7.jpg" alt="Person" className="person-image" />
                <div className="person-info">
                  <h4>Amanda Taylor</h4>
                  <p>Economics at Columbia</p>
                </div>
                <button className="connect-btn">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
