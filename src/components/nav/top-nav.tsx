import { Menu, Search } from 'lucide-react';
import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cookies } from 'next/headers';
import axios from 'axios';
import { User } from '@prisma/client';

interface PropTypes {
  onMenu: () => void;
  menu: string | null | undefined;
}

async function getUserData(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
  // busca os dados do usuario
  const user = await axios.get('/api/user').then((response) => {
    setUser(response.data);
  }).catch((error) => {
    console.log(error);
  });
  // retorna os dados do usuario
}

export default function TopNav({ onMenu, menu }: PropTypes) {

  const [open, setOpen] = React.useState(false);

  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    getUserData(setUser);
  }, []);

  return (
    <>
      <div className='h-[100px] t-0 flex flex-row right-0 items-center justify-between px-8 fixed w-full lg:w-[calc(100vw-290px)] backdrop-blur-sm'></div>
      <div className='h-[100px] t-0 flex flex-row right-0 items-center justify-between px-8 fixed w-full lg:w-[calc(100vw-290px)]'>
        <div className='flex flex-row items-center gap-x-8'>
          <div className='lg:hidden drop-shadow-lg rounded-full w-[50px] h-[50px] bg-white flex items-center justify-center cursor-pointer'>
            <Menu size={28} onClick={() => onMenu()} />
          </div>
        </div>
        <Popover defaultOpen open={open} onOpenChange={(open) => setOpen(open)}>
          <PopoverTrigger>
            <div
              style={{ backgroundImage: `url(/avatar.svg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              className='rounded-full w-[50px] h-[50px] bg-white border-primary-500 border-2 drop-shadow-lg cursor-pointer'>
            </div>
          </PopoverTrigger>
          <PopoverContent className='w-auto'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row items-center gap-x-4'>
                <div className='flex flex-col'>
                  <p className='text-md font-bold text-primary-500 text-center'>{user?.username}</p>
                  <p className='text-xs'>
                    <span className='text-neutral-300 font-semibold'>{user?.email}</span>
                  </p>
                </div>
              </div>
              <hr />
              <div className='flex flex-col gap-y-2 '>
                <Button size={"sm"} className='justify-start bg-white text-neutral-500 hover:bg-primary-50'>Perfil</Button>
                <Button size={"sm"} className='justify-start bg-white text-neutral-500 hover:bg-primary-50'>Configurações</Button>
                <Button size={"sm"} className='justify-start bg-white text-neutral-500 hover:bg-primary-50'
                  onClick={() => {
                    // remove o cookie auth_session
                    document.cookie = "auth_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                    // redireciona para a página de /
                    window.location.href = '/'
                  }}
                >Sair</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}