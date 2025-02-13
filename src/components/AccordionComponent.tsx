import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowElbowDownRight } from "@phosphor-icons/react";
import * as Avatar from "@radix-ui/react-avatar";

interface DetailsUsersData {
    id: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    created_at: string;
    nametag: string;
    cargo: string;
    likedChannels: [
        {
            id: string;
            url: string;
            name: string;
            image: string;
            categoria: string;
            created_at: string;
            description: string;
        }
    ],
    favoritedChannels: [
        {
            id: string;
            url: string;
            name: string;
            image: string;
            categoria: string;
            created_at: string;
            description: string;
        }
    ],
    playlists: [
        {
            id: string;
            user_id: string;
            name: string;
            created_at: string;
            channels: [
                {
                    id: string;
                    url: string;
                    name: string;
                    image: string;
                    categoria: string;
                    created_at: string;
                    description: string;
                }
            ]
        }
    ]
}

export default function AccordionComponent(props: DetailsUsersData) {

    function formatData(data: string) {
        const date = new Date(data);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} as ${hours}:${minutes}`;
    }

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={props.id} key={props.id} className="w-full my-3 px-5 bg-card border rounded-lg">
                <AccordionTrigger className="w-full flex justify-between">
                    <div className="w-full flex items-center justify-between pr-3">
                        <div className="w-full flex items-center gap-3">
                            <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl">
                                <Avatar.Image
                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#3fa5ff]"
                                    src={props.avatar}
                                    alt={props.username}
                                />
                                <Avatar.Fallback
                                    className="leading-1 flex w-12 h-12 items-center justify-center bg-white text-[25px] font-medium text-[#121214]"
                                    delayMs={600}
                                >
                                    {props.username?.charAt(0).toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div>
                                <h1 className="text-base text-foreground font-bold">{props.username}</h1>
                                <p className="text-[10px] text-gray-400">{formatData(props.created_at)}</p>
                            </div>
                        </div>
                        {
                            props.cargo === "admin" ? (
                                <div className="flex items-center gap-2 bg-[#3fff592f] px-2 py-1 rounded-lg">
                                    <p className="text-xs text-[#3fff3f] font-semibold">Admin</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-[#3f8cff2f] px-2 py-1 rounded-lg">
                                    <p className="text-xs text-[#3fb9ff] font-semibold">Membro</p>
                                </div>
                            )
                        }
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="w-auto flex flex-col">
                        <p className="text-sm text-gray-400">Tag: @{props.nametag}</p>
                        <p className="text-sm my-2 text-gray-400">E-mail: {props.email}</p>
                        <p className="text-xs text-foreground">Senha: <span className="bg-slate-700 text-neutral-300 p-1 rounded-sm">{props.password}</span></p>
                        <div>
                            <h1 className="text-lg mt-3 text-foreground font-bold">Playlists</h1>
                            <div className="flex flex-col py-3 gap-2">
                                {
                                    props.playlists.length > 0 ? (
                                        props.playlists.map((playlist) => (
                                            <div key={playlist.id}>
                                                <div className="flex items-end">
                                                    <ArrowElbowDownRight size={32} />
                                                    <span className="text-sm">
                                                        {playlist.name}
                                                    </span>
                                                </div>
                                                {
                                                    playlist.channels.length > 0 ? (
                                                        playlist.channels.map((channel) => (
                                                            <div className="w-[200px] flex flex-col items-center my-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                                <div key={channel.id} className="flex items-center justify-center p-3">
                                                                    <img src={channel.image} alt={channel.name} className="w-16 h-16 rounded-full" />
                                                                </div>
                                                                <div className="flex flex-col p-2">
                                                                    <p className="text-sm font-bold">{channel.name}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-400">Nenhum canal nessa playlist</p>
                                                    )
                                                }
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">Nenhuma playlist criada</p>
                                    )
                                }
                            </div>
                            <h1 className="text-lg text-foreground font-bold">Favoritos</h1>
                            <div className="flex items-center gap-2">
                                {
                                    props.favoritedChannels.length > 0 ? (
                                        props.favoritedChannels.map((channel) => (
                                            <div className="w-[200px] flex flex-col items-center my-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                <div key={channel.id} className="flex items-center justify-center p-3">
                                                    <img src={channel.image} alt={channel.name} className="w-16 h-16 rounded-full" />
                                                </div>
                                                <div className="flex flex-col p-2">
                                                    <p className="text-sm font-bold">{channel.name}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">Nenhum canal favoritado</p>
                                    )
                                }
                            </div>
                            <h1 className="text-lg text-foreground font-bold">Curtidos</h1>
                            <div className="flex items-center gap-2">
                                {
                                    props.likedChannels.length > 0 ? (
                                        props.likedChannels.map((channel) => (
                                            <div className="w-[200px] flex flex-col items-center my-2 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                                <div key={channel.id} className="flex items-center justify-center p-3">
                                                    <img src={channel.image} alt={channel.name} className="w-16 h-16 rounded-full" />
                                                </div>
                                                <div className="flex flex-col p-2">
                                                    <p className="text-sm font-bold">{channel.name}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">Nenhum canal curtido</p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

    )
}