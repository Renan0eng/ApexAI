import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {

    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            error && "border-red-500"
          )}
          ref={ref}
          {...props}
        />
        {!showPassword ? <Eye className='absolute text-muted-foreground top-2 right-3' onClick={() => { setShowPassword(!showPassword) }} /> : <EyeOff className='absolute text-muted-foreground top-2 right-3' onClick={() => { setShowPassword(!showPassword) }} />}
      </div>
    );
  }
);
InputPassword.displayName = "Input";

export { InputPassword };
