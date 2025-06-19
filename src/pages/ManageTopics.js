// src/pages/ManageTopics.js
import React, { useState, useEffect } from "react";
import { fetchTopics, createTopic } from "../api";

const ManageTopics = () => {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTopics = async () => {
    try {
      setLoading(true);
      const response = await fetchTopics();
      setTopics(response.data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách chủ đề.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      setError("Tên chủ đề không được để trống.");
      return;
    }
    try {
      await createTopic(newTopicName);
      setNewTopicName("");
      setError("");
      loadTopics(); // Tải lại danh sách sau khi thêm
    } catch (err) {
      setError("Lỗi khi tạo chủ đề. Có thể chủ đề đã tồn tại.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Quản lý Chủ đề</h2>

      <h3>Thêm chủ đề mới</h3>
      <form onSubmit={handleAddTopic}>
        <div className="form-group">
          <label htmlFor="topic-name">Tên chủ đề</label>
          <input
            type="text"
            id="topic-name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Ví dụ: Động vật"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Thêm Chủ đề</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Danh sách chủ đề</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <ul className="topic-list">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <li key={topic._id} className="topic-item">
                <span>{topic.name}</span>
                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
              </li>
            ))
          ) : (
            <p>Chưa có chủ đề nào.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ManageTopics;
