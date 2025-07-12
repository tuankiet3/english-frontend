// src/pages/DeleteVocabulary.js
import React, { useState, useEffect } from "react";
import { fetchTopics, fetchVocabularyByTopic, deleteVocabulary } from "../api";

const DeleteVocabulary = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const response = await fetchTopics();
      setTopics(response.data);
    } catch (error) {
      setMessage("Lỗi khi tải danh sách chủ đề");
    }
  };

  const loadVocabularies = async (topicId) => {
    setLoading(true);
    try {
      const response = await fetchVocabularyByTopic(topicId);
      setVocabularies(response.data);
    } catch (error) {
      setMessage("Lỗi khi tải từ vựng");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    if (topicId) {
      loadVocabularies(topicId);
    } else {
      setVocabularies([]);
    }
  };

  const handleDelete = async (vocabularyId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) {
      try {
        await deleteVocabulary(vocabularyId);
        setMessage("Xóa từ vựng thành công");
        loadVocabularies(selectedTopic); // Reload vocabularies
      } catch (error) {
        setMessage("Lỗi khi xóa từ vựng");
      }
    }
  };

  return (
    <div className="delete-vocabulary-container">
      <h1>Xóa từ vựng</h1>

      <div className="topic-selector">
        <label htmlFor="topic-select">Chọn chủ đề:</label>
        <select
          id="topic-select"
          value={selectedTopic}
          onChange={handleTopicChange}
        >
          <option value="">-- Chọn chủ đề --</option>
          {topics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("thành công") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {loading && <p>Đang tải từ vựng...</p>}

      {vocabularies.length > 0 && (
        <div className="vocabulary-list">
          <h2>Danh sách từ vựng</h2>
          {vocabularies.map((vocab) => (
            <div key={vocab._id} className="vocabulary-item">
              <div className="vocabulary-info">
                <h3>{vocab.englishWord}</h3>
                <p>
                  <strong>Nghĩa:</strong> {vocab.vietnameseMeaning}
                </p>
                {vocab.exampleSentence && (
                  <p>
                    <strong>Ví dụ:</strong> {vocab.exampleSentence}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(vocab._id)}
                className="delete-button"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteVocabulary;
