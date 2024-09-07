"use client"

import React from 'react';
import HomeTopNav from '../home-top-nav';
import Link from 'next/link';
import HomeFooter from '../home-footer';
import SuporteSection1 from './ai-suporte-home-section-1';
import SuporteSection2 from './ai-suporte-home-section-2';
import SuporteHomeSection5 from './ai-suporte-home-section-5';

type Props = {}

export default function AiSuporteHomeView({ }: Props) {

  return (
    <main className='min-h-screen flex justify-center'>
      <div className='lg:w-2/3 h-full w-11/12 flex flex-col'>
        <div className=' gap-16 flex flex-col mt-32 min-h-screen'>
          <SuporteSection1 />
          <SuporteHomeSection5 />
          <SuporteSection2 />
        </div>
      </div>
    </main>
  )

}