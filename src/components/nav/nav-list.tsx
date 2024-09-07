import { List, ListItem, Badge } from "@tremor/react";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCpu } from "react-icons/bs";
import { TbPlus } from "react-icons/tb";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { LiaCashRegisterSolid } from "react-icons/lia";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export const items = [
  {
    // title: 'Dashboard',
    children: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <AiOutlineDashboard />,
      },
    ],
  },
  {
    // title: 'Admin',
    icon: <></>,
    children: [
      {
        title: "AIs",
        path: "/ai-config",
        new: false,
        icon: <BsCpu />,
        children: [
          {
            title: "Cadastro",
            path: "/ai-config/register",
            new: false,
            icon: <TbPlus />,
          },
        ]
      },
      {
        title: "Vendedores",
        path: "/ai-venda",
        new: false,
        icon: <LiaCashRegisterSolid />,
        children: [
          {
            title: "Cadastro",
            path: "/ai-venda/register",
            new: false,
            icon: <TbPlus />,
          },
        ]
      },
      {
        title: 'WhatsApp',
        path: '/whats-config',
        new: false,
        icon: <FaWhatsapp />,
      },
    ],
  },
] as Item[];

type Item = {
  title: string;
  path: string;
  icon: React.ReactNode;
  new?: boolean;
  children?: Item[];
};

const NavList: React.FC = () => {
  const pathname = usePathname();
  return (
    <div>
      <div className="text-white pt-4 flex flex-col gap-1">
        {items.map((item, index) => (
          <Item key={index} item={item} pathname={pathname} />
        ))}
      </div>
    </div>
  );
};

export default NavList;

import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "../ui/button";

function Item({ item, pathname }: { item: Item; pathname: string }) {
  const ItemListVariant = cva(
    "px-3 flex flex-row items-center justify-between text-white/90 font-bold hover:bg-secondary-500/60 hover:text-white rounded-full after",
    {
      variants: {
        active: {
          true: "bg-secondary-500/60 text-white",
          false: "",
        },
        visible: {
          true: "visible",
          false: "invisible",
        },
      },
      defaultVariants: {
        active: false,
      },
    }
  );

  const ItemChildrenOpen = cva(
    "pl-4 pt-1 flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out",
    {
      variants: {
        active: {
          true: "h-auto",
          false: "h-0",
        },
      },
      defaultVariants: {
        active: false,
      },
    }
  );

  const [open, setOpen] = useState<boolean[]>(
    Array(item.children?.length).fill(false)
  );

  const handleOpen = (index: number) => {
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  };

  return (
    <div>
      <ul className="flex flex-col px-4">
        {item.title && (
          <ListItem className="flex flex-row items-center justify-start font-bold">
            {item.icon}
            <span className="ml-2 text-lg ">{item.title.toUpperCase()}</span>
          </ListItem>
        )}
        {item.children && (
          <div className="w-full flex flex-col gap-1">
            {item.children.map((child, index) => {
              const itemActive = pathname === child.path;

              const childrenActive = child.children?.filter(
                (child2) => pathname === child2.path
              ).length
                ? true
                : false;
              return (
                <div key={index}>
                  <Link href={child.path}>
                    <ListItem
                      key={index}
                      className={ItemListVariant({
                        active: itemActive || (childrenActive && !open[index]),
                      })}
                    >
                      <div className="flex flex-row items-center justify-start">
                        <span className="text-[24px]">{child.icon}</span>
                        <span className="ml-2 text-[14px] text-white">
                          {child.title}
                        </span>
                      </div>
                      <div className="flex justify-center items-center">
                        {child.new && (
                          <Badge
                            size={"sm"}
                            className="text-primary-500 font-bold bg-white"
                          >
                            New
                          </Badge>
                        )}
                        {child.children && (
                          <Button
                            className="text-white bg-transparent hover:bg-transparent rounded-full p-0 h-4"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpen(index);
                            }}
                          >
                            {open[index] ? <FaChevronUp /> : <FaChevronDown />}
                          </Button>
                        )}
                      </div>
                    </ListItem>
                  </Link>
                  <div className={ItemChildrenOpen({ active: open[index] })}>
                    {child.children &&
                      child.children.map((child2, index2) => {
                        const itemActive = pathname === child2.path;

                        return (
                          <Link href={child2.path} key={index}>
                            <ListItem
                              key={index2}
                              className={ItemListVariant({
                                active: itemActive,
                                visible: open[index],
                              })}
                            >
                              <div className="flex flex-row items-center justify-start">
                                <span className="text-[24px]">
                                  {child2.icon}
                                </span>
                                <span className="ml-2 text-[14px]">
                                  {child2.title}
                                </span>
                              </div>
                              {child2.new && (
                                <Badge
                                  size={"sm"}
                                  className="text-primary-500 font-bold bg-white"
                                >
                                  New
                                </Badge>
                              )}
                            </ListItem>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ul>
    </div>
  );
}
