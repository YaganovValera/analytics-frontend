// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "../pages/LoginPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Добро пожаловать!</div>} />
      </Routes>
    </BrowserRouter>
  )
}
