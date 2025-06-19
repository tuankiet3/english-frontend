// src/components/TopicSelector.js
import React, { useState, useEffect } from "react";
import { fetchTopics } from "../api";

const TopicSelector = ({ onTopicSelect, selectedTopic }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetchTopics();
        setTopics(response.data);
      } catch (err) {
        setError("Không thể tải danh sách chủ đề. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getTopics();
  }, []);

  if (loading) return <p>Đang tải chủ đề...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="form-group">
      <label htmlFor="topic-select">Chọn chủ đề</label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => onTopicSelect(e.target.value)}
      >
        <option value="">-- Vui lòng chọn một chủ đề --</option>
        {topics.map((topic) => (
          <option key={topic._id} value={topic._id}>
            {topic.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopicSelector;
