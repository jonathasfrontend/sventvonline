import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Guia from "./pages/Guia";
import Favorite from "./pages/Favorite"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programacao" element={<Guia />} />
          <Route path="/favoritos" element={<Favorite />} />
        </Routes>
      </AuthProvider>
    </Router>

  )
}

export default App
