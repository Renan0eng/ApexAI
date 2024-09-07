"use client"

import React from 'react';
import HomeTopNav from '../home-top-nav';
import Link from 'next/link';
import HomeFooter from '../home-footer';
import RestauranteSection1 from './ai-restaurante-home-section-1';
import RestauranteSection2 from './ai-restaurante-home-section-2';
import RestauranteHomeSection5 from './ai-restaurante-home-section-5';

type Props = {}

export default function AiRestauranteHomeView({ }: Props) {

  return (
    <main className='min-h-screen flex justify-center' >
      <div className='lg:w-2/3 h-full w-11/12 flex flex-col'>
        <div className=' gap-16 flex flex-col mt-32 min-h-screen'>
          <RestauranteSection1 />
          <RestauranteHomeSection5 />
          <RestauranteSection2 />
        </div>
      </div>
    </main>
  )

}