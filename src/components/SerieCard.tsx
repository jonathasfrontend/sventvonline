import { Img } from "./Img";

interface Serie {
    id: string,
    title: string,
    rating: {
        description: string,
    },
    description: {
        short: string,
    },
    assets: [
        {
            ratio: string,
            url: string,
            category: string,
        }
    ]
}
export default function Series(props: Serie) {
    return (
        <div className="w-[300px] h-[400px] bg-gray-800 relative overflow-hidden rounded-lg ">
            <div className="absolute top-0 left-0  w-full h-full gradient-series z-20"></div>
            <Img
                src={
                    props.assets.find((asset) => asset.ratio === "3:4" && asset.category === "Iconic")?.url
                }
                alt={props.title}
                className="absolute top-0 left-0 w-full h-full z-10"
            />
            <div className="absolute bottom-0 p-5 z-20">
                <h3 className="text-lg font-bold">{props.title}</h3>
                <p className="text-sm font-semibold text-gray-300 my-5">{props.description.short}</p>
                {
                    props.rating.description.includes("18") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-red-500">18</span>
                    ) : props.rating.description.includes("16") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-orange-700">16</span>
                    ) : props.rating.description.includes("14") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-orange-400">14</span>
                    ) : props.rating.description.includes("12") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-600">12</span>
                    ) : props.rating.description.includes("10") ? (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-yellow-500">10</span>
                    ) : (
                        <span className="w-[50px] text-center text-white text-sm font-semibold py-1 rounded-sm mt-2 block bg-green-500">Livre</span>
                    )
                }
            </div>
        </div>
    );
};