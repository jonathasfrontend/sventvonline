interface Movie {
    id: string;
    title: string;
    rating: {
        description: string;
    },
    runTime: string;
    description: {
        short: string;
    },
    assets: [
        {
            ratio: string;
            url: string;
            category: string;
        }
    ]
}
function formatDuration(isoDuration : any) {
    // Remove o prefixo "PT"
    const duration = isoDuration.replace("PT", "");

    // Extrai horas e minutos
    const hours = duration.match(/(\d+)H/)?.[1] || "00";
    const minutes = duration.match(/(\d+)M/)?.[1] || "00";

    // Formata para HH:MM
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}


export default function Movies(props: Movie) {
    return (
        <div className="w-full h-screen bg-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full gradient-movies z-20"></div>
            <img
                src={
                    props.assets.find((asset) => asset.ratio === "16:9" )?.url
                }
                alt={props.title}
                className="absolute object-cover top-0 left-0 w-full h-full z-10"
            />
            <div className=" absolute w-full h-[400px] flex justify-between bottom-0 px-16 py-5 z-20">
                <div className="max-w-[700px]">
                    <h3 className="text-[50px] text-foreground font-bold">{props.title}</h3>
                    <span className="text-sm text-foreground">Duração: {formatDuration(props.runTime)}</span>
                <p className="text-base max-w-[500px] font-semibold text-foreground my-5">{props.description.short}</p>
                </div>
                <div className="h-full flex items-stretch justify-center flex-col">
                    {
                        props.rating.description.includes("18") ? (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-red-500">18</span>
                        ) : props.rating.description.includes("16") ? (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-orange-700">16</span>
                        ) : props.rating.description.includes("14") ? (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-orange-400">14</span>
                        ) : props.rating.description.includes("12") ? (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-600">12</span>
                        ) : props.rating.description.includes("10") ? (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-500">10</span>
                        ) : (
                            <span className="w-[50px] text-center text-foreground text-sm font-semibold py-1 rounded-sm mt-2 block bg-green-500">Livre</span>
                        )                    
                    }
                </div>
            </div>
        </div>
    );
};