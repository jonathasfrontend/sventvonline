import { useEffect, useState } from 'react';
import { api } from "../services/api";
import { Header } from "@/components/Header";
import { CardChannel } from '@/components/CardChannel';

interface CardChannelProps {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    like_count: number;
    liked_by: {
        user_id: string;
        user_name: string;
        user_avatar: string;
    }[];
}

export default function Movies() {
    const [moviesChannel, setMoviesChannel] = useState<CardChannelProps[]>([]);

    useEffect(() => {
        api.get(`/liked/channelswithlikes/Filmes`)
            .then(response => {
                setMoviesChannel(response.data);
            })
            .catch(err => console.error(err));
    }, []);
    return (
        <div className="h-full bg-background">
            <Header />

            <div className="w-full flex flex-col pt-10 px-16 items-center justify-center">
                <h1 className="text-foreground text-4xl font-bold mt-10">
                    Canais de Filmes
                </h1>
                <div className="w-full grid grid-cols-4 gap-3 py-10">
                    {
                        moviesChannel.length > 0 ? (
                            moviesChannel.map((channel) => (
                                <CardChannel
                                    key={channel.id}
                                    id={channel.id}
                                    name={channel.name}
                                    url={channel.url}
                                    description={channel.description}
                                    image={channel.image}
                                    likeCount={channel.like_count}
                                    likedBy={channel.liked_by}
                                />
                            ))
                        ) : (
                            <div className="w-full h-full text-center flex justify-center items-center">
                                <h1 className="text-gray-500 font-medium text-base">Carregando...</h1>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}