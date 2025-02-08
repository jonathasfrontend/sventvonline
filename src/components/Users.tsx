import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from '../contexts/AuthContext';
import * as Avatar from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { CircleNotch } from "@phosphor-icons/react";
import CopyIdButton from "./CopyButton";

type User = {
    username: string;
    email: string;
    nametag: string;
    cargo: string;
    id: string;
    avatar: string;
    createdAt: string;
    error?: string;
};

type AddChannelData = {
    name: string;
    categoria: string;
    image: string;
};
type deleteChannelData = {
    id: string;
};
type deleteAllChannelData = {
    id: string;
    password: string;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const { register: registerChannel, handleSubmit: handleSubmitAddChannel } = useForm<AddChannelData>();
    const { register: registerDeleteChannel, handleSubmit: handleSubmitremoveChannel } = useForm<deleteChannelData>();
    const { register: registerDeleteAllChannel, handleSubmit: handleSubmitremoveAllChannel } = useForm<deleteAllChannelData>();
    const { addChannel, deleteChannel, deleteAllChannels } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    async function loadData() {
        const [
            usersdata,
        ] = await Promise.all([
            api.get("/users"),
        ]);
        setUsers(usersdata.data);
    }
    useEffect(() => {
        loadData();
    }, []);

    async function handleAddChannel(data: AddChannelData) {
        setIsLoading(true);
        try {
            await addChannel(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteChannel(data: deleteChannelData) {
        setIsLoading(true);
        try {
            await deleteChannel(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteAllChannels(data: deleteAllChannelData) {
        setIsLoading(true);
        try {
            await deleteAllChannels(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    // Função auxiliar para formatar data
    function formatData(data: string) {
        const date = new Date(data);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} | ${hours}:${minutes}`;
    }

    return (
        <TabsContent value="users" className="w-full flex flex-col overflow-hidden">
            <div className="w-full h-full flex gap-3">
                <div className="w-1/2 h-full">
                    <Tabs defaultValue="addChannel" className="w-full">
                        <TabsList className="grid w-[250px] grid-cols-2">
                            <TabsTrigger value="addChannel">Adicionar</TabsTrigger>
                            <TabsTrigger value="deletChannel">Remover</TabsTrigger>
                        </TabsList>

                        <TabsContent value="addChannel" className="w-full flex flex-col gap-3">
                            <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-background border" onSubmit={handleSubmitAddChannel(handleAddChannel)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg font-bold">Cadastrar Canal</h1>
                                    <p className="text-xs text-gray-500 mt-1">Adicione um novo canal a sua lista</p>
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerChannel('name')}
                                        type="text"
                                        placeholder="Nome do canal"
                                        id="name"
                                        name="name"
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerChannel('categoria')}
                                        type="text"
                                        placeholder="Categoria do canal"
                                        id="categoria"
                                        name="categoria"
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerChannel('image')}
                                        type="text"
                                        placeholder="Url da imagem"
                                        id="image"
                                        name="image"
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="relative inline-flex bg-[#3fa6ff] hover:bg-[#318ad7] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircleNotch className="animate-spin text-white" size={32} />
                                    ) : (
                                        'Adicionar Canal'
                                    )}
                                </button>
                            </form>
                        </TabsContent>
                        <TabsContent value="deletChannel" className="w-full flex flex-col gap-3">
                            <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-background border" onSubmit={handleSubmitremoveChannel(handleDeleteChannel)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg font-bold">Deletar Canal</h1>
                                    <p className="text-xs text-gray-500 mt-1">Remova um canal da sua lista</p>
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerDeleteChannel('id')}
                                        type="text"
                                        placeholder="Id do canal"
                                        id="id"
                                        name="id"
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="relative inline-flex bg-[#ff3f3f] hover:bg-[#d73131] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircleNotch className="animate-spin text-white" size={32} />
                                    ) : (
                                        'Deletar Canal'
                                    )}
                                </button>
                            </form>
                            <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-background border" onSubmit={handleSubmitremoveAllChannel(handleDeleteAllChannels)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg font-bold">Deletar Todos os Canais</h1>
                                    <p className="text-xs text-gray-500 mt-1">Remova todos os canais da sua lista</p>
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerDeleteAllChannel('id')}
                                        type="text"
                                        placeholder="Id do usuario"
                                        id="id"
                                        name="id"
                                        value={localStorage.getItem("id_username") || ""} // pega o id do usuario logado
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                    <input
                                        {...registerDeleteAllChannel('password')}
                                        type="password"
                                        placeholder="Senha"
                                        id="password"
                                        name="password"
                                        className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                    />
                                </div>
                                <button
                                    className="relative inline-flex bg-[#ff3f3f] hover:bg-[#d73131] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                                >
                                    {isLoading ? (
                                        <CircleNotch className="animate-spin text-white" size={32} />
                                    ) : (
                                        'Deletar Todos os Canais'
                                    )}
                                </button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="w-1/2 h-[560px] border rounded-xl p-5 bg-background overflow-hidden">
                    <div className="w-full pb-3">
                        <h1 className="text-lg font-bold">Todos os usuarios</h1>
                        <p className="text-xs text-gray-500 mt-1">Dados completos dos usuarios</p>
                    </div>
                    <ScrollArea className="w-full h-full pb-8">
                        {
                            users.map((user) => (
                                <div key={user.id} className="w-full my-5">
                                    <div className="flex items-center justify-between w-full h-full gap-5">
                                        <div className="flex items-center gap-5">
                                            <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl">
                                                <Avatar.Image
                                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#3fa5ff]"
                                                    src={user.avatar}
                                                    alt={user.username}
                                                />
                                                <Avatar.Fallback
                                                    className="leading-1 flex w-12 h-12 items-center justify-center bg-white text-[25px] font-medium text-[#121214]"
                                                    delayMs={600}
                                                >
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </Avatar.Fallback>
                                            </Avatar.Root>
                                            <div className="w-auto flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h1 className="text-base font-bold">{user.username}</h1>
                                                    <p className="text-sm text-gray-400">@{user.nametag}</p>
                                                </div>
                                                <p className="text-xs py-1 text-gray-400">{user.email}</p>
                                                <p className="text-[10px] text-gray-400">{formatData(user.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {
                                                user.cargo === "admin" ? (
                                                    <div className="flex items-center gap-2 bg-[#3fa5ff2f] px-2 py-1 rounded-lg">
                                                        <p className="text-xs text-[#3fa5ff] font-semibold">Admin</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-[#ff3f3f2f] px-2 py-1 rounded-lg">
                                                        <p className="text-xs text-[#ff3f3f] font-semibold">User</p>
                                                    </div>
                                                )
                                            }
                                            <CopyIdButton id={user.id} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollArea>
                </div>
            </div>
        </TabsContent>
    )
}