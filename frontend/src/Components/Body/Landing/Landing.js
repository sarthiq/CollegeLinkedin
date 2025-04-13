import React from 'react';
import './Landing.css';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../Store/User/auth';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleJoinNow = () => {
    dispatch(userLogin());
    navigate('/');
  };

  const handleSignIn = () => {
    dispatch(userLogin());
    navigate('/');
  };
  
  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="landing-logo">
          <h1>SarthiQ</h1>
        </div>
        <div className="landing-nav">
          <button className="nav-btn" onClick={handleJoinNow}>Join now</button>
          <button className="nav-btn nav-btn-secondary" onClick={handleSignIn}>Sign in</button>
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-left">
          <h1 className="landing-title">Welcome to the college community!</h1>
          <p className="landing-description">
            A platform for students to Learn, Engage, Contribute, and Earn.
          </p>
          <p className="landing-agreement">
            By clicking Continue to join or sign in, you agree to LinkedIn's <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
          </p>
          <p className="landing-join">
            New to LinkedIn? <a href="#">Join now</a>
          </p>
        </div>
        <div className="landing-right">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="College students collaborating"
            className="landing-image"
          />
        </div>
      </div>
    </div>
  );
};
