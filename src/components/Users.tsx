import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from '../contexts/AuthContext';
import * as Avatar from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { CircleNotch, TrendUp } from "@phosphor-icons/react";
import CopyIdButton from "./CopyButton";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import AccordionComponent from "./AccordionComponent";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig


type User = {
    id: string;
    username: string;
    email: string;
    nametag: string;
    cargo: string;
    avatar: string;
    createdAt: string;
    error?: string;
};

type RemoveUserData = {
    id: string;
};

interface EvolutionRegisterUsersData {
    month: string;
    registrations: number;
}

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

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const { register: registerRemoveUser, handleSubmit: handleSubmitRemoveUser } = useForm<RemoveUserData>();
    const [registerUsersData, setRegisterUserData] = useState<EvolutionRegisterUsersData[]>([]);
    const [detailsUsersData, setDetailsUsersData] = useState<DetailsUsersData[]>([]);
    const { removeUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    function getMonthName(month: string) {
        const monthNumber = parseInt(month.split("-")[1]);
        const monthNames = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];
        return monthNames[monthNumber - 1];
    }

    async function loadData() {
        const [
            usersdata,
        ] = await Promise.all([
            api.get('/users'),
        ]);
        setUsers(usersdata.data);
    }

    async function getEvolutionRegistersUsersData() {
        try {
            const response = await api.get("/analytics/registrations-evolution");

            const evolutionData = response.data.map((item: any) => {
                return {
                    month: getMonthName(item.month),
                    registrations: item.registrations,
                };
            });

            setRegisterUserData(evolutionData);

        } catch (error) {
            console.error("Erro ao buscar evolução:", error);
        }
    }

    async function getDetalhesUsers() {
        const response = await api.get('/users/full');

        const usersData = response.data.map((item: DetailsUsersData) => {
            return {
                id: item.id,
                username: item.username,
                email: item.email,
                password: item.password,
                avatar: item.avatar,
                created_at: item.created_at,
                nametag: item.nametag,
                cargo: item.cargo,
                likedChannels: item.likedChannels,
                favoritedChannels: item.favoritedChannels,
                playlists: item.playlists,
            };
        });

        setDetailsUsersData(usersData);

    }

    useEffect(() => {
        
    const interval = setInterval(() => {
        loadData();
        getDetalhesUsers();
        getEvolutionRegistersUsersData()
    }, 5000);

    return () => clearInterval(interval);
    }, []);

    async function handleDeleteUser(data: RemoveUserData) {
        setIsLoading(true);
        try {
            await removeUser(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    // Função auxiliar para formatar data
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
        <TabsContent value="users" className="w-full flex flex-col gap-3 overflow-hidden">
            <div className="w-full h-full flex flex-col items-center gap-3 relative">
                <Card className="w-full pb-3 bg-background ">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendUp className="w-4 h-4" />
                            Evolução de novos usuarios
                        </CardTitle>
                        <CardDescription>Total de novos usuarios nos últimos meses</CardDescription>
                    </CardHeader>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={registerUsersData}
                            margin={{ top: 30 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="registrations" fill="#ffffff" radius={4}>
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </Card>
            </div>
            <div className="w-full h-full flex gap-3 pb-5">
                <div className="w-full h-full">
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="ml-5 grid w-[250px] grid-cols-2">
                            <TabsTrigger value="users">Detalhes</TabsTrigger>
                            <TabsTrigger value="deleteUsers">Remover</TabsTrigger>
                        </TabsList>

                        <TabsContent value="users" className="w-full flex flex-col  gap-3">
                            <ScrollArea className="w-full h-full">
                                {
                                    detailsUsersData.map((user) => (
                                        <AccordionComponent
                                            key={user.id}
                                            id={user.id}
                                            username={user.username}
                                            password={user.password}
                                            email={user.email}
                                            avatar={user.avatar}
                                            created_at={user.created_at}
                                            nametag={user.nametag}
                                            cargo={user.cargo}
                                            likedChannels={user.likedChannels}
                                            favoritedChannels={user.favoritedChannels}
                                            playlists={user.playlists}
                                        />
                                    ))
                                }
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="deleteUsers" className="w-full flex justify-between gap-3">
                            <div className="w-1/2">
                                <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-background border" onSubmit={handleSubmitRemoveUser(handleDeleteUser)}>
                                    <div className="w-full pb-3">
                                        <h1 className="text-lg font-bold">Remover Usuario</h1>
                                        <p className="text-xs text-gray-500 mt-1">Remova a conta de um usuario</p>
                                    </div>
                                    <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                                        <input
                                            {...registerRemoveUser('id')}
                                            type="text"
                                            placeholder="ID do usuario"
                                            id="id"
                                            name="id"
                                            className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="relative inline-flex bg-[#ff3f3f] hover:bg-[#d73131] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <CircleNotch className="animate-spin text-white" size={32} />
                                        ) : (
                                            'Remover Usuario'
                                        )}
                                    </button>
                                </form>
                            </div>
                            <div className="w-1/2">
                                <div className="w-full h-[560px] border rounded-xl p-5 bg-background overflow-hidden">
                                    <div className="w-full pb-3">
                                        <h1 className="text-lg font-bold">Todos os usuarios</h1>
                                        <p className="text-xs text-gray-500 mt-1">Dados completos dos usuarios</p>
                                    </div>
                                    <ScrollArea className="w-full h-full pb-8">
                                        {
                                            users.map((user) => (
                                                <div key={user.id} className="w-full my-5">
                                                    <div className="flex items-center justify-between w-full h-full gap-5">
                                                        <div className="flex items-center gap-5">
                                                            <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-2xl">
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
                                                            <div className="w-auto flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <h1 className="text-base font-bold">{user.username}</h1>
                                                                    <p className="text-sm text-gray-400">@{user.nametag}</p>
                                                                </div>
                                                                <p className="text-xs py-1 text-gray-400">{user.email}</p>
                                                                <p className="text-[10px] text-gray-400">{formatData(user.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {
                                                                user.cargo === "admin" ? (
                                                                    <div className="flex items-center gap-2 bg-[#3fa5ff2f] px-2 py-1 rounded-lg">
                                                                        <p className="text-xs text-[#3fa5ff] font-semibold">Admin</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 bg-[#ff3f3f2f] px-2 py-1 rounded-lg">
                                                                        <p className="text-xs text-[#ff3f3f] font-semibold">User</p>
                                                                    </div>
                                                                )
                                                            }
                                                            <CopyIdButton id={user.id} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </ScrollArea>
                                </div>
                            </div>

                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TabsContent>
    )
}