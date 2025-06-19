// src/pages/AddNewWord.js
import React, { useState } from "react";
import { createVocabulary } from "../api";
import TopicSelector from "../components/TopicSelector";

const AddNewWord = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [vietnameseMeaning, setVietnameseMeaning] = useState("");
  const [exampleSentence, setExampleSentence] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopic || !englishWord || !vietnameseMeaning) {
      setError("Vui lòng chọn chủ đề và điền đầy đủ từ và nghĩa.");
      return;
    }

    try {
      setError("");
      setMessage("");
      const vocabData = { englishWord, vietnameseMeaning, exampleSentence };
      await createVocabulary(selectedTopic, vocabData);
      setMessage(`Đã thêm từ "${englishWord}" thành công!`);
      // Reset form
      setEnglishWord("");
      setVietnameseMeaning("");
      setExampleSentence("");
    } catch (err) {
      setError("Lỗi khi thêm từ mới. Vui lòng thử lại.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Thêm từ mới theo chủ đề</h2>
      <form onSubmit={handleSubmit}>
        <TopicSelector
          selectedTopic={selectedTopic}
          onTopicSelect={setSelectedTopic}
        />

        <div className="form-group">
          <label htmlFor="english-word">Từ Tiếng Anh</label>
          <input
            id="english-word"
            type="text"
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="vietnamese-meaning">Nghĩa Tiếng Việt</label>
          <input
            id="vietnamese-meaning"
            type="text"
            value={vietnameseMeaning}
            onChange={(e) => setVietnameseMeaning(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="example-sentence">Câu ví dụ (tùy chọn)</label>
          <input
            id="example-sentence"
            type="text"
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit" disabled={!selectedTopic}>
          Thêm từ
        </button>
      </form>
    </div>
  );
};

export default AddNewWord;
