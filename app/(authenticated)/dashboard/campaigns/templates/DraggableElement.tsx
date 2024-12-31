import { useRef } from "react";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DraggableElementProps {
    type: string;
    icon: LucideIcon;
    label: string;
}

export function DraggableElement({
    type,
    icon: Icon,
    label,
}: DraggableElementProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
        type: "EMAIL_ELEMENT",
        item: { type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(ref);

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center gap-2 p-3 rounded-md border cursor-move transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isDragging && "opacity-50",
            )}
        >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}
