// src/pages/UpdateVocabulary.js
import React, { useState, useEffect } from "react";
import { fetchTopics, fetchVocabularyByTopic, updateVocabulary } from "../api";

const UpdateVocabulary = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [vocabularies, setVocabularies] = useState([]);
  const [selectedVocab, setSelectedVocab] = useState(null);
  const [formData, setFormData] = useState({
    englishWord: "",
    vietnameseMeaning: "",
    exampleSentence: "",
  });
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
    setSelectedVocab(null);
    setFormData({
      englishWord: "",
      vietnameseMeaning: "",
      exampleSentence: "",
    });
    if (topicId) {
      loadVocabularies(topicId);
    } else {
      setVocabularies([]);
    }
  };

  const handleVocabSelect = (vocab) => {
    setSelectedVocab(vocab);
    setFormData({
      englishWord: vocab.englishWord,
      vietnameseMeaning: vocab.vietnameseMeaning,
      exampleSentence: vocab.exampleSentence || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVocab) {
      setMessage("Vui lòng chọn từ vựng để cập nhật");
      return;
    }

    if (!formData.englishWord.trim() || !formData.vietnameseMeaning.trim()) {
      setMessage("Vui lòng điền đầy đủ từ tiếng Anh và nghĩa tiếng Việt");
      return;
    }

    try {
      await updateVocabulary(selectedVocab._id, formData);
      setMessage("Cập nhật từ vựng thành công");
      loadVocabularies(selectedTopic); // Reload vocabularies
      setSelectedVocab(null);
      setFormData({
        englishWord: "",
        vietnameseMeaning: "",
        exampleSentence: "",
      });
    } catch (error) {
      setMessage("Lỗi khi cập nhật từ vựng");
    }
  };

  return (
    <div className="update-vocabulary-container">
      <h1>Cập nhật từ vựng</h1>

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
        <div className="vocabulary-selection">
          <h2>Chọn từ vựng để cập nhật</h2>
          <div className="vocabulary-list">
            {vocabularies.map((vocab) => (
              <div
                key={vocab._id}
                className={`vocabulary-item ${
                  selectedVocab?._id === vocab._id ? "selected" : ""
                }`}
                onClick={() => handleVocabSelect(vocab)}
              >
                <h3>{vocab.englishWord}</h3>
                <p>{vocab.vietnameseMeaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVocab && (
        <div className="update-form">
          <h2>Cập nhật thông tin từ vựng</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="englishWord">Từ tiếng Anh:</label>
              <input
                type="text"
                id="englishWord"
                name="englishWord"
                value={formData.englishWord}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vietnameseMeaning">Nghĩa tiếng Việt:</label>
              <input
                type="text"
                id="vietnameseMeaning"
                name="vietnameseMeaning"
                value={formData.vietnameseMeaning}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleSentence">Câu ví dụ (tùy chọn):</label>
              <textarea
                id="exampleSentence"
                name="exampleSentence"
                value={formData.exampleSentence}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <button type="submit" className="update-button">
              Cập nhật từ vựng
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateVocabulary;
