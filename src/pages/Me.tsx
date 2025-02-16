import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from "../services/api";
import { Header } from '@/components/Header';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Gear } from '@phosphor-icons/react';
import Slider from 'react-slick';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useForm } from "react-hook-form";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';
import { AvatarCompenent } from '@/components/Avatar';

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
interface PlaylistCreateData {
    userId: string;
    name: string;
    error: string;
}

export default function Me() {
    const { tag } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [favorite, setFavorite] = useState<FavoriteData[]>([]);
    const [playlist, setPlaylist] = useState<PlaylistData[]>([]);
    const [likedby, setLikedby] = useState<LikedData[]>([]);
    const { register: createPlaylist, handleSubmit: handleSubmitCreatePlaylist } = useForm<PlaylistCreateData>();

    useEffect(() => {
        if (favorite.length > 0) return;
        const cachedPlaylists = localStorage.getItem("favorites");
        if (cachedPlaylists) setFavorite(JSON.parse(cachedPlaylists));
    }, []);

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


    async function handleCreatePlaylist(data: PlaylistCreateData) {
        try {
            const response = await api.post('/playlists/createplaylist', data);
            setPlaylist([...playlist, response.data]);
            localStorage.setItem("playlists", JSON.stringify([...playlist, response.data]));
            toast.success("Playlist criada com sucesso!");
        } catch (error: any) {
            toast.error(error.response.data.error || 'Erro ao criar playlist');
        }
    }

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
        <div className="w-full h-full px-16 bg-background flex flex-col items-center">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
            <Header />
            {user && (
                <div className="w-full mt-20 flex gap-5">
                    <Card className='bg-card sticky w-[25%] h-[300px] rounded-lg shadow-lg flex flex-col gap-1 p-4 justify-center items-center border '>
                        <AvatarCompenent nameUsers={user.username || ''} avatarUser={user.avatar || ''} size={128} />
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        <h2 className="text-gray-400 text-sm">{user.email}</h2>
                        <h3 className="text-xs px-3 rounded-lg my-2">@{user.nametag}</h3>
                        <Separator orientation="horizontal" />
                        <span className="text-xs text-gray-500 rounded-lg pt-2">
                            Desde: {formatData(user.createdAt)}
                        </span>
                        <Sheet>
                            <SheetTrigger className='absolute top-0 right-0 p-2 outline-none transition-opacity'>
                                <Gear className='w-5 h-5 opacity-70 hover:opacity-100' />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle className='outline-none'>Configurações</SheetTitle>
                                    <SheetDescription className='outline-none'>
                                        <ScrollArea className="w-full flex flex-col gap-3 h-[calc(100vh-80px)]">
                                            <form className="w-full rounded-sm py-3 px-5 bg-card border mb-3">
                                                <h2 className="text-lg text-foreground font-semibold">Alterar Nome</h2>
                                                <div className='flex items-center mt-2'>
                                                    <input
                                                        type="text"
                                                        placeholder="Novo nome"
                                                        className="w-auto px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                                    />
                                                    <button
                                                        className="w-[100px] text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-tr-md rounded-br-md  font-semibold"
                                                    >
                                                        Atualizar
                                                    </button>
                                                </div>
                                            </form>

                                            <form className="w-full rounded-sm py-3 px-5 bg-card border mb-3">
                                                <h2 className="text-lg text-foreground font-semibold">Alterar Avatar</h2>
                                                <div className='flex items-center mt-2'>
                                                    <input
                                                        type="text"
                                                        placeholder="Url do avatar"
                                                        className="w-auto px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                                    />
                                                    <button
                                                        className="w-[100px] text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-tr-md rounded-br-md  font-semibold"
                                                    >
                                                        Atualizar
                                                    </button>
                                                </div>
                                            </form>

                                            <form className="w-full rounded-sm py-3 px-5 bg-card border mb-3">
                                                <h2 className="text-lg text-foreground font-semibold">Alterar E-mail</h2>
                                                <div className='flex items-center mt-2'>
                                                    <input
                                                        type="text"
                                                        placeholder="Novo e-mail"
                                                        className="w-auto px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                                    />
                                                    <button
                                                        className="w-[100px] text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-tr-md rounded-br-md  font-semibold"
                                                    >
                                                        Atualizar
                                                    </button>
                                                </div>
                                            </form>

                                            <form className="w-full rounded-sm py-3 px-5 bg-card border mb-3">
                                                <h2 className="text-lg text-foreground font-semibold">Alterar Senha</h2>
                                                <input
                                                    type="password"
                                                    placeholder="Senha antiga"

                                                    className="w-full px-4 py-2 mt-2 rounded-sm bg-input placeholder:text-gray-400 text-foreground outline-none"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Nova senha"
                                                    className="w-full px-4 py-2 mt-2 rounded-sm bg-input placeholder:text-gray-400 text-foreground outline-none"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirmar nova senha"
                                                    className="w-full px-4 py-2 mt-2 rounded-sm bg-input placeholder:text-gray-400 text-foreground outline-none"
                                                />
                                                <button
                                                    className="w-full mt-2 text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-md font-semibold"
                                                >
                                                    Atualizar Senha
                                                </button>
                                            </form>

                                            
                                        </ScrollArea>
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>

                    </Card>
                    <div className='w-[75%] flex pb-5 flex-col gap-3 h-[calc(100vh-80px)] overflow-y-auto'>
                        <Card className='w-full rounded-lg shadow-lg py-3 px-5 bg-card border'>
                            <h1 className='text-lg text-foreground font-medium mb-2'>Suas Playlists</h1>
                            <div className='w-full gap-2 mt-2 px-5'>
                                <Slider {...carouselSettingsChannel}>
                                    {
                                        playlist.length > 0 ? (
                                            playlist.map((item: PlaylistData) => (
                                                <Link to={`/playlist/${item.id}`} >
                                                    <div key={item.id} className="w-[200px] flex flex-col py-2 bg-popover border hover:brightness-125 transition rounded-md">
                                                        <div className="w-full flex items-center justify-between">
                                                            <h3 className="text-foreground px-5 text-sm font-semibold">{item.name}</h3>
                                                            <h3 className="text-gray-500 px-5 text-xs font-medium">{formatData(item.created_at)}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="w-full flex items-center text-center">
                                                <h2 className="text-gray-500 font-medium text-sm">Você não tem nenhuma playlist.</h2>
                                            </div>
                                        )
                                    }
                                </Slider>
                            </div>
                        </Card>

                        <Card className='w-full rounded-lg shadow-lg py-3 px-5 bg-card border'>
                            <h1 className='text-lg text-foreground font-medium mb-2'>Seus Favoritos</h1>
                            <div className="w-full gap-2 mt-2 px-5">
                                <Slider {...carouselSettingsChannel}>
                                    {
                                        favorite.length > 0 ? (
                                            favorite.map((item) => (
                                                <div className="w-[200px] flex flex-col py-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                    <Link to={`/dashboard/${item.id}`} className="flex items-center justify-center">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full" />
                                                    </Link>
                                                    <Separator orientation="vertical" className="w-px bg-[#313131a1] " />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full flex items-center text-center">
                                                <h2 className="text-gray-500 font-medium text-sm">Você não tem nenhum canal favorito.</h2>
                                            </div>
                                        )
                                    }
                                </Slider>
                            </div>
                        </Card>

                        <Card className='w-full rounded-lg shadow-lg py-3 px-5 bg-card border'>
                            <h1 className='text-lg text-foreground font-medium mb-2'>Canais Curtidos</h1>
                            <div className="w-full gap-2 mt-2 px-5">
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
                                            <h2 className="text-gray-500 font-medium text-sm">Você não curtiu nenhum canal.</h2>
                                        </div>
                                    )}
                                </Slider>
                            </div>
                        </Card>

                        <form className="w-full rounded-lg py-3 px-5 bg-card border mb-3" onSubmit={handleSubmitCreatePlaylist(handleCreatePlaylist)}>
                            <h2 className="text-lg text-foreground font-semibold">Criar uma nova playlist</h2>
                            <input
                                {...createPlaylist("userId")}
                                type="text"
                                placeholder="id"
                                value={user.id}
                                disabled
                                hidden
                                className="w-full px-4 py-2 text-base mt-2 rounded-sm bg-input text-secondary outline-none placeholder:text-ring"
                            />
                            <input
                                {...createPlaylist("name")}
                                type="text"
                                placeholder="Nome da playlist"
                                className="w-full px-4 py-2 text-base mt-2 rounded-sm bg-input text-foreground outline-none placeholder:text-neutral-700"
                            />
                            <button
                                className="w-full text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 mt-2 rounded-md  font-semibold"
                            >
                                Criar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
