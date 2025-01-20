import { useEffect, useState } from 'react';
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import { List } from '@phosphor-icons/react'
import { api } from '../services/api';

interface Channel {
  id: string,
  name: string,
  description: string,
  url: string,
  image: string,
  created_at: string,
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/channels');
        setChannels(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getOrders();
  }, []);

  useEffect(() => {
    // Sincronizar com os dados do localStorage
    const storedAvatar = localStorage.getItem('avatar');
    const storedUsername = localStorage.getItem('username');
    if (storedAvatar) setAvatar(storedAvatar);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleSignOut = () => {
    destroyCookie(null, "nextauth.token");
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className='min-h-screen bg main_dashboard bg-[#121214] '>

      <header className='w-full px-16 py-5 flex items-center justify-between'>
        <div className='flex items-center'>
          <List className="text-white text-2xl mr-5" />
          <h1 className="text-white text-3xl font-semibold">Olá <span className='text-[#3fa5ff]'>{username}</span></h1>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild className='outline-none'>
            <button aria-label="Customise options ">
              <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
                <Avatar.Image
                  className="size-full rounded-[inherit] object-cover border-2 border-[#3fa5ff]"
                  src={avatar || ''}
                  alt="Avatar"
                />
                <Avatar.Fallback
                  className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                  delayMs={600}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] mr-6 rounded-md bg-[#30303a] p-2 outline-none"
              sideOffset={5}
            >
              <DropdownMenu.Item className="w-full h-[27px] pl-4">
                <span className="text-white text-base font-normal">Perfil</span>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="m-[5px] h-px bg-violet6 bg-[#525252]" />

              <DropdownMenu.Item className="w-full h-[27px] pl-4">
                <span className="text-white text-base font-normal">Configurações</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="w-full h-[27px] pl-4">
                <span className="text-white text-base font-normal">Ajuda</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="m-[5px] h-px bg-violet6 bg-[#525252]" />

              <DropdownMenu.Item className="w-full p-1">
                <button className="text-white rounded-md w-full px-3 py-1 text-left bg-red-600" onClick={handleSignOut}>
                  <span className="text-white text-base font-medium">Sair</span>
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>



      </header>
      <div className="relative w-full overflow-auto grid-cols-4 grid gap-2 px-16 py-5 ">
        {
          channels.map((channel) => (
            <div key={channel.id} className="w-full h-full relative flex flex-col items-center justify-center rounded-md text-white bg-[#323262] px-5 py-2 overflow-hidden">
              <img src={channel.image} alt={channel.name} className='w-[100px]'/>
              <h2>{channel.name}</h2>
              <p>{channel.description}</p>
            </div>
          ))
        }
      </div>

    </div>
  );
}
