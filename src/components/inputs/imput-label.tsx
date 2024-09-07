import { Children } from "react"
import { Input } from "../ui/input"
import { Text } from "@tremor/react"

type InputLabelProps = {
  label: string
  description?: string
  children?: React.ReactNode
  value?: string | number
  className?: string
}
export function InputLabel({
  label,
  description,
  children,
  value,
  className
}: InputLabelProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className='flex flex-row justify-between gap-2'>
        <label className='font-bold text-neutrals-500' >{label}</label>
        {value && <Text>{value}</Text>}
      </div>
      {children}
      <Text>{description}</Text>
    </div>
  );
}