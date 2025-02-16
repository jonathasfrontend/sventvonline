import { destroyCookie } from "nookies";
import { useEffect, useState } from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/white_logo.png';
import bcrypt from "bcryptjs-react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { AvatarCompenent } from "./Avatar";

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
        <header className='w-full px-16 py-3 absolute flex items-center justify-between z-50 gradient-header'>
            <div className='flex items-center'>
                <Link to='/'>
                    <img src={logo} alt="" className="w-[100px]" />
                </Link>
                <ul className="ml-10">
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/filmes' ?
                                <Link to='/filmes' className='text-[#3fa5ff] text-sm font-medium hover:text-[#3fa5ff]'>Filmes</Link> :
                                <Link to='/filmes' className='text-foreground text-sm font-medium hover:text-[#d1d1d1]'>Filmes</Link>
                        }
                    </li>
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/programacao' ?
                                <Link to='/programacao' className='text-[#3fa5ff] text-sm font-medium hover:text-[#3fa5ff]'>Guia</Link> :
                                <Link to='/programacao' className='text-foreground text-sm font-medium hover:text-[#d1d1d1]'>Guia</Link>
                        }
                    </li>
                    <li className='inline-block mr-6 '>
                        {
                            window.location.pathname === '/favoritos' ?
                                <Link to='/favoritos' className='text-[#3fa5ff] text-sm font-medium hover:text-[#6ebbff]'>Favoritos</Link> :
                                <Link to='/favoritos' className='text-foreground text-sm font-medium hover:text-[#d1d1d1]'>Favoritos</Link>
                        }
                    </li>
                    <li className='inline-block mr-6'>
                        {
                            window.location.pathname === '/playlists' ?
                                <Link to='/playlists' className='text-[#3fa5ff] text-sm font-medium hover:text-[#3fa5ff]'>Minha Lista</Link> :
                                <Link to='/playlists' className='text-foreground text-sm font-medium hover:text-[#d1d1d1]'>Minha Lista</Link>
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
                        {
                            isSearchOpen ?
                                <MagnifyingGlass className="w-6 h-6 text-card" /> :
                                <MagnifyingGlass className="w-6 h-6 text-foreground" />
                        }

                    </button>
                    <input
                        type="text"
                        placeholder="Pesquisar canal"
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                        className='bg-transparent w-full h-[30px] outline-none text-[#121214] text-sm font-medium px-2 placeholder:text-[#121214] placeholder:text-sm placeholder:font-medium'
                    />
                </div>

                <ul className="">
                    <li className='inline-block mx-5'>
                        {
                            window.location.pathname === '/infantil' ?
                                <Link to='/infantil' className='text-[#3fa5ff] text-sm font-medium hover:text-[#3fa5ff]'>Infantil</Link> :
                                <Link to='/infantil' className='text-foreground text-sm font-medium hover:text-[#d1d1d1]'>Infantil</Link>
                        }
                    </li>
                </ul>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild className='outline-none'>
                        <button aria-label="Customise options ">
                        <AvatarCompenent nameUsers={username || ''} avatarUser={avatar || ''} size={45} />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[220px] mr-6 rounded-md bg-card shadow-2xl border p-2"
                            sideOffset={5}
                        >
                            <DropdownMenu.Item className="w-full pl-1 outline-none">
                                <Link to={`/me/${nametag}`} className="flex items-center hover:bg-hover p-2 rounded-md">
                                    <AvatarCompenent nameUsers={username || ''} avatarUser={avatar || ''} size={35} />
                                    <span className="text-foreground text-sm font-normal ml-2">{username}</span>
                                </Link>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="m-[5px] h-px bg-[#b6b6b643] " />

                            <DropdownMenu.Item className="w-full pl-1 outline-none">
                                {
                                    bcrypt.compareSync("admin", cargo) ?
                                        <Link to="/painelcontrol" className="text-foreground text-sm font-normal flex items-center py-2 px-3 rounded-md hover:bg-hover">Painel</Link> :
                                        null
                                }
                            </DropdownMenu.Item>

                            <DropdownMenu.Item className="w-full pl-1 outline-none">
                                <span className="text-foreground text-sm font-normal flex items-center py-2 px-3 rounded-md hover:bg-hover">Feedbak</span>
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="m-[5px] h-px bg-[#b6b6b643]" />

                            <DropdownMenu.Item className="w-full p-1 outline-none">
                                <button className="text-foreground rounded-md w-full px-3 py-1 text-left bg-red-600 hover:bg-red-500" onClick={handleSignOut}>
                                    <span className="text-foreground text-sm font-medium">Sair</span>
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