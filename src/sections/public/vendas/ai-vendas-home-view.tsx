"use client"

import React from 'react';
import HomeTopNav from '../home-top-nav';
import Link from 'next/link';
import HomeFooter from '../home-footer';
import VendasSection1 from './ai-vendas-home-section-1';
import VendasSection2 from './ai-vendas-home-section-2';
import VendasHomeSection5 from './ai-vendas-home-section-5';

type Props = {}

export default function AiVedasHomeView({ }: Props) {

  return (
    <main className='min-h-screen flex justify-center'>
      <div className='lg:w-2/3 h-full w-11/12 flex flex-col'>
        <div className=' gap-16 flex flex-col mt-32 min-h-screen'>
          <VendasSection1 />
          <VendasHomeSection5 />
          <VendasSection2 />
        </div>
      </div>
    </main>
  )

}