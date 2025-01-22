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
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!user;
    const navigate = useNavigate();

    async function signIn({ email, password }: SignInData) {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, username, id, avatar } = response.data;

            // Configuração inicial
            setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            // Requisições paralelas
            const [playlists, favorites] = await Promise.all([
                api.get(`/playlists/listplaylist/${id}`),
                api.get(`/favorite/favorites/${id}`),
            ]);

            // Processamento de playlists e favoritos
            localStorage.setItem(
                "playlists",
                JSON.stringify(playlists.data.map(({ id, user_id, name, created_at }: any) => ({ id, user_id, name, created_at })))
            );

            localStorage.setItem(
                "favorites",
                JSON.stringify(
                    favorites.data.map(({ tv_channels: { id, url, description, name, image, created_at } }: any) => ({
                        id,
                        url,
                        description,
                        name,
                        image,
                        created_at,
                    }))
                )
            );

            // Atualizar estado
            setUser({ username, email, id, avatar });
            localStorage.setItem("username", username);
            localStorage.setItem("id_username", id);
            localStorage.setItem("avatar", avatar);

            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao autenticar");
        }
    }

    async function signUp({ username, email, avatar, password }: SignUpData) {
        try {
            await api.post("/auth/signup", { username, email, avatar, password });
            await signIn({ email, password }); // Autenticar automaticamente após cadastro
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao cadastrar");
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, setUser, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
