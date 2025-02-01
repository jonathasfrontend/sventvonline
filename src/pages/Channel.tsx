import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../services/api";
import { Header } from '@/components/Header';

interface ChannelData {
    id: string,
    name: string,
    description: string,
    url: string,
    image: string,
    created_at: string,
    categoria: string,
}

export default function Channel() {
    const { id } = useParams();
    const [channel, setChannel] = useState<ChannelData | null>(null);

    useEffect(() => {
        api.get(`/channels/${id}`)
            .then(response => {
                setChannel(response.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const namechannel = channel?.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    return (
        <div className="w-full h-screen bg-[#121214] text-white relative">
            <Header />
            {channel && (
                <div className="w-full h-full">
                    <div className="w-full h-full absolute top-0 left-0">
                        <iframe
                            src={`https://reidoscanais.tv/embed/?id=${namechannel}`}
                            allow="encrypted-media"
                            allowFullScreen
                            scrolling="no"
                            title={channel.name}
                            className=" w-full h-full object-cover"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
// <!-- // %E3%83%87-%E3%83%B3-%E3%83%83-%E3%82%AF-%E3%82%B9-%E3%83%B3-%E3%83%87-%E3%83%89-%E3%83%89-%E3%83%AB-%E3%83%9C-%E3%83%A9-%E3%83%AB%E3%82%B0%E3%83%AC%E3%83%95%E3%83%88-%E3%83%96%E3%83%A0%E3%83%95%E3%82%AF%E3%83%88%E3%83%97%E3%83%89%E3%83%A9%E3%82%A2.%E3%82%B8-1l1-%E3%82%B0.%E3%83%83-22-%E3%82%AF-11-%E3%82%B9-33-%E3%83%AB-99-%E3%83%97-75-%E3%82%BE--%E3%82%A8--%E3%83%96--%E3%82%B9-%E3%83%83.%E3%82%AF.%E3%82%B9.%E3%82%BA.%E3%82%AF.%E3%82%B8.%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB%E3%83%91%E3%83%96%E3%83%AA%E3%82%B3-%E5%85%AC%E5%85%B1%E3%81%AE%E6%A8%99%E8%AD%98-%E3%83%90%E3%83%AC%E3%82%A6%E3%83%89%E3%83%83%E3%83%88%E3%82%B0%E3%82%A6%E3%82%AF%E3%83%88%E3%83%83%E3%83%88%E3%82%BA%E3%83%92.%E3%82%BB%E3%83%BC%E3%83%AB/player3/ch.php?canal=fx -->


// <!-- // https://reidoscanais.tv/embed/?id=fx         https://reidoscanais.tv/canais/canais.json -->
// <!-- https://reidoscanais.tv/embed/player.php?l=aHR0cHM6Ly9lbWJlZHN0cmVhbS5vcmcvcGxheWVyNS9zdGFyY2hhbm5lbC5odG1s -->
// <!-- https:///anonstream.zip/starchannel/index.m3u8 -->
// <!-- blob:https://embedstream.org/bb159f3d-44f8-4669-894d-e46f90358931 -->
