import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EmailElement } from "@/lib/types/email";

interface StyleEditorProps {
	element: EmailElement;
	i;
	onStyleChange: (property: string, value: string) => void;
	onContentChange?: (content: string) => void;
	tab: "styles" | "content" | "spacing";
}

export function StyleEditor({
	element,
	onStyleChange,
	onContentChange,
	tab,
}: StyleEditorProps) {
	if (tab === "content") {
		return (
			<div className="space-y-4 p-4">
				{element.type === "image" ? (
					<div className="space-y-2">
						<Label>Image URL</Label>
						<Input
							type="url"
							value={element.content}
							onChange={(e) => onContentChange?.(e.target.value)}
							placeholder="https://example.com/image.jpg"
						/>
					</div>
				) : (
					<div className="space-y-2">
						<Label>Text Content</Label>
						<Input
							type="text"
							value={element.content}
							onChange={(e) => onContentChange?.(e.target.value)}
							placeholder="Enter content..."
						/>
					</div>
				)}
			</div>
		);
	}

	if (tab === "spacing") {
		return (
			<div className="space-y-4 p-4">
				<div className="space-y-2">
					<Label>Padding</Label>
					<div className="grid grid-cols-2 gap-2">
						<Input
							placeholder="Top"
							value={element.styles.paddingTop}
							onChange={(e) => onStyleChange("paddingTop", e.target.value)}
						/>
						<Input
							placeholder="Right"
							value={element.styles.paddingRight}
							onChange={(e) => onStyleChange("paddingRight", e.target.value)}
						/>
						<Input
							placeholder="Bottom"
							value={element.styles.paddingBottom}
							onChange={(e) => onStyleChange("paddingBottom", e.target.value)}
						/>
						<Input
							placeholder="Left"
							value={element.styles.paddingLeft}
							onChange={(e) => onStyleChange("paddingLeft", e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Margin</Label>
					<div className="grid grid-cols-2 gap-2">
						<Input
							placeholder="Top"
							value={element.styles.marginTop}
							onChange={(e) => onStyleChange("marginTop", e.target.value)}
						/>
						<Input
							placeholder="Right"
							value={element.styles.marginRight}
							onChange={(e) => onStyleChange("marginRight", e.target.value)}
						/>
						<Input
							placeholder="Bottom"
							value={element.styles.marginBottom}
							onChange={(e) => onStyleChange("marginBottom", e.target.value)}
						/>
						<Input
							placeholder="Left"
							value={element.styles.marginLeft}
							onChange={(e) => onStyleChange("marginLeft", e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Border</Label>
					<div className="grid grid-cols-2 gap-2">
						<Input
							placeholder="Width"
							value={element.styles.borderWidth}
							onChange={(e) => onStyleChange("borderWidth", e.target.value)}
						/>
						<Input
							type="color"
							value={element.styles.borderColor || "#000000"}
							onChange={(e) => onStyleChange("borderColor", e.target.value)}
						/>
						<Select
							value={element.styles.borderStyle as string}
							onValueChange={(value) => onStyleChange("borderStyle", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Style" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="solid">Solid</SelectItem>
								<SelectItem value="dashed">Dashed</SelectItem>
								<SelectItem value="dotted">Dotted</SelectItem>
							</SelectContent>
						</Select>
						<Input
							placeholder="Radius"
							value={element.styles.borderRadius}
							onChange={(e) => onStyleChange("borderRadius", e.target.value)}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label>Font Size</Label>
				<Slider
					min={8}
					max={72}
					step={1}
					value={[Number.parseInt((element.styles.fontSize as string) || "16")]}
					onValueChange={(value: any[]) => onStyleChange("fontSize", `${value[0]}px`)}
				/>
			</div>

			<div className="space-y-2">
				<Label>Color</Label>
				<Input
					type="color"
					value={element.styles.color || "#000000"}
					onChange={(e) => onStyleChange("color", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label>Background Color</Label>
				<Input
					type="color"
					value={element.styles.backgroundColor || "#ffffff"}
					onChange={(e) => onStyleChange("backgroundColor", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label>Font Weight</Label>
				<Select
					value={element.styles.fontWeight as string}
					onValueChange={(value) => onStyleChange("fontWeight", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select weight" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="normal">Normal</SelectItem>
						<SelectItem value="bold">Bold</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>Text Align</Label>
				<Select
					value={element.styles.textAlign as string}
					onValueChange={(value) => onStyleChange("textAlign", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select alignment" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="left">Left</SelectItem>
						<SelectItem value="center">Center</SelectItem>
						<SelectItem value="right">Right</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{element.type === "button" && (
				<div className="space-y-2">
					<Label>Button Variant</Label>
					<Select
						value={element.styles.variant as string}
						onValueChange={(value) => {
							const variants = {
								primary: {
									backgroundColor: "#2563eb",
									color: "#ffffff",
									border: "none",
								},
								secondary: {
									backgroundColor: "#6b7280",
									color: "#ffffff",
									border: "none",
								},
								outline: {
									backgroundColor: "transparent",
									color: "#2563eb",
									border: "1px solid #2563eb",
								},
							};
							const variant = variants[value as keyof typeof variants];
							Object.entries(variant).forEach(([key, val]) => {
								onStyleChange(key, val);
							});
							onStyleChange("variant", value);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select variant" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="primary">Primary</SelectItem>
							<SelectItem value="secondary">Secondary</SelectItem>
							<SelectItem value="outline">Outline</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	);
}
