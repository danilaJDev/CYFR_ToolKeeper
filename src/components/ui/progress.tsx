import * as React from "react";
import {cn} from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({className, value = 0, max = 100, ...props}, ref) => {
        const clampedValue = Math.min(Math.max(value, 0), max);
        const percentage = max === 0 ? 0 : (clampedValue / max) * 100;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
                    className,
                )}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={clampedValue}
                {...props}
            >
                <div
                    className="h-full w-full flex-1 bg-gradient-to-r from-primary via-primary/90 to-primary/70"
                    style={{transform: `translateX(-${100 - percentage}%)`}}
                />
            </div>
        );
    }
);

Progress.displayName = "Progress";

export {Progress};
