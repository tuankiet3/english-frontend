// src/pages/FillInBlank.js

import React, { useState, useEffect, useMemo } from "react";
import { fetchVocabularyByTopic } from "../api";
import TopicSelector from "../components/TopicSelector";

// Hàm helper để tạo ra từ bị che
const createMaskedWord = (word) => {
  // Không che những từ quá ngắn
  if (!word || word.length < 4) {
    return word.split("").join(" ");
  }

  const wordArr = word.split("");
  let maskedWordArr = [...wordArr];

  // Số lượng ký tự cần che, khoảng 1/3 độ dài của từ, tối thiểu là 1
  const lettersToHideCount = Math.max(1, Math.floor(word.length / 3));

  // Lấy danh sách các vị trí có thể che (không phải ký tự đầu và cuối)
  const possibleIndices = [];
  for (let i = 1; i < word.length - 1; i++) {
    // Chỉ che các chữ cái, không che khoảng trắng hay ký tự đặc biệt
    if (wordArr[i].match(/[a-zA-Z]/)) {
      possibleIndices.push(i);
    }
  }

  // Xáo trộn danh sách vị trí và lấy ra số lượng cần che
  possibleIndices.sort(() => 0.5 - Math.random());

  for (let i = 0; i < lettersToHideCount && i < possibleIndices.length; i++) {
    maskedWordArr[possibleIndices[i]] = "_";
  }

  // Nối các ký tự lại và thêm khoảng trắng để dễ nhìn
  return maskedWordArr.join(" ");
};

const FillInBlank = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Sử dụng useMemo để tính toán từ hiện tại và từ bị che một cách hiệu quả
  const currentWord = useMemo(
    () => vocabulary[currentIndex],
    [vocabulary, currentIndex]
  );

  const maskedWord = useMemo(() => {
    if (currentWord) {
      return createMaskedWord(currentWord.englishWord);
    }
    return "";
  }, [currentWord]);

  // Lấy dữ liệu từ vựng khi người dùng chọn chủ đề
  useEffect(() => {
    if (selectedTopic) {
      const getVocab = async () => {
        setLoading(true);
        try {
          const response = await fetchVocabularyByTopic(selectedTopic);
          const shuffled = response.data.sort(() => 0.5 - Math.random());
          setVocabulary(shuffled);
          setCurrentIndex(0);
          setFeedback({ type: "", message: "" });
          setUserAnswer("");
        } catch (error) {
          console.error("Lỗi khi tải từ vựng:", error);
          setVocabulary([]);
        } finally {
          setLoading(false);
        }
      };
      getVocab();
    } else {
      setVocabulary([]);
    }
  }, [selectedTopic]);

  // Xử lý khi người dùng kiểm tra đáp án
  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!currentWord) return;

    if (
      userAnswer.trim().toLowerCase() === currentWord.englishWord.toLowerCase()
    ) {
      setFeedback({ type: "correct", message: "Chính xác!" });
      setTimeout(() => {
        goToNextWord();
      }, 1200);
    } else {
      setFeedback({
        type: "incorrect",
        message: `Sai rồi! Đáp án đúng là: ${currentWord.englishWord}`,
      });
    }
  };

  // Chuyển sang từ tiếp theo
  const goToNextWord = () => {
    setFeedback({ type: "", message: "" });
    setUserAnswer("");
    if (vocabulary.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
    }
  };

  return (
    <div>
      <h2>Điền từ còn thiếu</h2>
      <p>Hoàn thành từ sau bằng cách điền **đầy đủ từ đúng** vào ô trống.</p>
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
          <p
            className="quiz-question"
            style={{ letterSpacing: "0.2em", fontSize: "2rem" }}
          >
            {maskedWord}
          </p>
          <p>
            Gợi ý (Nghĩa tiếng Việt):{" "}
            <strong>{currentWord.vietnameseMeaning}</strong>
          </p>

          <form onSubmit={handleCheckAnswer} style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập đầy đủ từ đúng"
                autoComplete="off"
                autoFocus
                disabled={feedback.type === "correct"}
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
              <button type="submit" disabled={feedback.type === "correct"}>
                Kiểm tra
              </button>
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

export default FillInBlank;
