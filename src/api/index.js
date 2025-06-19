// src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Đảm bảo cổng này khớp với backend của bạn
});

// Topic API
export const fetchTopics = () => API.get("/topics");
export const createTopic = (name) => API.post("/topics", { name });

// Vocabulary API
export const fetchVocabularyByTopic = (topicId) =>
  API.get(`/topics/${topicId}/vocabulary`);
export const createVocabulary = (topicId, vocabData) =>
  API.post(`/topics/${topicId}/vocabulary`, vocabData);
