import { createContext, useState, ReactNode } from "react";
import { setCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs-react";

type User = {
    username: string;
    email: string;
    tag: string;
    cargo: string;
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

type AddChannelData = {
    name: string;
    categoria: string;
    image: string;
};
type DeleteChannelData = {
    id: string;
};

type DeleteAllChannelData = {
    id: string;
    password: string;
};

type UpdateChannelData = {
    id: string;
    name: string;
    categoria: string;
    image: string;
};

type RemoveUserData = {
    id: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (data: SignInData) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    addChannel: (data: AddChannelData) => Promise<void>;
    deleteChannel: (data: DeleteChannelData) => Promise<void>;
    deleteAllChannels: (data: DeleteAllChannelData) => Promise<void>;
    updateChannel: (data: UpdateChannelData) => Promise<void>;
    removeUser: (data: RemoveUserData) => Promise<void>;
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
            const { token, username, tag, cargo, id, avatar } = response.data;

            // Configuração inicial
            setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 });
            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            // Requisições paralelas
            const [playlists, favorites, likedby] = await Promise.all([
                api.get(`/playlists/listplaylist/${id}`),
                api.get(`/favorite/favorites/${id}`),
                api.get(`/liked/liked/${id}`),
            ]);

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

            localStorage.setItem(
                "likedby",
                JSON.stringify(
                    likedby.data.map(({ tv_channels: { id, url, description, name, image, created_at } }: any) => ({
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
            setUser({ username, tag, cargo, email, id, avatar });
            localStorage.setItem("username", username);
            localStorage.setItem("id_username", id);
            localStorage.setItem("avatar", avatar);
            localStorage.setItem("tag", tag);
            localStorage.setItem("flag", bcrypt.hashSync(cargo, 10));

            navigate("/");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao autenticar");
        }
    }

    async function signUp({ username, email, avatar, password }: SignUpData) {
        try {
            await api.post("/users/signup", { username, email, cargo: "membro", avatar, password });
            await signIn({ email, password }); // Autenticar automaticamente após cadastro
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao cadastrar");
        }
    }

    async function addChannel({ name, categoria, image }: AddChannelData) {
        try {
            await api.post("/channels", { name, categoria, image });
            toast.success("Canal adicionado com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao cadastrar");
        }
    }

    async function deleteChannel({ id }: DeleteChannelData) {
        try {
            await api.delete(`/channels/${id}`);
            toast.success("Canal deletado com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao deletar");
        }
    }

    async function deleteAllChannels({ password, id }: DeleteAllChannelData) {
        try {
            await api.delete(`/channels/deleteAll/${id}`, { data: { password } });
            toast.success("Todos os canais foram deletados com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao deletar");
        }
    }

    async function updateChannel({ id, name, categoria, image }: UpdateChannelData) {
        try {
            await api.put(`/channels/${id}`, { name, categoria, image });
            toast.success("Canal atualizado com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao atualizar");
        }
    }

    async function removeUser({ id }: DeleteChannelData) {
        try {
            await api.delete(`/users/${id}`);
            toast.success("Usuario deletado com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao deletar");
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, setUser, signUp, addChannel, deleteChannel, deleteAllChannels, updateChannel, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
}
