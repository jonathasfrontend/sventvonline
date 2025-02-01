import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Guia from "./pages/Guia";
import Favorite from "./pages/Favorite"
import Playlist from "./pages/Playlist";
import Me from './pages/Me'
import Channel from './pages/Channel'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<Channel />} />
          <Route path="/programacao" element={<Guia />} />
          <Route path="/favoritos" element={<Favorite />} />
          <Route path="/playlists" element={<Playlist />} />
          <Route path="/me/:tag" element={<Me />} />
        </Routes>
      </AuthProvider>
    </Router>

  )
}

export default App
