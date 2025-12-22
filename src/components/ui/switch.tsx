"use client";

import * as React from "react";
import {cn} from "@/lib/utils";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({className, checked, defaultChecked, disabled, onCheckedChange, ...props}, ref) => {
        const [internal, setInternal] = React.useState(defaultChecked ?? false);
        const isControlled = checked !== undefined;
        const isChecked = isControlled ? checked : internal;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            props.onClick?.(event);
            if (event.defaultPrevented) return;

            const next = !isChecked;
            if (!isControlled) {
                setInternal(next);
            }
            onCheckedChange?.(next);
        };

        return (
            <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                aria-disabled={disabled}
                data-state={isChecked ? "checked" : "unchecked"}
                data-disabled={disabled ? "true" : undefined}
                className={cn(
                    "inline-flex h-6 w-11 items-center rounded-full border border-transparent bg-muted transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    isChecked ? "bg-primary" : "bg-muted",
                    className
                )}
                onClick={handleClick}
                ref={ref}
                disabled={disabled}
                {...props}
            >
                <span
                    className={cn(
                        "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                        isChecked ? "translate-x-[18px]" : "translate-x-[2px]"
                    )}
                />
            </button>
        );
    }
);
Switch.displayName = "Switch";
