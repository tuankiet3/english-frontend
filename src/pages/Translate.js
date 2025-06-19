// src/pages/Translate.js
import React, { useState, useEffect } from "react";
import { fetchVocabularyByTopic } from "../api";
import TopicSelector from "../components/TopicSelector";

const Translate = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTopic) {
      const getVocab = async () => {
        setLoading(true);
        const response = await fetchVocabularyByTopic(selectedTopic);
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setVocabulary(shuffled);
        setCurrentIndex(0);
        setLoading(false);
      };
      getVocab();
    } else {
      setVocabulary([]);
    }
  }, [selectedTopic]);

  const currentWord = vocabulary[currentIndex];

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (
      userAnswer.trim().toLowerCase() === currentWord.englishWord.toLowerCase()
    ) {
      setFeedback({ type: "correct", message: "Chính xác!" });
      setTimeout(() => {
        goToNextWord();
      }, 1000);
    } else {
      setFeedback({
        type: "incorrect",
        message: `Sai rồi! Đáp án đúng là: ${currentWord.englishWord}`,
      });
    }
  };

  const goToNextWord = () => {
    setFeedback({ type: "", message: "" });
    setUserAnswer("");
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
  };

  return (
    <div>
      <h2>Dịch từ (Việt - Anh)</h2>
      <TopicSelector
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
      />

      {loading && <p>Đang tải...</p>}
      {selectedTopic && !loading && vocabulary.length === 0 && (
        <p>Chủ đề này chưa có từ vựng.</p>
      )}

      {currentWord && (
        <div className="quiz-container">
          <p className="quiz-question">{currentWord.vietnameseMeaning}</p>
          <form onSubmit={handleCheckAnswer}>
            <div className="form-group">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập từ Tiếng Anh tương ứng"
                autoFocus
              />
            </div>
            {feedback.message && (
              <div
                className={`quiz-feedback ${
                  feedback.type === "correct"
                    ? "feedback-correct"
                    : "feedback-incorrect"
                }`}
              >
                {feedback.message}
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="submit">Kiểm tra</button>
              <button type="button" onClick={goToNextWord}>
                Bỏ qua
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Translate;
