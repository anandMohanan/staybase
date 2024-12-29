"use client";

import React, { useState, useCallback } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Variable, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const availableVariables = [
	{ label: "Customer Name", value: "{{customer_name}}" },
	{ label: "Email Body", value: "{{email_body}}" },
	{ label: "Product Recommendations", value: "{{product_recommendations}}" },
	{ label: "Last Order Date", value: "{{last_order_date}}" },
	{ label: "Total Orders", value: "{{total_orders}}" },
	{ label: "Total Spent", value: "{{total_spent}}" },
	{ label: "Company Name", value: "{{company_name}}" },
	{ label: "Special Offer", value: "{{special_offer}}" },
	{ label: "Customer Segment", value: "{{customer_segment}}" },
];

const EmailTemplateBuilder = () => {
	const [template, setTemplate] = useState({
		name: "",
		subject: "Special offer for {{customer_name}}",
		content: `Dear {{customer_name}},

{{email_body}}

Based on your previous orders, we think you might like:
{{product_recommendations}}

As a valued {{customer_segment}} customer who has placed {{total_orders}} orders and spent {{total_spent}}, we're pleased to offer you:
{{special_offer}}

Thank you for your continued support since your first order on {{last_order_date}}.

Best regards,
{{company_name}}`,
		selectedVariable: "",
	});

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setTemplate((prev) => ({ ...prev, [name]: value }));
		},
		[],
	);

	const handleVariableChange = useCallback((value: string) => {
		setTemplate((prev) => ({ ...prev, selectedVariable: value }));
	}, []);

	const insertVariable = useCallback(() => {
		if (!template.selectedVariable) return;

		setTemplate((prev) => ({
			...prev,
			content: prev.content + prev.selectedVariable,
			selectedVariable: "",
		}));
	}, [template.selectedVariable]);

	const handleSave = useCallback(() => {
		// Save template logic here
		console.log("Saving template:", template);
	}, [template]);

	const renderPreview = useCallback((content: string) => {
		return content.replace(/{{(.*?)}}/g, (match, variable) => {
			return `[AI-generated ${variable}]`;
		});
	}, []);

	return (
		<Card className="w-full max-w-4xl">
			<CardHeader>
				<CardTitle>AI-Powered Email Template Builder</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						This template uses AI-generated content. Variables like{" "}
						{"{{ customer_name }}"} will be replaced with personalized content
						for each recipient.
					</AlertDescription>
				</Alert>

				<div className="space-y-2">
					<Label htmlFor="templateName">Template Name</Label>
					<Input
						id="templateName"
						name="name"
						value={template.name}
						onChange={handleInputChange}
						placeholder="Enter template name"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="subject">Subject Line</Label>
					<Input
						id="subject"
						name="subject"
						value={template.subject}
						onChange={handleInputChange}
						placeholder="Enter email subject"
					/>
				</div>

				<div className="flex space-x-2">
					<Select
						value={template.selectedVariable}
						onValueChange={handleVariableChange}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Insert variable..." />
						</SelectTrigger>
						<SelectContent>
							{availableVariables.map((variable) => (
								<SelectItem key={variable.value} value={variable.value}>
									{variable.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						onClick={insertVariable}
						disabled={!template.selectedVariable}
					>
						<Variable className="w-4 h-4 mr-2" />
						Insert
					</Button>
				</div>

				<div className="space-y-2">
					<Label htmlFor="emailContent">Email Content</Label>
					<Textarea
						id="emailContent"
						name="content"
						value={template.content}
						onChange={handleInputChange}
						className="min-h-[300px]"
						placeholder="Write your email content here..."
					/>
				</div>

				<div className="space-y-2">
					<Label>Preview (with AI-generated placeholders)</Label>
					<div className="border rounded-md p-4 whitespace-pre-wrap min-h-[300px] bg-gray-50 text-black">
						{renderPreview(template.content)}
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
					<Save className="w-4 h-4 mr-2" />
					Save Template
				</Button>
			</CardFooter>
		</Card>
	);
};

export default EmailTemplateBuilder;
