import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FriendsContext = createContext();

export const useFriends = () => {
  return useContext(FriendsContext);
};

export const FriendsProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFriends();
    } else {
      setFriends([]);
    }
  }, [isLoggedIn]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (username) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        fetchFriends(); // Refresh
        return { success: true, msg: data.msg };
      } else {
        return { success: false, msg: data.msg };
      }
    } catch (err) {
      return { success: false, msg: 'Network error' };
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
        credentials: 'include'
      });
      if (res.ok) {
        fetchFriends();
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  const removeFriend = async (friendId) => {
     try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
        credentials: 'include'
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FriendsContext.Provider value={{ friends, loading, sendRequest, acceptRequest, removeFriend, fetchFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};
