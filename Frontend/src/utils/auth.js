// Auth utility functions
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const setUser = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const getUserName = () => {
  const user = getUser();
  return user?.fullname || 'Người dùng';
};

export const getUserUsername = () => {
  const user = getUser();
  return user?.user_name || null;
};

export const getUserId = () => {
  const user = getUser();
  return user?.user_id || null;
};

export const isAuthenticated = () => {
  return getUser() !== null;
}; 