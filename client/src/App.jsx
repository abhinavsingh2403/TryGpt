import React from "react";
import Sidebar from "./components/sidebar";
import { Routes, Route } from "react-router-dom";
import Chatbox from "./components/chatbox";
import Credits from "./pages/credits";
import Community from "./pages/community";
import Login from "./pages/login";
import { useAppContext } from "./context/Appcontext";

const App = () => {
  const { user, theme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0d12] text-white' : 'bg-white text-gray-900'}`}>
      {user ? (
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className={`flex-1 overflow-hidden ${isDark ? 'bg-[#111118]' : 'bg-gray-50/50'}`}>
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </div>
  );
};

export default App;