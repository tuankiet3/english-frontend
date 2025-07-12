// src/api/index.js
import axios from "axios";

// URL này sẽ là URL trên Vercel khi chạy production, hoặc localhost khi chạy ở máy
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_URL}/api`, // Thêm /api vì trong backend bạn đã cấu hình app.use('/api', ...)
});

// Topic API
export const fetchTopics = () => API.get("/topics");
export const createTopic = (name) => API.post("/topics", { name });

// Vocabulary API
export const fetchVocabularyByTopic = (topicId) =>
  API.get(`/topics/${topicId}/vocabulary`);
export const createVocabulary = (topicId, vocabData) =>
  API.post(`/topics/${topicId}/vocabulary`, vocabData);
export const deleteVocabulary = (vocabularyId) =>
  API.delete(`/vocabulary/${vocabularyId}`);
export const updateVocabulary = (vocabularyId, vocabData) =>
  API.put(`/vocabulary/${vocabularyId}`, vocabData);
export const searchVocabularyByMeaning = (vietnameseMeaning) =>
  API.get(`/vocabulary/search`, { params: { meaning: vietnameseMeaning } });
