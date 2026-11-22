const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function api(endpoint, options = {}) {
  const url = `${BASE_URL}/api${endpoint}`;

  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Auth
export const loginUser = (credentials) =>
  api('/auth/login', { method: 'POST', body: credentials });

export const registerUser = (userData) =>
  api('/auth/register', { method: 'POST', body: userData });

export const logoutUser = () =>
  api('/auth/logout', { method: 'POST' });

export const getCurrentUser = () =>
  api('/auth/me');

export const adminSetup = (data) =>
  api('/auth/admin-setup', { method: 'POST', body: data });

// Posts
export const getPosts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.tag) query.set('tag', params.tag);
  if (params.author) query.set('author', params.author);
  const qs = query.toString();
  return api(`/posts${qs ? `?${qs}` : ''}`);
};

export const getMyPosts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const qs = query.toString();
  return api(`/posts/my/posts${qs ? `?${qs}` : ''}`);
};

export const getPostBySlug = (slug) =>
  api(`/posts/${slug}`);

export const createPost = (postData) =>
  api('/posts', { method: 'POST', body: postData });

export const updatePost = (id, postData) =>
  api(`/posts/${id}`, { method: 'PUT', body: postData });

export const deletePost = (id) =>
  api(`/posts/${id}`, { method: 'DELETE' });

export const togglePublish = (id) =>
  api(`/posts/${id}/toggle-publish`, { method: 'PATCH' });

// Comments
export const getComments = (postId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const qs = query.toString();
  return api(`/comments/post/${postId}${qs ? `?${qs}` : ''}`);
};

export const createComment = (commentData) =>
  api('/comments', { method: 'POST', body: commentData });

export const updateComment = (id, commentData) =>
  api(`/comments/${id}`, { method: 'PUT', body: commentData });

export const deleteComment = (id) =>
  api(`/comments/${id}`, { method: 'DELETE' });

// Categories
export const getCategories = () =>
  api('/categories');

// Tags
export const getTags = () =>
  api('/tags');

// Users
export const getUserProfile = (id) =>
  api(`/users/${id}`);

export const updateProfile = (data) =>
  api('/users/me', { method: 'PATCH', body: data });

// Dashboard
export const getDashboardStats = () =>
  api('/dashboard/stats');

// Admin
export const getAdminStats = () =>
  api('/admin/stats');

export const getAdminPosts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const qs = query.toString();
  return api(`/admin/posts${qs ? `?${qs}` : ''}`);
};

export const getAdminComments = (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  const qs = query.toString();
  return api(`/admin/comments${qs ? `?${qs}` : ''}`);
};

export const deleteAdminComment = (id) =>
  api(`/admin/comments/${id}`, { method: 'DELETE' });
