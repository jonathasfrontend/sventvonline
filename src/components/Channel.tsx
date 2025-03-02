import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from '../contexts/AuthContext';
import * as Avatar from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { CircleNotch, TrendUp } from "@phosphor-icons/react";
import CopyIdButton from "./CopyButton";
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


interface CardChannel {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    categoria: string;
}
type AddChannelData = {
    name: string;
    categoria: string;
    url: string;
    image: string;
};
type deleteChannelData = {
    id: string;
};
type deleteAllChannelData = {
    id: string;
    password: string;
};
interface PerformanceChannelData {
    id: string;
    name: string;
    likeCount: number;
    favoriteCount: number;
}
type UpdateChannelData = {
    id: string;
    name: string;
    categoria: string;
    image: string;
    url: string;
};

export default function Channel() {
    const [channels, setChannels] = useState<CardChannel[]>([]);
    const { register: registerChannel, handleSubmit: handleSubmitAddChannel } = useForm<AddChannelData>();
    const { register: registerDeleteChannel, handleSubmit: handleSubmitremoveChannel } = useForm<deleteChannelData>();
    const { register: registerDeleteAllChannel, handleSubmit: handleSubmitremoveAllChannel } = useForm<deleteAllChannelData>();
    const { register: registerUpdateChannel, handleSubmit: handleSubmitUpdateChannel } = useForm<UpdateChannelData>();
    const [performanceChannelData, setPerformanceChannelData] = useState<PerformanceChannelData[]>([]);
    const { addChannel, deleteChannel, deleteAllChannels, updateChannel } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    async function loadData() {
        const [
            channelsdata,
        ] = await Promise.all([
            api.get("/channels"),
        ]);
        setChannels(channelsdata.data);
    }

    async function getPerformanceChannelData() {
        try {
            const response = await api.get("/analytics/channel-performance");

            const performanceData = response.data.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    likeCount: item.likeCount,
                    favoriteCount: item.favoriteCount,
                };
            });

            setPerformanceChannelData(performanceData);

        } catch (error) {
            console.error("Erro ao buscar dados de performance:", error);
        }
    }

    useEffect(() => {
        loadData();
        getPerformanceChannelData();
    }, []);

    async function handleAddChannel(data: AddChannelData) {
        setIsLoading(true);
        try {
            await addChannel(data);
            loadData()
            getPerformanceChannelData();
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteChannel(data: deleteChannelData) {
        setIsLoading(true);
        try {
            await deleteChannel(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteAllChannels(data: deleteAllChannelData) {
        setIsLoading(true);
        try {
            await deleteAllChannels(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateChannel(data: UpdateChannelData) {
        setIsLoading(true);
        try {
            await updateChannel(data);
            loadData()
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <TabsContent value="channel" className="w-full flex flex-col gap-3 overflow-hidden">
            <div className="w-full h-full flex flex-col items-center gap-3 relative">
                <Card className="w-full pb-3 bg-card ">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendUp className="w-4 h-4" />
                            Desempenho dos canais por like
                        </CardTitle>
                        <CardDescription>
                            Desenpenho de cada canal por likes
                        </CardDescription>
                    </CardHeader>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={performanceChannelData}
                            margin={{ top: 30 }}
                        >
                            <CartesianGrid vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="likeCount" name="Likes" fill="var(--foreground)" radius={4} >
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
                <Card className="w-full pb-3 bg-card ">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendUp className="w-4 h-4" />
                            Desempenho de canais favoritos
                        </CardTitle>
                        <CardDescription>
                            Desenpenho de cada canal por favoritos
                        </CardDescription>
                    </CardHeader>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={performanceChannelData}
                            margin={{ top: 30 }}
                        >
                            <CartesianGrid vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="favoriteCount" name="Favoritos" fill="var(--foreground)" radius={4} >
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
                <div className="w-1/2 h-full">
                    <Tabs defaultValue="addChannel" className="w-full">
                        <TabsList className="ml-5 grid w-[300px] grid-cols-3">
                            <TabsTrigger value="addChannel">Adicionar</TabsTrigger>
                            <TabsTrigger value="updateChannel">Atualizar</TabsTrigger>
                            <TabsTrigger value="deletChannel">Remover</TabsTrigger>
                        </TabsList>

                        <TabsContent value="addChannel" className="w-full h-full flex flex-col gap-3">
                            <form className="w-full flex flex-col gap-3 rounded-lg shadow-lg p-5 bg-card border" onSubmit={handleSubmitAddChannel(handleAddChannel)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg text-foreground font-bold">Cadastrar Canal</h1>
                                    <p className="text-xs text-gray-500 mt-1">Adicione um novo canal a sua lista</p>
                                </div>
                                <input
                                    {...registerChannel('name')}
                                    type="text"
                                    placeholder="Nome do canal"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerChannel('categoria')}
                                    type="text"
                                    placeholder="Categoria do canal"
                                    id="categoria"
                                    name="categoria"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerChannel('image')}
                                    type="text"
                                    placeholder="Url da imagem"
                                    id="image"
                                    name="image"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerChannel('url')}
                                    type="text"
                                    placeholder="Url da TV"
                                    id="url"
                                    name="url"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center text-center text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-md font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircleNotch className="animate-spin text-white" size={32} />
                                    ) : (
                                        'Adicionar Canal'
                                    )}
                                </button>
                            </form>
                        </TabsContent>

                        <TabsContent value="updateChannel" className="w-full h-full flex flex-col gap-3">
                            <form className="w-full flex flex-col gap-2 rounded-lg shadow-lg p-5 bg-card border" onSubmit={handleSubmitUpdateChannel(handleUpdateChannel)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg text-foreground font-bold">Atualizar Canal</h1>
                                    <p className="text-xs text-gray-500 mt-1">Atualize um canal da sua lista</p>
                                </div>
                                <input
                                    {...registerUpdateChannel('id')}
                                    type="text"
                                    placeholder="Id do canal"
                                    id="id"
                                    name="id"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerUpdateChannel('name')}
                                    type="text"
                                    placeholder="Nome do canal"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerUpdateChannel('categoria')}
                                    type="text"
                                    placeholder="Categoria do canal"
                                    id="categoria"
                                    name="categoria"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerUpdateChannel('image')}
                                    type="text"
                                    placeholder="Url da imagem"
                                    id="image"
                                    name="image"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <input
                                    {...registerUpdateChannel('url')}
                                    type="text"
                                    placeholder="Url da do frame"
                                    id="url"
                                    name="url"
                                    className="w-full px-4 py-2 rounded-md bg-input border text-foreground outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center text-center text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-md font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircleNotch className="animate-spin text-white" size={32} />
                                    ) : (
                                        'Atualizar Canal'
                                    )}
                                </button>
                                <button
                                    type="reset"
                                    className="w-full text-foreground outline-none bg-chart-1 hover:opacity-[0.8] transition duration-100 py-2 rounded-md font-semibold"
                                >
                                    Limpar
                                </button>
                            </form>
                        </TabsContent>

                        <TabsContent value="deletChannel" className="w-full h-full flex flex-col gap-3">
                            <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-card border" onSubmit={handleSubmitremoveChannel(handleDeleteChannel)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg text-foreground font-bold">Deletar Canal</h1>
                                    <p className="text-xs text-gray-500 mt-1">Remova um canal da sua lista</p>
                                </div>
                                <div className="w-full flex items-center">
                                    <input
                                        {...registerDeleteChannel('id')}
                                        type="text"
                                        placeholder="Id do canal"
                                        id="id"
                                        name="id"
                                        className="w-full px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="w-[100px] text-foreground outline-none bg-chart-5 hover:opacity-[0.8] transition duration-100 py-2 rounded-tr-md rounded-br-md font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <CircleNotch className="animate-spin text-white" size={32} />
                                        ) : (
                                            'Deletar'
                                        )}
                                    </button>
                                </div>
                            </form>
                            <form className="w-full flex flex-col gap-5 rounded-lg shadow-lg p-5 bg-card border" onSubmit={handleSubmitremoveAllChannel(handleDeleteAllChannels)}>
                                <div className="w-full pb-3">
                                    <h1 className="text-lg text-foreground font-bold">Deletar Todos os Canais</h1>
                                    <p className="text-xs text-gray-500 mt-1">Remova todos os canais da sua lista</p>
                                </div>
                                <div className="w-full flex items-center">

                                    <input
                                        {...registerDeleteAllChannel('id')}
                                        type="text"
                                        placeholder="Id do usuario"
                                        id="id"
                                        name="id"
                                        disabled
                                        hidden
                                        value={localStorage.getItem("id_username") || ""}
                                        className="w-full px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                    />
                                    <input
                                        {...registerDeleteAllChannel('password')}
                                        type="password"
                                        placeholder="Senha"
                                        id="password"
                                        name="password"
                                        className="w-full px-4 py-2 rounded-tl-md rounded-bl-md bg-input border text-foreground outline-none"
                                    />
                                    <button
                                        className="w-[100px] text-foreground outline-none bg-chart-5 hover:opacity-[0.8] transition duration-100 py-2 rounded-tr-md rounded-br-md font-semibold"
                                    >
                                        {isLoading ? (
                                            <CircleNotch className="animate-spin text-white" size={32} />
                                        ) : (
                                            'Deletar'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="w-1/2 h-[560px] border rounded-xl p-5 bg-card overflow-hidden">
                    <div className="w-full pb-3">
                        <h1 className="text-lg text-foreground font-bold">Todos os canais</h1>
                        <p className="text-xs text-gray-500 mt-1">Todos os canais</p>
                    </div>
                    <ScrollArea className="w-full h-full pb-8">
                        {
                            // lista todos os canais só com nome e categoria
                            channels?.map((channel: CardChannel) => (
                                <div key={channel.id} className="w-full my-5">
                                    <div className='flex items-center justify-between w-full h-full gap-5'>
                                        <div className="w-full flex items-center justify-between ">
                                            <div className="w-full flex items-center gap-5">
                                                <Avatar.Root className="w-12 h-12 items-center justify-center overflow-hidden rounded-full  ">
                                                    <Avatar.Image
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#3fa5ff]"
                                                        src={channel.image}
                                                        alt={channel.name}
                                                    />
                                                    <Avatar.Fallback
                                                        className="leading-1 flex w-12 h-12 items-center justify-center bg-white text-[25px] font-medium text-[#121214]"
                                                        delayMs={600}
                                                    >
                                                        {channel.name?.charAt(0).toUpperCase()}
                                                    </Avatar.Fallback>
                                                </Avatar.Root>
                                                <h1 className="text-base text-foreground font-bold ">{channel.name}</h1>
                                                <p className="text-sm text-left text-gray-500">{channel.categoria}</p>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <CopyIdButton id={channel.id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollArea>
                </div>
            </div>
        </TabsContent>
    )
}