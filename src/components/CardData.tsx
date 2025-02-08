import { Card } from "@/components/ui/card";

interface UserCardDataProps {
    title: string;
    icon: React.ReactNode;
    value: number|string|React.ReactNode;
    description: string;
}

export default function CardData(props: UserCardDataProps) {
    return (
        <Card className="w-full h-[143px] bg-background p-5">
            <div className="w-full flex items-center justify-between pb-5">
                <span className="text-sm font-medium">{props.title}</span>
                {props.icon}
            </div>
            <div className="w-full flex flex-col">
                <p >
                    {
                        typeof props.value === "number" ? (
                            <span className="text-4xl font-bold">+{props.value}</span>
                        ) : typeof props.value === "string" ? (
                            <span className="text-sm font-bold">{props.value}</span>
                        ) : (
                            props.value
                        )
                    }
                </p>
                <span className="text-xs text-gray-500 mt-2">{props.description}</span>
            </div>
        </Card>
    );
}