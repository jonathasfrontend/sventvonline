import { Header } from "@/components/Header";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";

type User = {
    username: string;
    email: string;
    tag: string;
    cargo: string;
    id: string;
    avatar: string;
};

interface CardChannel {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    category: string;
  }

export default function Painel() {
    const [user, setUser] = useState<User[]>([]);
    const [channels, setChannels] = useState<CardChannel[]>([]);
    
    useEffect(() => {
        async function loadData() {
            const [
                userdata,
                channelsdata,
              ] = await Promise.all([
                  api.get("/users"),
                  api.get("/channels")
              ]);
    
                setUser(userdata.data);
                setChannels(channelsdata.data);
        }
        loadData();
    }, []);

    return (
        <div className="w-full h-screen">
            <Header />
            <div className="w-full flex gap-2 px-16 py-20">
                <div className="w-1/2 h-full">
                    {
                        // lista todos os usuarios só com avatar e username
                        user?.map((user: User) => (
                            <div key={user.id} className="w-full mb-2">
                                <div className='flex items-center justify-between bg-[#1c1c1c] w-full h-full rounded-lg shadow-lg px-5 py-2 gap-5'>
                                    <div className="flex items-center gap-5">
                                        <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl  ">
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
                                        <h1 className="text-base font-bold ">{user.username}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="text-white text-xs font-medium rounded-md px-3 py-1 bg-green-600">
                                            Atualizar
                                        </button>
                                        <button className="text-white text-xs font-medium rounded-md px-3 py-1 bg-red-600">
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className="w-1/2 h-full">
                    {
                        // lista todos os canais só com nome e categoria
                        channels?.map((channel: CardChannel) => (
                            <div key={channel.id} className="w-full mb-2">
                                <div className='flex items-center justify-between bg-[#1c1c1c] w-full h-full rounded-lg shadow-lg px-5 py-2 gap-5'>
                                    <div className="flex items-center gap-5">
                                        <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl  ">
                                            <Avatar.Image
                                                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#3fa5ff]"
                                                src={channel.image}
                                                alt={channel.name}
                                            />
                                            <Avatar.Fallback
                                                className="leading-1 flex w-12 h-12 items-center justify-center bg-white text-[25px] font-medium text-[#121214]"
                                                delayMs={600}
                                            >
                                                {channel.name?.charAt(0).toUpperCase()}
                                            </Avatar.Fallback>
                                        </Avatar.Root>
                                        <h1 className="text-base font-bold ">{channel.name}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="text-white text-xs font-medium rounded-md px-3 py-1 bg-green-600">
                                            Atualizar
                                        </button>
                                        <button className="text-white text-xs font-medium rounded-md px-3 py-1 bg-red-600">
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}