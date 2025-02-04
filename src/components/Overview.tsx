import { api } from "@/services/api";
import { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    TabsContent
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card"
import { Heart, Star, TelevisionSimple, Users } from "@phosphor-icons/react";

type User = {
    username: string;
    email: string;
    tag: string;
    cargo: string;
    id: string;
    avatar: string;
    createdAt: string;
};

interface CardChannel {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    category: string;
}
interface CardChannelLiked {
    id: string,
    name: string,
    description: string,
    categoria: string,
    url: string,
    image: string,
}

export default function Overview() {

    const [user, setUser] = useState<User[]>([]);
    const [channels, setChannels] = useState<CardChannel[]>([]);
    const [mostfavorited, setMostfavorited] = useState<CardChannelLiked[]>([]);
    const [mostliked, setMostliked] = useState<CardChannel[]>([]);

    async function loadData() {
        const [
            userdata,
            channelsdata,
            mostlikeddata,
            mostfavoriteddata,
        ] = await Promise.all([
            api.get("/users"),
            api.get("/channels"),
            api.get("/metadata/mostliked"),
            api.get("/metadata/mostfavorited"),
        ]);

        setUser(userdata.data.reverse());
        setChannels(channelsdata.data);
        setMostliked(
            Array.isArray(mostlikeddata.data)
                ? mostlikeddata.data
                : [mostlikeddata.data]
        );
        setMostfavorited(
            Array.isArray(mostfavoriteddata.data)
                ? mostfavoriteddata.data
                : [mostfavoriteddata.data]
        );
    }
    useEffect(() => {
        // executa o loadData(); a cada 5 segundos
        const interval = setInterval(() => {
            loadData();
        }, 5000); // a cada 5 segundos
        return () => clearInterval(interval); // limpa o intervalo
    }, []);

    // função para formatar data e horario do createdAt
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
        <TabsContent value="overviewdata" className="w-full flex flex-col gap-3">
            <div className="w-full h-full flex items-start gap-3 ">
                {
                    // mostra a quantidade de contas de usuarios
                    user?.length > 0 ? (
                        <Card className="w-full h-[143px] bg-background p-5">
                            <div className="w-full flex items-center justify-between pb-5">
                                <span className="text-sm font-medium">Total de usuarios</span>
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="w-full flex flex-col ">
                                <p className="text-4xl font-bold">+{user?.length}</p>
                                <span className="text-xs text-gray-500 mt-2">Usuarios cadastrados.</span>
                            </div>
                        </Card>
                    ) : (
                        <Skeleton className="w-full h-[147x] rounded-lg" />
                    )
                }
                {
                    // mostra a quantidade de canais
                    channels?.length > 0 ? (
                        <Card className="w-full h-[143px] bg-background p-5">
                            <div className="w-full flex items-center justify-between pb-5">
                                <span className="text-sm font-medium">Total de canais</span>
                                <TelevisionSimple className="w-5 h-5" />
                            </div>
                            <div className="w-full flex flex-col ">
                                <p className="text-4xl font-bold">+{channels?.length}</p>
                                <span className="text-xs text-gray-500 mt-2">Canais cadastrados.</span>
                            </div>
                        </Card>
                    ) : (
                        <Skeleton className="w-full h-[147x] rounded-lg" />
                    )
                }
                {
                    // mostra o canal mais curtido
                    mostliked?.length > 0 ? (
                        <Card className="w-full h-[143px] bg-background p-5">
                            <div className="w-full flex items-center justify-between pb-5">
                                <span className="text-sm font-medium">Canal mais curtido</span>
                                <Heart className="w-5 h-5" />
                            </div>
                            <div className="w-full flex flex-col ">
                                <p className="text-3xl font-bold">{mostliked[0].name}</p>
                                <span className="text-xs text-gray-500 mt-2">Canal mais curtido.</span>
                            </div>
                        </Card>
                    ) : (
                        <Skeleton className="w-full h-[147x] rounded-lg" />
                    )
                }
                {
                    // mostra o canal mais favoritado
                    mostfavorited?.length > 0 ? (
                        <Card className="w-full h-[143px] bg-background p-5">
                            <div className="w-full flex items-center justify-between pb-5">
                                <span className="text-sm font-medium">Canal mais favoritado</span>
                                <Star className="w-5 h-5" />
                            </div>
                            <div className="w-full flex flex-col ">
                                <p className="text-3xl font-bold">{mostfavorited[0].name}</p>
                                <span className="text-xs text-gray-500 mt-2">Canal mais favoritado.</span>
                            </div>
                        </Card>
                    ) : (
                        <Skeleton className="w-full h-[147x] rounded-lg" />
                    )
                }
            </div>
            <div className="w-full h-full flex items-center gap-3 overflow-hidden">
                <div className="w-1/2 h-[420px] border rounded-xl p-5 bg-background">
                    <div className="w-full pb-3">
                        <h1 className="text-lg font-bold">Todos os canais</h1>
                        <p className="text-xs text-gray-500 mt-1">Todos os canais</p>
                    </div>
                    <ScrollArea className="w-full h-full pb-8">
                        {
                            // lista todos os canais só com nome e categoria
                            channels?.map((channel: CardChannel) => (
                                <div key={channel.id} className="w-full my-5">
                                    <div className='flex items-center justify-between w-full h-full gap-5'>
                                        <div className="flex items-center gap-5">
                                            <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-full  ">
                                                <Avatar.Image
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#3fa5ff]"
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
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollArea>
                </div>
                <div className="w-1/2 h-[420px] border rounded-xl p-5 bg-background overflow-hidden">
                    <div className="w-full pb-3">
                        <h1 className="text-lg font-bold">Todos os usuarios</h1>
                        <p className="text-xs text-gray-500 mt-1">Ultimo usuario cadastrado</p>
                    </div>
                    <ScrollArea className="h-full w-full pb-5">
                        {
                            // lista todos os usuarios só com avatar e username
                            user?.map((user: User) => (
                                <div key={user.id} className="w-full my-5">
                                    <div className='flex items-center justify-between w-full h-full gap-5'>
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
                                            <p className="text-xs text-gray-400">
                                                {formatData(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollArea>
                </div>
            </div>
        </TabsContent>
    );
}