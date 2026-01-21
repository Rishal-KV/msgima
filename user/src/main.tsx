import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import UserPage from './pages/users/UserPage.tsx';
import HomePage from './pages/home/HomePage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/users" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
