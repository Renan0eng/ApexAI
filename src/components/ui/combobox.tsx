"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PropTypes = {
  options: {
    value: string;
    label: string;
  }[];
  onSelect: (val: string) => void;
  placeholder?: string;
  value?: string;
};

export function Combobox({ options, onSelect, placeholder, value }: PropTypes) {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState(value || "");

  React.useEffect(() => {
    setVal(value || "");
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {val
            ? options.find((opition) => opition.value === val)?.label
            : placeholder || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder || "Select..."} />
          <CommandEmpty>Não encontrado.</CommandEmpty>
          <CommandGroup>
            {options.map((opition) => (
              <CommandItem
                key={opition.value}
                value={opition.value}
                onSelect={(currentVal) => {
                  onSelect(currentVal);
                  setVal(currentVal === val ? "" : currentVal);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    val === opition.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {opition.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
