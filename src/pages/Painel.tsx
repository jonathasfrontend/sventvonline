import { Header } from "@/components/Header";
import Overview from "@/components/Overview";
import Channel from "@/components/Channel";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Bounce, ToastContainer } from "react-toastify";
import Users from "@/components/Users";

export default function Painel() {
    return (
        <div className="w-full h-full bg-background ">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            <Header />
            <div className="w-full flex px-5 pt-24">
                <Tabs defaultValue="overviewdata" className="w-full">
                    <TabsList className="grid w-[370px] grid-cols-4">
                        <TabsTrigger value="overviewdata">Visão Geral</TabsTrigger>
                        <TabsTrigger value="channel">Canais</TabsTrigger>
                        <TabsTrigger value="users">Usuarios</TabsTrigger>
                        <TabsTrigger value="feed">Feedbaks</TabsTrigger>
                    </TabsList>
                    <Overview />
                    <Channel />
                    <Users />
                </Tabs>

            </div>
        </div>
    );
}