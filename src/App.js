// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ManageTopics from "./pages/ManageTopics";
import AddNewWord from "./pages/AddNewWord";
import Flashcard from "./pages/Flashcard";
import FillInBlank from "./pages/FillInBlank";
import Translate from "./pages/Translate";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage-topics" element={<ManageTopics />} />
          <Route path="/add-word" element={<AddNewWord />} />
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/fill-in-blank" element={<FillInBlank />} />
          <Route path="/translate" element={<Translate />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
