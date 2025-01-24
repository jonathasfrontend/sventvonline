interface Movie {
    id: string;
    title: string;
    rating: {
        description: string;
    },
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

export default function Movies(props: Movie) {
    return (
        <div className="w-[300px] h-[400px] bg-gray-800 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0  w-full h-full gradient z-20"></div>
            <img
                src={
                    props.assets.find((asset) => asset.ratio === "3:4" )?.url
                }
                alt={props.title}
                className="rounded-lg absolute top-0 left-0 w-full h-full z-10"
            />
            <div className="absolute w-full bottom-0 p-5 z-20">
                <h3 className="text-xl font-bold">{props.title}</h3>
                <p className="text-xs text-gray-300">{props.description.short}</p>
                {
                    props.rating.description.includes("18") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-red-500">18</span>
                    ) : props.rating.description.includes("16") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-red-500">16</span>
                    ) : props.rating.description.includes("14") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-500">14</span>
                    ) : props.rating.description.includes("12") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-500">12</span>
                    ) : props.rating.description.includes("10") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-green-500">10</span>
                    ) : (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-green-500">Livre</span>
                    )                    
                }
            </div>
        </div>
    );
};