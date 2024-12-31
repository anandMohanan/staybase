import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import type { EmailElement } from "@/lib/types/email";

interface DroppableAreaProps {
	elements: EmailElement[];
	onDrop: (item: { type: string }) => void;
	onElementSelect: (index: number) => void;
	selectedIndex: number | null;
}

export function DroppableArea({
	elements,
	onDrop,
	onElementSelect,
	selectedIndex,
}: DroppableAreaProps) {
	const [{ isOver }, drop] = useDrop({
		accept: "EMAIL_ELEMENT",
		drop: onDrop,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	});

	return (
		<div
			ref={drop}
			className={cn(
				"w-full min-h-[600px] rounded-lg border-2 border-dashed p-4",
				"transition-colors",
				isOver ? "border-primary bg-primary/5" : "border-border",
				"overflow-y-auto space-y-4",
			)}
		>
			{elements.length === 0 && (
				<div className="h-full flex items-center justify-center text-muted-foreground">
					Drag and drop elements here
				</div>
			)}
			{elements.map((element, index) => (
				<div
					key={index}
					onClick={() => onElementSelect(index)}
					className={cn(
						"p-4 rounded-md border cursor-pointer transition-all",
						selectedIndex === index && "ring-2 ring-primary",
					)}
					style={element.styles}
				>
					{element.content}
				</div>
			))}
		</div>
	);
}
