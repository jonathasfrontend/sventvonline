import { createContext, useState, ReactNode } from "react";
import { setCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";

type User = {
  username: string;
  email: string;
  id: string;
  avatar: string;
};

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  username: string;
  email: string;
  avatar: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  googleSignUp: (data: SignUpData) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps ) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  async function signIn({ email, password }: SignInData) {
    try {
      const response = await api.post("/auth/login", { email, password });

      const idPlaylistResponse = await api.get(`/playlists/listplaylist/${response.data.id}`);
      const playlistIds = idPlaylistResponse.data.map((playlist: any) => playlist.id);
      localStorage.setItem("id_playlists", JSON.stringify(playlistIds));

      const { token, username, id, avatar } = response.data;

      setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
      localStorage.setItem("username", username);
      localStorage.setItem("id_username", id);
      localStorage.setItem("avatar", avatar);

      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser({ username, email, id, avatar });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  }

  async function signUp({ username, email, avatar, password }: SignUpData) {
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        avatar,
        password,
      });

      const { token, id } = response.data;

      setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
      localStorage.setItem("username", username);
      localStorage.setItem("id_username", id);
      localStorage.setItem("avatar", avatar);

      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser({ username, email, id, avatar });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  }

  async function googleSignUp({ username, email, avatar, password }: SignUpData) {
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        avatar,
        password,  // A senha pode ser gerada ou um valor default
      });
  
      const { token, id } = response.data;
  
      setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
      localStorage.setItem("username", username);
      localStorage.setItem("id_username", id);
      localStorage.setItem("avatar", avatar);
  
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser({ username, email, id, avatar });
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  }  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, setUser, signUp, googleSignUp }}>
      {children}
    </AuthContext.Provider>
  );
}
