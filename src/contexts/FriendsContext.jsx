import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FriendsContext = createContext();

export const useFriends = () => {
  return useContext(FriendsContext);
};

export const FriendsProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFriends();
      fetchBlockedUsers();
    } else {
      setFriends([]);
      setBlockedUsers([]);
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

  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/blocked`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const blockUser = async (userId, reason = '') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        fetchBlockedUsers();
        fetchFriends(); // Refresh friends list as they may have been removed
        return { success: true, msg: data.msg };
      } else {
        return { success: false, msg: data.msg };
      }
    } catch (err) {
      return { success: false, msg: 'Network error' };
    }
  };

  const unblockUser = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        fetchBlockedUsers();
        return { success: true, msg: data.msg };
      } else {
        return { success: false, msg: data.msg };
      }
    } catch (err) {
      return { success: false, msg: 'Network error' };
    }
  };

  const reportUser = async (userId, reason, details = '') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/friends/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason, details }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, msg: data.msg };
      } else {
        return { success: false, msg: data.msg };
      }
    } catch (err) {
      return { success: false, msg: 'Network error' };
    }
  };

  return (
    <FriendsContext.Provider value={{ 
      friends, 
      blockedUsers,
      loading, 
      sendRequest, 
      acceptRequest, 
      removeFriend, 
      fetchFriends,
      fetchBlockedUsers,
      blockUser,
      unblockUser,
      reportUser
    }}>
      {children}
    </FriendsContext.Provider>
  );
};
