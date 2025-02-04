import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from "../services/api";
import { Header } from '@/components/Header';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { CaretRight } from '@phosphor-icons/react';
import Slider from 'react-slick';
import { Separator } from '@/components/ui/separator';
import * as Avatar from "@radix-ui/react-avatar";

interface User {
    username: string;
    email: string;
    nametag: string;
    id: string;
    avatar: string;
    createdAt: string;
};

interface FavoriteData {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    created_at: string;
}
interface LikedData {
    id: string;
    url: string;
    name: string;
    image: string;
    categoria: string;
    created_at: string;
    description: string;
}

interface PlaylistData {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export default function Me() {
    const { tag } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [newName, setNewName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [favorite, setFavorite] = useState<FavoriteData[]>([]);
    const [playlist, setPlaylist] = useState<PlaylistData[]>([]);
    const [likedby, setLikedby] = useState<LikedData[]>([]);

    useEffect(() => {
        if (favorite.length > 0) return;
        const cachedPlaylists = localStorage.getItem("favorites");
        if (cachedPlaylists) setFavorite(JSON.parse(cachedPlaylists));
    }, []);


    // Carregar favoritos do localStorage
    useEffect(() => {
        if (playlist.length > 0) return;
        const cachedPlaylists = localStorage.getItem("playlists");
        if (cachedPlaylists) setPlaylist(JSON.parse(cachedPlaylists));
    }, []);

    useEffect(() => {
        if (likedby.length > 0) return;
        const cachedLiked = localStorage.getItem("likedby");
        if (cachedLiked) setLikedby(JSON.parse(cachedLiked));
    }, []);


    useEffect(() => {
        api.get(`/users/${tag}`)
            .then(response => {
                setUser(response.data);
            })
    }, [tag]);

    const handleChangeName = async () => {
        if (!newName.trim()) return;
        try {
            const updateName = await api.put(`/update-userdata/${user?.id}`, { username: newName });
            toast.success(updateName.data.message);
            setNewName("");

            // Atualiza o nome do usuário fazzendo uma nova requisição na rota /users/${tag} e atualizando o estado do usuário e o localStorage
            const response = await api.get(`/users/${tag}`);
            setUser(response.data);
            localStorage.setItem("username", response.data.username);

        } catch (error) {
            console.log(error);
            toast.error("Erro ao alterar o nome!");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem!");
            return;
        }
        try {
            await api.put(`/users/${user?.id}`, {
                oldPassword,
                newPassword
            });
            toast.success("Senha alterada com sucesso!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Erro ao alterar a senha!");
        }
    };

    const carouselSettingsChannel = {
        dots: false,
        // className: "",
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        // adaptiveWidth: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    function formatData(data: string) {
        const date = new Date(data);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="w-full h-full px-16 bg-[#121214] flex flex-col items-center">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Header />
            {user && (
                <div className="w-full mt-20 flex gap-5">
                    <div className='bg-[#1c1c1c] sticky w-[25%] h-[300px] rounded-lg shadow-lg flex flex-col justify-center items-center border'>
                        <Avatar.Root className="w-32 h-32 items-center justify-center overflow-hidden rounded-2xl sticky top-20 ">
                            <Avatar.Image
                                className="w-32 h-32 rounded-lg object-cover border-2 border-[#3fa5ff]"
                                src={user.avatar}
                                alt={user.username}
                            />
                            <Avatar.Fallback
                                className="leading-1 flex w-32 h-32 items-center justify-center bg-white text-[45px] font-medium text-[#121214]"
                                delayMs={600}
                            >
                                {user.username?.charAt(0).toUpperCase()}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
                        <h2 className="text-gray-400 text-sm">{user.email}</h2>
                        <h3 className="text-xs px-3 py-1 rounded-lg my-2">@{user.nametag}</h3>
                        <Separator orientation="horizontal"/>
                        <h3 className="text-xs text-gray-500 py-1 rounded-lg mt-2">
                            Desde: {formatData(user.createdAt)}
                        </h3>
                    </div>
                    <div className='w-[75%] flex pb-5 flex-col gap-3 h-[calc(100vh-80px)] overflow-y-auto'>
                        <div className='w-full rounded-lg shadow-lg py-3 px-5 bg-[#1c1c1c] border'>
                            <h1 className='text-lg font-medium mb-2'>Suas Playlists</h1>
                            <div className='flex items-center gap-2'>
                                {
                                    // Renderiza a lista de favoritos se houver algum item na lista de favoritos mostra a mensagem "Nenhum canal favorito"
                                    playlist.length > 0 ? (
                                        playlist.map((item) => (
                                            <Link to={`/playlist/${item.id}`} >
                                                <div key={item.id} className="w-full flex flex-col px-6 py-4 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                    <div className="w-full flex items-center justify-between">
                                                        <h3 className="text-white text-sm font-semibold">{item.name}</h3>
                                                        <CaretRight className='w-5 ml-5' />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="w-full flex items-center text-center">
                                            <h2 className="text-gray-500 font-medium text-base">Você não tem nenhuma playlist.</h2>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className='w-full rounded-lg shadow-lg py-3 px-5 bg-[#1c1c1c] border'>
                            <h1 className='text-lg font-medium mb-2'>Seus Favoritos</h1>
                            <div className=" gap-2 mt-2 px-5">
                                <Slider {...carouselSettingsChannel}>
                                    {
                                        favorite.length > 0 ? (
                                            favorite.map((item) => (
                                                <div className="w-[200px !important] flex flex-col py-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                    <Link to={`/dashboard/${item.id}`} className="flex items-center justify-center">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full" />
                                                    </Link>
                                                    <Separator orientation="vertical" className="w-px bg-[#313131a1] " />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full flex items-center text-center">
                                                <h2 className="text-gray-500 font-medium text-base">Você não tem nenhum canal favorito.</h2>
                                            </div>
                                        )
                                    }
                                </Slider>
                            </div>
                        </div>
                        <div className='w-full rounded-lg shadow-lg py-3 px-5 bg-[#1c1c1c] border'>
                            <h1 className='text-lg font-medium mb-2'>Canais Curtidos</h1>
                            <div className=" gap-2 mt-2 px-5">
                                <Slider {...carouselSettingsChannel}>
                                {likedby.length > 0 ? (
                                        likedby.map((item) => (
                                            <div key={item.id} className="w-[200px] flex flex-col py-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                <Link to={`/dashboard/${item.id}`} className="flex items-center justify-center">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full" />
                                                </Link>
                                                <Separator orientation="vertical" className="w-px bg-[#313131a1]" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full flex items-center text-center">
                                            <h2 className="text-gray-500 font-medium text-base">Você não curtiu nenhum canal.</h2>
                                        </div>
                                    )}
                                </Slider>
                            </div>
                        </div>

                        <div className='flex justify-between gap-3'>
                            <form className="w-full rounded-lg shadow-lg py-3 px-5 bg-[#1c1c1c] border">
                                <h2 className="text-lg font-semibold">Alterar Nome</h2>
                                <input
                                    type="text"
                                    placeholder="Novo nome"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2 mt-2 rounded-lg bg-[#2f2f2f] text-white outline-none"
                                />
                                <button
                                    onClick={handleChangeName}
                                    className="w-full outline-none placeholder:text-gray-400 bg-blue-500 hover:bg-blue-600 transition duration-300 py-2 mt-3 rounded-lg font-semibold"
                                >
                                    Atualizar Nome
                                </button>
                            </form>

                            <div className="w-full rounded-lg shadow-lg py-3 px-5 bg-[#1c1c1c] border">
                                <h2 className="text-lg font-semibold">Alterar Senha</h2>
                                <input
                                    type="password"
                                    placeholder="Senha antiga"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2 mt-2 rounded-lg bg-[#2f2f2f] placeholder:text-gray-400 text-white outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 mt-2 rounded-lg bg-[#2f2f2f] placeholder:text-gray-400 text-white outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 mt-2 rounded-lg bg-[#2f2f2f] placeholder:text-gray-400 text-white outline-none"
                                />
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full outline-none bg-green-500 hover:bg-green-600 transition duration-300 py-2 mt-3 rounded-lg font-semibold"
                                >
                                    Atualizar Senha
                                </button>
                            </div>
                        </div>

                    </div>


                </div>


            )}
        </div>
    );
}
