import * as Avatar from "@radix-ui/react-avatar";

interface CardScrollAreaProps {
    id: string;
    name: string;
    image: string;
}

export default function CardScrollArea(props: CardScrollAreaProps) {
    return (
        <div key={props.id} className="w-full my-5">
            <div className="flex items-center justify-between w-full h-full gap-5">
                <div className="flex items-center gap-5">
                    <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl">
                        <Avatar.Image
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-[#3fa5ff]"
                            src={props.image}
                            alt={props.name}
                        />
                        <Avatar.Fallback
                            className="leading-1 flex w-12 h-12 items-center justify-center bg-white text-[25px] font-medium text-[#121214]"
                            delayMs={600}
                        >
                            {props.name?.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <h1 className="text-base text-foreground font-bold">{props.name}</h1>
                </div>
            </div>
        </div>
    );
}   