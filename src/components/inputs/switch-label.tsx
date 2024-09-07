import React from "react";
import { Switch } from "../ui/switch";
import { Text } from "@tremor/react";

type SwitchLabelProps = {
  label?: string
  value: boolean
  onChange: (event: boolean) => void
  description?: string
}

export default function SwitchLabel({
  label,
  value,
  onChange,
  description
}: SwitchLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Switch
          onCheckedChange={(e) => onChange(e)}
          checked={value}
        />
        <label className='font-bold text-neutrals-500' >{label}</label>
      </div>
      <Text>{description}</Text>
    </div>
  );
}