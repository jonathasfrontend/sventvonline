import { Header } from "@/components/Header";
import Overview from "@/components/Overview";
import Channel from "@/components/Channel";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Bounce, ToastContainer } from "react-toastify";

export default function Painel() {
    return (
        <div className="w-full h-screen bg-[#121214] ">
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
                    <TabsList className="grid w-[300px] grid-cols-3">
                        <TabsTrigger value="overviewdata">Visão Geral</TabsTrigger>
                        <TabsTrigger value="channel">Canais</TabsTrigger>
                        <TabsTrigger value="users">Usuarios</TabsTrigger>
                    </TabsList>
                    <Overview />
                    <Channel />
                </Tabs>

            </div>
        </div>
    );
}