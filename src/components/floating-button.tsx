"use client"
import { Button } from "@/components/ui/button";
import { PiChatCircleText } from "react-icons/pi";

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { HiDotsVertical } from "react-icons/hi";
import { GrClose } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { PiPaperclip } from "react-icons/pi";
import { MdOutlineInsertEmoticon } from "react-icons/md";

import { Textarea } from "./ui/textarea";
import axios from "axios";
import { AIConfig } from "@/lib/ai/chat";

const FloatDiv = cva(
  "bg-[#f4f4f4] rounded-[32px] fixed md:bottom-16 bottom-4 md:right-16 right-4 shadow  max-w-[calc(100vw-32px)] max-h-[calc(100vh-16px)] transition-all duration-300 ease-in-out z-50 ",
  {
    variants: {
      open: {
        true: "h-[700px] w-[400px]",
        false: "h-16 w-16 bg-transparent ",
      }
    },
    defaultVariants: {
      open: false,
    },
  }
)

const ButtonFloat = cva(
  "bg-primary-500 hover:bg-white hover:text-primary-500 px-3 py-3 rounded-full h-16 w-16",
  {
    variants: {
      open: {
        true: "hidden",
        false: "flex",
      }
    },
    defaultVariants: {
      open: false,
    },
  }
)

const Chat = cva(
  "flex-col h-full w-full transition-all duration-300 ease-in-out justify-between shadow-lg bg-white rounded-[32px] bg-[#f4f4f4]",
  {
    variants: {
      open: {
        true: "flex",
        false: "hidden",
      }
    },
    defaultVariants: {
      open: false,
    },
  }
)

const MessageMain = cva(
  "flex flex-row relative w-full",
  {
    variants: {
      type: {
        assistant: "justify-start",
        user: "justify-end",
      }
    },
    defaultVariants: {
      type: "user",
    },
  })

const MessageBg = cva(
  "rounded-[16px] py-[6px] px-[10px] w-[fit-content] shadow-sm max-w-[90%] flex gap-2",
  {
    variants: {
      type: {
        assistant: "bg-primary-100",
        user: "bg-white",
      }
    },
    defaultVariants: {
      type: "user",
    },
  })

type Props = {
  iaConfig: AIConfig | null
}

type Messages = {
  date: string;
  body: string;
  type: string;
}[]

const formatMessage = (message: string) => {

  if (!message) return ""

  // formata de .md para html
  message = message.replace(/(?:\r\n|\r|\n)/g, '<br>')
  message = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  message = message.replace(/\*(.*?)\*/g, '<i>$1</i>')
  message = message.replace(/__(.*?)__/g, '<u>$1</u>')
  message = message.replace(/~~(.*?)~~/g, '<s>$1</s>')
  message = message.replace(/`(.*?)`/g, '<code>$1</code>')
  message = message.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
  message = message.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
  message = message.replace(/(?:\r\n|\r|\n)/g, '<br>')

  return message
}

export default function FloatingButton({ iaConfig }: Props) {

  const input = useRef<HTMLTextAreaElement>(null)

  const messagens = useRef<HTMLDivElement>(null)

  const [error, setError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Messages>([])

  const [message, setMessage] = useState('')

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && input.current) {
      input.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (messagens.current) {
      messagens.current.scrollTop = messagens.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (messages: Messages, ai_config: AIConfig | null) => {

    if (!ai_config) {
      return
    }

    setLoading(true)
    axios.post('/api/webhook/help', {
      messages,
      ai_config
    }).then((response) => {
      if (response.data.error) {
        setLoading(false)
        setError(response.data.error)
        return
      }
      console.log(response.data.message);
      setMessages([...messages, {
        body: response.data.message,
        date: new Date().toLocaleTimeString().slice(0, -3),
        type: "assistant"
      }])
      setLoading(false)
    }).catch((error) => {
      console.error(error)
    })
    setLoading(false)
  }

  return (
    <div className={cn(FloatDiv({ open: open }))}>
      <Button className={cn(ButtonFloat({ open: open }))}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <PiChatCircleText size={35} />
      </Button>
      <div className={cn(Chat({ open: open }))}>
        {/* header */}
        <div
          // background image public/bacgroundChatHeader.png 
          style={{
            backgroundImage: "url(/bacgroundChatHeader.png)",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="flex justify-between w-full px-5 py-4 gap-2 rounded-t-[32px] absolute z-20">
          <div>
            <div className="flex flex-row gap-3">
              {/* image public/iconMiniGradient.pmg */}
              <Image src="/iconMiniGradient.png" width={76} height={76} alt="Logo mini AIPex" />
              {/* decription */}
              <div className="flex-col justify-between hidden min-[320px]:flex">
                <div className="text-white text-xl font-bold ">{iaConfig?.name}</div>
                <div className="text-primary-100 text-xs min-[43
                  2px]:text-base">Atendente com inteligencia artificial</div>
              </div>
            </div>
          </div>
          {/* menu */}
          <div className="flex flex-row ">
            {/* opitions */}
            <Button variant="ghost" size="icon" className=" text-white rounded-full hover:text-primary-500">
              <HiDotsVertical size={25} />
            </Button>
            {/* close */}
            <Button variant="ghost" size="icon" className=" text-white rounded-full hover:text-primary-500"
              onClick={() => setOpen(!open)}
            >
              <GrClose size={25} />
            </Button>
          </div>
        </div>
        {/* message  */}
        <div ref={messagens} className="w-full h-full pt-8 gap-4 px-4 flex flex-col overflow-y-scroll no-scrollbar pb-6 rounded-[32px] z-10 mt-20">
          {/* messagem ia */}
          {messages.map((msg, index) => (
            <div key={index} className={cn(MessageMain({ type: msg.type as "assistant" | "user" }))}>
              <div className={cn(MessageBg({ type: msg.type as "assistant" | "user" }))}>
                <div
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.body) }}
                  className="text-neutral-900 break-words max-w-[90%] text-sm"
                />
                {/* data */}
                <div className="flex items-end">
                  <p className="text-[11px] text-neutral-700">{msg.date}</p>
                </div>
              </div>
            </div>
          ))}
          {loading &&
            <div className={cn(MessageBg({ type: "assistant" as "assistant" | "user" }))}>
              <div className={cn(MessageMain({ type: "assistant" as "assistant" | "user" }))}>
                <p className=" animate-pulse">{" ... "}</p>
              </div>
            </div>}
        </div>
        {/* input */}
        <div>
          {/* divider */}
          <div className="flex justify-center items-center w-full">
            {/* 2px de altura */}
            <hr className="w-11/12 h-[2px] bg-neutral-200" />
          </div>
          <div className="flex flex-col relative h-[150px] w-full rounded-b-[32px] py-4 px-6">
            {/* input */}
            <div className="flex flex-col justify-between">
              <div>
                <Textarea placeholder="Digite sua mensagem" className="w-full h-20 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 no-scrollbar bg-transparent"
                  ref={input}
                  value={message}
                  onChange={(e) => {
                    // remove a quebra de linha na primeira posição
                    if (e.target.value[0] === "\n") {
                      e.target.value = e.target.value.slice(1)
                    }
                    setMessage(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    // quando apertar ctrl + enter
                    if (e.key === "Enter" && e.ctrlKey && message !== "") {
                      setMessage(message + "\n")
                    }
                    if (e.key === "Enter") {
                      console.log("message: ", message);
                      if (message === "") {
                        return
                      }
                      setMessages([...messages, {
                        body: message,
                        date: new Date().toLocaleTimeString().slice(0, -3),
                        type: "user"
                      }])
                      sendMessage([...messages, {
                        body: message,
                        date: new Date().toLocaleTimeString().slice(0, -3),
                        type: "user"
                      }], iaConfig)
                      setMessage('')
                    }
                  }}
                />
              </div>
              {/* Icons */}
              <div className="text-muted-foreground gap-3 flex flex-row">
                {/* clipboard */}
                <Button variant="ghost" size="icon" className="rounded-full">
                  <PiPaperclip size={25} />
                </Button>
                {/* Icon */}
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MdOutlineInsertEmoticon size={25} />
                </Button>
              </div>
            </div>
            {/* send fixed 50% right */}
            <div>
              <Button size="icon" className="absolute bg-primary-500 hover:bg-white hover:text-primary-500 px-3 py-3 rounded-full h-16 w-16 right-[-35px] bottom-10 shadow"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (message === "") {
                    return
                  }
                  setMessages([...messages, {
                    body: message,
                    date: new Date().toLocaleTimeString().slice(0, -3),
                    type: "user"
                  }])
                  sendMessage([...messages, {
                    body: message,
                    date: new Date().toLocaleTimeString().slice(0, -3),
                    type: "user"
                  }], iaConfig)
                  setMessage('')
                }}
              >
                <IoSend size={30} />
              </Button>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}