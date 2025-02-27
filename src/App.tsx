import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./contexts/Middleware";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Guia from "./pages/Guia";
import Favorite from "./pages/Favorite";
import Playlist from "./pages/Playlist";
import Me from "./pages/Me";
import Channel from "./pages/Channel";
import Painel from "./pages/Painel";
import Movies from "./pages/Movies";
import Infantil from "./pages/Infantil";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlaylsitContent from "./pages/PlaylistContent";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:id"
            element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programacao"
            element={
              <ProtectedRoute>
                <Guia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favoritos"
            element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <PlaylsitContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filmes"
            element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/infantil"
            element={
              <ProtectedRoute>
                <Infantil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/:tag"
            element={
              <ProtectedRoute>
                <Me />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painelcontrol"
            element={
              <AdminRoute>
                <Painel />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
