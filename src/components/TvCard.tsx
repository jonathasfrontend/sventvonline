import { Img } from "./Img";

interface Tv {
    id: string;
    name: string;
    description: string;
    genre: string;
    channelName: string;
    assets: [
        {
            url: string;
            assetId: string;
        }
    ];
}

export default function TvCard(props: Tv) {
    // pega o assetId separa só o epg360x540 do 0000599880_epg360x540 que fica depois do _ e compara com o assetId que tem o epg360x540 e retorna a url

    // Função para filtrar o asset correto
    // const getImageUrl = (): string | undefined => {
    //     return props.assets.find((asset) => {
    //         const [, size] = asset.assetId.split("_"); // Separa após o "_"
    //         return size === "epg360x540"; // Retorna o assetId que tem o epg360x540
    //     })?.url;
    // };

    return (
        <div className="w-[300px] h-[400px] bg-gray-800 relative overflow-hidden rounded-lg ">
            <div className="absolute top-0 left-0  w-full h-full gradient-series z-20"></div>
            <Img
                src={
                    props.assets.find((asset) => asset.assetId.includes("epg360x540") )?.url
                }
                decoding="async"
                data-nimg="intrinsic"
                alt={props.name}
                className="cms-Image"
            />
            <span className="absolute top-2 left-2 text-white text-sm font-semibold px-3 py-1">
                {props.genre}
            </span>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                    {props.name}
                </h3>
                <p className="text-sm text-gray-200 mt-3 line-clamp-3">
                    {props.description}
                </p>
                
                <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-500 font-medium">
                        {props.channelName}
                    </span>
                </div>
            </div>
        </div>
    );
}
