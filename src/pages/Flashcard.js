// src/pages/Flashcard.js
import React, { useState, useEffect } from "react";
import { fetchVocabularyByTopic } from "../api";
import TopicSelector from "../components/TopicSelector";

const Flashcard = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getVocab = async () => {
      if (!selectedTopic) {
        setVocabulary([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetchVocabularyByTopic(selectedTopic);
        // Xáo trộn mảng từ vựng
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setVocabulary(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
      } catch (error) {
        console.error("Error fetching vocabulary", error);
        setVocabulary([]);
      } finally {
        setLoading(false);
      }
    };
    getVocab();
  }, [selectedTopic]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % vocabulary.length);
    }, 200); // Đợi 1 chút để card lật lại
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + vocabulary.length) % vocabulary.length
      );
    }, 200);
  };

  const currentWord = vocabulary[currentIndex];

  return (
    <div>
      <h2>Flashcard</h2>
      <TopicSelector
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
      />

      {loading && <p>Đang tải từ vựng...</p>}

      {!loading && !selectedTopic && (
        <p>Vui lòng chọn một chủ đề để bắt đầu.</p>
      )}

      {!loading && selectedTopic && vocabulary.length === 0 && (
        <p>Chủ đề này chưa có từ vựng. Hãy thêm từ mới!</p>
      )}

      {currentWord && (
        <div className="flashcard-container">
          <div
            className={`flashcard ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">{currentWord.englishWord}</div>
              <div className="flashcard-back">
                {currentWord.vietnameseMeaning}
              </div>
            </div>
          </div>
          <p>
            {currentIndex + 1} / {vocabulary.length}
          </p>
          <div className="flashcard-nav">
            <button onClick={handlePrev}>Từ trước</button>
            <button onClick={handleNext}>Từ tiếp theo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
