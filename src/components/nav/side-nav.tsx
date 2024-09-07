"use client";
import React from "react";
import NavList from "./nav-list";
import TopNav from "./top-nav";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export function SideNav({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = React.useState<"close" | "open" | null | undefined>("close");

  const openVariant = cva(
    "w-[280px] fixed lg:left-0 left-[-280px] transition-all duration-200 bg-white z-50",
    {
      variants: {
        variant: {
          open: "left-0",
          close:
            "left-[-280px]",
        },
      },
      defaultVariants: {
        variant: "close",
      },
    }
  )
  const openVariantBlur = cva(
    "transition-all duration-200",
    {
      variants: {
        variant: {
          open: "blur-sm lg:blur-0",
          close:
            "",
        },
      },
      defaultVariants: {
        variant: "close",
      },
    }
  )

  return (
    <div className="flex flex-row left-0 w-full relative justify-end">
      <div className={cn(openVariant({ variant: open }))}>
        <div className="bg-primary-500">
          <div className="bg-white rounded-br-[32px] border-r-8 border-primary-500">
            <div className="h-[100px]" style={{
              backgroundImage: "url('https://cdn.discordapp.com/attachments/1048010244795678771/1169737777072590969/AIPEX_LOGO_light.png?ex=65567e32&is=65440932&hm=c5661bf76a5eefe78815e6821382ada234a600cf63469015c12599c68a586890&')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              marginRight: "16px",
              marginLeft: "16px",
            }}>
            </div>
          </div>
        </div>
        <div className="bg-primary-500 h-[calc(100vh-100px)] rounded-tl-[32px]">
          <NavList />
        </div>
      </div>
      <div className="flex flex-col lg:w-[calc(100vw-280px)] w-full transition-all duration-200">
        <TopNav onMenu={() => {
          if (open === "close") {
            setOpen("open")
          } else {
            setOpen("close")
          }
        }} menu={open} />
        <div className={cn(openVariantBlur({ variant: open }))} onClick={() => {
          if (open === "open") {
            setOpen("close")
          }
        }}>
          {children}
        </div>
      </div>
    </div>
  );

}