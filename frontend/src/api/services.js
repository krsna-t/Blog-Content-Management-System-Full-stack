import API from "./axios";

export const registerUser = (data) => API.post("/auth/register/", data);
export const loginUser = (data) => API.post("/auth/login/", data);
export const refreshToken = (refresh) => API.post("/auth/token/refresh/", { refresh });

export const getPosts = (params) => API.get("/posts/", { params });
export const getPost = (id) => API.get(`/posts/${id}/`);
export const createPost = (data) => API.post("/posts/", data);
export const updatePost = (id, data) => API.patch(`/posts/${id}/`, data);
export const deletePost = (id) => API.delete(`/posts/${id}/`);

export const getCategories = () => API.get("/categories/");
export const createCategory = (data) => API.post("/categories/", data);

export const getComments = (postId) => API.get("/comments/", { params: { post: postId } });
export const addComment = (data) => API.post("/comments/", data);
export const deleteComment = (id) => API.delete(`/comments/${id}/`);
