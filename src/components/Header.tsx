import { destroyCookie } from "nookies";
import { useEffect, useState } from 'react';
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/white_logo.png';

// import { List } from '@phosphor-icons/react'

export function Header() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Sincronizar com os dados do localStorage
        const storedAvatar = localStorage.getItem('avatar');
        const storedUsername = localStorage.getItem('username');
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    const handleSignOut = () => {
        // Limpar os dados do localStorage e dos cookies menos o cached_channels do local storage
        localStorage.clear();
        destroyCookie(null, 'nextauth.token');
        destroyCookie(null, 'nextauth.refreshToken');
        navigate('/');
    };
    return (
        <header className='w-full px-16 py-5 absolute flex items-center justify-between z-50 gradient-header'>
            <div className='flex items-center'>
                <Link to='/dashboard' className='text-white text-[15px] font-normal hover:text-[#3fa5ff]'>
                    <img src={logo} alt="" className="w-[120px]" />
                </Link>
            </div>

            <ul>
                <li className='inline-block mr-6'>
                    {
                        window.location.pathname === '/programacao' ?
                            <Link to='/programacao' className='text-[#3fa5ff] text-[15px] font-normal hover:text-[#3fa5ff]'>Guia</Link> :
                            <Link to='/programacao' className='text-white text-[15px] font-normal hover:text-[#3fa5ff]'>Guia</Link>
                    }
                </li>
                <li className='inline-block mr-6'>
                    {
                        window.location.pathname === '/favoritos' ?
                            <Link to='/favoritos' className='text-[#3fa5ff] text-[15px] font-normal hover:text-[#3fa5ff]'>Favoritos</Link> :
                            <Link to='/favoritos' className='text-white text-[15px] font-normal hover:text-[#3fa5ff]'>Favoritos</Link>
                    }
                </li>
                <li className='inline-block mr-6'>
                    {
                        window.location.pathname === '/playlists' ?
                            <Link to='/playlists' className='text-[#3fa5ff] text-[15px] font-normal hover:text-[#3fa5ff]'>Playlists</Link> :
                            <Link to='/playlists' className='text-white text-[15px] font-normal hover:text-[#3fa5ff]'>Playlists</Link>
                    }
                </li>

            </ul>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild className='outline-none'>
                    <button aria-label="Customise options ">
                        <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-2xl  ">
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
                        className="min-w-[220px] mr-6 rounded-md bg-[#323262] p-2"
                        sideOffset={5}
                    >
                        <DropdownMenu.Item className="w-full pl-1 outline-none">
                            <Link to={'/perfil'} className="flex items-center hover:bg-[#12121445] p-2 rounded-md">
                                <Avatar.Root className="size-[35px] select-none items-center justify-center overflow-hidden rounded-xl bg-blackA1 align-middle mr-2">
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
                                <span className="text-white text-[13px] font-normal">{username}</span>
                            </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="m-[5px] h-px bg-violet6 bg-[#b6b6b643] " />

                        <DropdownMenu.Item className="w-full h-[27px] pl-4 outline-none">
                            <span className="text-white text-base font-normal">Feedbak</span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="w-full h-[27px] pl-4 outline-none">
                            <span className="text-white text-base font-normal">Ajuda</span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="m-[5px] h-px bg-violet6 bg-[#b6b6b643]" />

                        <DropdownMenu.Item className="w-full p-1 outline-none">
                            <button className="text-white rounded-md w-full px-3 py-1 text-left bg-red-600" onClick={handleSignOut}>
                                <span className="text-white text-base font-medium">Sair</span>
                            </button>
                        </DropdownMenu.Item>

                        <DropdownMenu.Arrow className="fill-white" />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </header>
    )
}