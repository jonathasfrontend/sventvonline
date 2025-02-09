import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Heart, Star, TelevisionSimple, TrendUp, Users } from "@phosphor-icons/react";
import CardScrollArea from "./CardScrollArea";
import CardData from "./CardData";
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

type User = {
  username: string;
  email: string;
  tag: string;
  cargo: string;
  id: string;
  avatar: string;
  createdAt: string;
  error?: string;
};

interface CardChannel {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  category: string;
  error?: string;
}

interface CardChannelLiked {
  id: string;
  name: string;
  description: string;
  categoria: string;
  url: string;
  image: string;
  error?: string;
}

interface EvolutionRegisterUsersData {
  month: string;
  registrations: number;
}
interface PopularCategories {
  categoria: string;
  likes: number;
  favorites: number;
  channelsCount: number;
  total: number;
}
interface PerformanceChannelData {
  id: string;
  name: string;
  likeCount: number;
  favoriteCount: number;
}
interface EvolutionLikesData {
  month: string;
  likes: number;
}

export default function Overview() {
  const [user, setUser] = useState<User[]>([]);
  const [channels, setChannels] = useState<CardChannel[]>([]);
  const [mostfavorited, setMostfavorited] = useState<CardChannelLiked[]>([]);
  const [mostliked, setMostliked] = useState<CardChannel[]>([]);
  const [registerUsersData, setRegisterUserData] = useState<EvolutionRegisterUsersData[]>([]);
  const [popularCategories, setPopularCategories] = useState<PopularCategories[]>([]);
  const [performanceChannelData, setPerformanceChannelData] = useState<PerformanceChannelData[]>([]);
  const [likesEvolutionData, setLikesEvolutionData] = useState<EvolutionLikesData[]>([]);

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

  async function getMostFavorited() {
    const results = await Promise.allSettled([
      api.get("/liked/mostliked"),
      api.get("/favorite/mostfavorited"),
    ]);

    if (results[0].status === "fulfilled") {
      const data = results[0].value.data;
      setMostliked(Array.isArray(data) ? data : [data]);
    } else {
      setMostliked([{ error: results[0].reason.response?.data?.error || "Nenhum like encontrado" } as CardChannel]);
    }

    if (results[1].status === "fulfilled") {
      const data = results[1].value.data;
      setMostfavorited(Array.isArray(data) ? data : [data]);
    } else {
      setMostfavorited([{ error: results[1].reason.response?.data?.error || "Nenhum favorito encontrado" } as CardChannelLiked]);
    }
  }

  async function getPromisesDataUsers() {
    try {
      const response = await api.get("/users");
      setUser(response.data.reverse());
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  async function getPromisesData() {
    try {
      const response = await api.get("/channels");
      setChannels(response.data);
    } catch (error) {
      console.error("Erro ao buscar canais:", error);
    }
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

  async function getPopularCategories() {
    try {
      const response = await api.get("/analytics/popular-categories");

      const popularCategories = response.data.map((item: any) => {
        return {
          categoria: item.categoria,
          likes: item.likes,
          favorites: item.favorites,
          channelsCount: item.channelsCount,
          total: item.total,
        };
      });

      setPopularCategories(popularCategories);

    } catch (error) {
      console.error("Erro ao buscar categorias populares:", error);
    }
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

  async function getaLikesEvolution() {
    try {
      const response = await api.get("/analytics/likes-evolution");

      const evolutionData = response.data.map((item: any) => {
        return {
          month: getMonthName(item.month),
          likes: item.likes,
        };
      });

      setLikesEvolutionData(evolutionData);

    } catch (error) {
      console.error("Erro ao buscar evolução de likes:", error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getPromisesData();
      getMostFavorited();
      getPromisesDataUsers();
      getEvolutionRegistersUsersData();
      getPopularCategories();
      getPerformanceChannelData();
      getaLikesEvolution();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TabsContent value="overviewdata" className="w-full flex flex-col gap-3">
      <div className="w-full h-full flex items-center gap-3">
        {user?.length > 0 ? (
          <CardData
            title="Total de usuários"
            icon={<Users className="w-5 h-5" />}
            value={user.length}
            description="Usuários cadastrados."
          />
        ) : (
          <CardData
            title="Total de usuários"
            icon={<Users className="w-5 h-5" />}
            value={"Carregando..."}
            description="Usuários cadastrados."
          />
        )}

        {/* Card com total de canais */}
        {channels?.length > 0 ? (
          <CardData
            title="Total de canais"
            icon={<TelevisionSimple className="w-5 h-5" />}
            value={channels.length}
            description="Canais cadastrados."
          />
        ) : (
          <CardData
            title="Total de canais"
            icon={<TelevisionSimple className="w-5 h-5" />}
            value={"Carregando..."}
            description="Canais cadastrados."
          />
        )}

        {/* Card do canal mais curtido */}
        {mostliked?.length > 0 ? (
          <CardData
            title="Canal mais curtido"
            icon={<Heart className="w-5 h-5" />}
            value={
              mostliked[0].error ? (
                <p className="text-lg font-bold">{mostliked[0].error}</p>
              ) : (
                <p className="text-3xl font-bold">{mostliked[0].name}</p>
              )
            }
            description="Canal mais curtido."
          />
        ) : (
          <CardData
            title="Canal mais curtido"
            icon={<Heart className="w-5 h-5" />}
            value={"Carregando..."}
            description="Canal mais curtido."
          />
        )}

        {/* Card do canal mais favoritado */}
        {mostfavorited?.length > 0 ? (
          <CardData
            title="Canal mais favoritado"
            icon={<Star className="w-5 h-5" />}
            value={
              mostfavorited[0].error ? (
                <p className="text-lg font-bold">{mostfavorited[0].error}</p>
              ) : (
                <p className="text-3xl font-bold">{mostfavorited[0].name}</p>
              )
            }
            description="Canal mais favoritado."
          />
        ) : (
          <CardData
            title="Canal mais favoritado"
            icon={<Star className="w-5 h-5" />}
            value={"Carregando..."}
            description="Canal mais favoritado."
          />
        )}
      </div>

      <div className="w-full h-[465px] flex items-center gap-3">
        <div className="w-1/2 ">
          <Card className="pb-3 bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp className="w-4 h-4" />
                Evolução de novos usuarios
              </CardTitle>
              <CardDescription>Total de novos usuarios nos últimos meses</CardDescription>
            </CardHeader>
            <ChartContainer config={chartConfig} className="w-full h-full">
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

        <div className="w-1/2 h-full grid grid-cols-2 gap-3 overflow-hidden">
          <div className="w-full h-full border rounded-xl p-5 bg-background">
            <div className="w-full pb-3">
              <h1 className="text-lg font-bold">Todos os canais</h1>
              <p className="text-xs text-gray-500 mt-1">Todos os canais</p>
            </div>
            <ScrollArea className="w-full h-full pb-8">
              {channels.length > 0 ? (
                channels.map((channel: CardChannel) => (
                  <CardScrollArea
                    key={channel.id}
                    id={channel.id}
                    name={channel.name}
                    image={channel.image}
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500">Nenhum canal cadastrado.</p>
                </div>
              )}
            </ScrollArea>
          </div>
          <div className="w-full h-full border rounded-xl p-5 bg-background overflow-hidden">
            <div className="w-full pb-3">
              <h1 className="text-lg font-bold">Todos os usuários</h1>
              <p className="text-xs text-gray-500 mt-1">Último usuário cadastrado</p>
            </div>
            <ScrollArea className="h-full w-full pb-5">
              {user.length > 0 ? (
                user.map((userItem: User) => (
                  <CardScrollArea
                    key={userItem.id}
                    id={userItem.id}
                    name={userItem.username}
                    image={userItem.avatar}
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500">Nenhum usuário cadastrado.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center gap-3 relativ">

        <Card className="w-full pb-3 bg-background ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="w-4 h-4" />
              Canais mais populares
            </CardTitle>
            <CardDescription>
              Canais mais populares por categoria dos canais.
            </CardDescription>
          </CardHeader>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={popularCategories}
              margin={{ top: 30 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="categoria"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="likes" name="Likes" fill="#ffffff" radius={4} >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar dataKey="favorites" name="Favoritos" fill="#ffffff" radius={4} >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar dataKey="channelsCount" name="Canais" fill="#ffffff" radius={4} >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar dataKey="total" name="Popularidade" fill="#ffffff" radius={4} >
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

        <Card className="w-full pb-3 bg-background ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="w-4 h-4" />
              Desempenho de canais
            </CardTitle>
            <CardDescription>
              Desenpenho de cada canal por likes e favoritos
            </CardDescription>
          </CardHeader>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={performanceChannelData}
              margin={{ top: 30 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="likeCount" name="Likes" fill="#ffffff" radius={4} >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar dataKey="favoriteCount" name="Favoritos" fill="#ffffff" radius={4} >
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

      <div className="w-full h-full flex items-center gap-3">
        <div className="w-1/2">
          <Card className="w-full h-full pb-3 bg-background ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp className="w-4 h-4" />
                Evolução de likes
              </CardTitle>
              <CardDescription>
                Evolução de likes de cada mes
              </CardDescription>
            </CardHeader>
            {/* likesEvolutionData */}
            {/* likes , month */}
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart
                accessibilityLayer
                data={likesEvolutionData}
                margin={{ top: 30 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={'month'}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="likes" name="Likes" fill="#ffffff" radius={4} >
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
        <div className="w-1/2"></div>
      </div>
    </TabsContent>
  );
}
