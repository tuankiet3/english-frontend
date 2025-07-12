// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Bảng điều khiển</h1>
      <div className="function-grid">
        <Link to="/manage-topics" className="function-card">
          <h3>Quản lý Chủ đề</h3>
          <p>Thêm, xem các chủ đề từ vựng.</p>
        </Link>
        <Link to="/add-word" className="function-card">
          <h3>Thêm từ mới</h3>
          <p>Thêm từ vựng mới vào một chủ đề đã có.</p>
        </Link>
        <Link to="/flashcard" className="function-card">
          <h3>Học với Flashcard</h3>
          <p>Lật thẻ để học từ và nghĩa.</p>
        </Link>
        <Link to="/translate" className="function-card">
          <h3>Dịch từ</h3>
          <p>Điền từ tiếng Anh dựa trên nghĩa tiếng Việt.</p>
        </Link>
        <Link to="/fill-in-blank" className="function-card">
          <h3>Điền vào chỗ trống</h3>
          <p>Hoàn thành câu với từ đúng.</p>
        </Link>
        <Link to="/search" className="function-card">
          <h3>Tìm kiếm từ vựng</h3>
          <p>Tìm kiếm từ vựng theo từ khóa.</p>
        </Link>
        <Link to="delete-vocabulary" className="function-card">
          <h3>Xóa từ vựng</h3>
          <p>Xóa từ vựng khỏi chủ đề.</p>
        </Link>
        <Link to="/update-vocabulary" className="function-card">
          <h3>Cập nhật từ vựng</h3>
          <p>Cập nhật thông tin từ vựng.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
