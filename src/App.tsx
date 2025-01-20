import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Guia from "./pages/Guia";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GoogleOAuthProvider clientId="640907278227-t8d6j6v63l4v60hosjim6s7o33aserg4.apps.googleusercontent.com">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/programacao" element={<Guia />} />
          </Routes>
        </GoogleOAuthProvider>
      </AuthProvider>
    </Router>

  )
}

export default App
