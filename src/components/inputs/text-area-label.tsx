import { Text } from "@tremor/react"
import { Textarea } from "../ui/textarea"

type TextAreaLabelProps = {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  description?: string
}
export function TextAreaLabel({
  label,
  value,
  onChange,
  placeholder,
  description
}: TextAreaLabelProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='font-bold' >{label}</label>
      <Textarea className='h-[200px]' value={value} placeholder={placeholder} onChange={(e) => onChange(e)} />
      <Text>{description}</Text>
    </div>
  );
}