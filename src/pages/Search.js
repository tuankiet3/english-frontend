// src/pages/Search.js
import React, { useState } from "react";
import { searchVocabularyByMeaning } from "../api";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vocabulary, setVocabulary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Vui lòng nhập nghĩa tiếng Việt để tìm kiếm");
      return;
    }

    setLoading(true);
    setError("");
    setVocabulary(null);

    try {
      const response = await searchVocabularyByMeaning(searchTerm);
      setVocabulary(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Không tìm thấy từ vựng với nghĩa này");
      } else {
        setError("Có lỗi xảy ra khi tìm kiếm");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setVocabulary(null);
    setError("");
  };

  return (
    <div className="search-container">
      <h1>Tìm kiếm từ vựng</h1>
      <p>Nhập nghĩa tiếng Việt để tìm từ tiếng Anh tương ứng</p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập nghĩa tiếng Việt..."
            className="search-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
          <button type="button" onClick={handleClear} className="clear-button">
            Xóa
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {vocabulary && (
        <div className="search-result">
          <h2>Kết quả tìm kiếm:</h2>
          <div className="vocabulary-card">
            <div className="vocabulary-info">
              <h3 className="english-word">{vocabulary.englishWord}</h3>
              <p className="vietnamese-meaning">
                <strong>Nghĩa:</strong> {vocabulary.vietnameseMeaning}
              </p>
              {vocabulary.exampleSentence && (
                <p className="example-sentence">
                  <strong>Ví dụ:</strong> {vocabulary.exampleSentence}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!vocabulary && !error && !loading && (
        <div className="search-placeholder">
          <p>Nhập nghĩa tiếng Việt vào ô tìm kiếm để bắt đầu</p>
        </div>
      )}
    </div>
  );
};

export default Search;
