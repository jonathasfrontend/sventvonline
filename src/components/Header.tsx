import { destroyCookie } from "nookies";
import { useEffect, useState } from 'react';
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/white_logo.png';
import bcrypt from "bcryptjs-react";
import { MagnifyingGlass } from "@phosphor-icons/react";

// import { List } from '@phosphor-icons/react'

export function Header() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [nametag, setNametag] = useState<string | null>(null);
    const [cargo, setCargo] = useState<string>("");
    // const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
    const navigate = useNavigate();

    useEffect(() => {
        const storedAvatar = localStorage.getItem('avatar');
        const storedUsername = localStorage.getItem('username');
        const storedNametag = localStorage.getItem('tag');
        const storedCargo = localStorage.getItem("flag");
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedUsername) setUsername(storedUsername);
        if (storedNametag) setNametag(storedNametag);
        if (storedCargo) setCargo(storedCargo);
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        destroyCookie(null, 'nextauth.token');
        navigate('/login');
    };
    return (
        <header className='w-full px-16 py-5 absolute flex items-center justify-between z-50 gradient-header'>
            <div className='flex items-center'>
                <Link to='/'>
                    <img src={logo} alt="" className="w-[120px]" />
                </Link>
                <ul className="ml-10">
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/filmes' ?
                                <Link to='/filmes' className='text-[#3fa5ff] text-sm font-normal hover:text-[#3fa5ff]'>Filmes</Link> :
                                <Link to='/filmes' className='text-white text-sm font-normal hover:text-[#d1d1d1]'>Filmes</Link>
                        }
                    </li>
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/programacao' ?
                                <Link to='/programacao' className='text-[#3fa5ff] text-sm font-normal hover:text-[#3fa5ff]'>Guia</Link> :
                                <Link to='/programacao' className='text-white text-sm font-normal hover:text-[#d1d1d1]'>Guia</Link>
                        }
                    </li>
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/favoritos' ?
                                <Link to='/favoritos' className='text-[#3fa5ff] text-sm font-normal hover:text-[#3fa5ff]'>Favoritos</Link> :
                                <Link to='/favoritos' className='text-white text-sm font-normal hover:text-[#d1d1d1]'>Favoritos</Link>
                        }
                    </li>
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/playlists' ?
                                <Link to='/playlists' className='text-[#3fa5ff] text-sm font-normal hover:text-[#3fa5ff]'>Minha Lista</Link> :
                                <Link to='/playlists' className='text-white text-sm font-normal hover:text-[#d1d1d1]'>Minha Lista</Link>
                        }
                    </li>
                </ul>
            </div>

            <div className="flex items-center">
                <div className={`flex items-center overflow-hidden transition-all duration-300 ${isSearchOpen ? 'w-[270px] bg-[#ededed90] px-3 py-1 rounded-lg' : 'w-7'}`}>
                    <button
                        onClick={() => setIsSearchOpen(prev => !prev)}
                        className="outline-none"
                    >
                        <MagnifyingGlass className="w-6 h-6 text-white" />
                    </button>
                    <input
                        type="search"
                        placeholder="Pesquisar"
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent w-full h-[30px] outline-none text-[#121214] text-sm font-medium px-2 placeholder:text-[#121214] placeholder:text-sm'
                    />
                </div>

                <ul className="">
                    <li className='inline-block mx-5'>
                        {
                            window.location.pathname === '/infantil' ?
                                <Link to='/infantil' className='text-[#3fa5ff] text-sm font-normal hover:text-[#3fa5ff]'>Infantil</Link> :
                                <Link to='/infantil' className='text-white text-sm font-normal hover:text-[#d1d1d1]'>Infantil</Link>
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
                                    className="leading-1 flex size-full items-center justify-center bg-white text-sm font-medium text-[#121214]"
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
                                <Link to={`/me/${nametag}`} className="flex items-center hover:bg-[#12121445] p-2 rounded-md">
                                    <Avatar.Root className="size-[35px] select-none items-center justify-center overflow-hidden rounded-xl bg-blackA1 align-middle mr-2">
                                        <Avatar.Image
                                            className="size-full rounded-[inherit] object-cover border-2 border-[#3fa5ff]"
                                            src={avatar || ''}
                                            alt="Avatar"
                                        />
                                        <Avatar.Fallback
                                            className="leading-1 flex size-full items-center justify-center bg-white text-sm font-medium text-[#121214]"
                                            delayMs={600}
                                        >
                                            {username?.charAt(0).toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    <span className="text-white text-[13px] font-normal">{username}</span>
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="m-[5px] h-px bg-[#b6b6b643] " />

                            <DropdownMenu.Item className="w-full pl-1 outline-none">
                                { // verificar se o usuário é admin comparando com bcrypt se for admin exibir o botão de admin se não for não exibir
                                    bcrypt.compareSync("admin", cargo) ?
                                        <Link to="/painelcontrol" className="text-white text-base font-normal flex items-center py-2 px-3 rounded-md hover:bg-[#12121445]">Painel</Link> :
                                        null
                                }
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className="w-full h-[27px] pl-4 outline-none">
                                <span className="text-white text-base font-normal">Feedbak</span>
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className="w-full h-[27px] pl-4 outline-none">
                                <span className="text-white text-base font-normal">Ajuda</span>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="m-[5px] h-px bg-[#b6b6b643]" />

                            <DropdownMenu.Item className="w-full p-1 outline-none">
                                <button className="text-white rounded-md w-full px-3 py-1 text-left bg-red-600" onClick={handleSignOut}>
                                    <span className="text-white text-base font-medium">Sair</span>
                                </button>
                            </DropdownMenu.Item>

                            <DropdownMenu.Arrow className="fill-white" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </header>
    )
}