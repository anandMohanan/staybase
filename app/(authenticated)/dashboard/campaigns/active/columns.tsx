"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type CampaignColumn = {
	id: string;
	name: string;
	targetAudience: string | null;
	reachCount: number;
	engagementRate: number;
	startDate: string;
};

export const columns: ColumnDef<CampaignColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "targetAudience",
		header: "Target Audience",
		cell: ({ row }) => {
			const value = row.getValue("targetAudience") as string;
			return (
				<div
					className={cn(
						"font-medium",
						value === "HIGH_RISK" && "text-red-500",
						value === "LOW_RISK" && "text-green-500",
						value === "MEDIUM_RISK" && "text-yellow-500",
					)}
				>
					{value}
				</div>
			);
		},
	},
	{
		accessorKey: "reachCount",
		header: "Reach",
		cell: ({ row }) => {
			const value = row.getValue("reachCount") as number;
			return <div className="font-medium">{value.toLocaleString()}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const value = row.getValue("status") as string;
			return (
				<Badge variant={value === "ACTIVE" ? "default" : "destructive"}>
					{value}
				</Badge>
			);
		},
	},
	{
		accessorKey: "engagementRate",
		header: "Engagement",
		cell: ({ row }) => {
			const value = row.getValue("engagementRate") as number;
			return <div className="font-medium">{value}%</div>;
		},
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const value = row.getValue("startDate") as string;
			const date = new Date(value);
			return <div className="font-medium">{date.toLocaleDateString()}</div>;
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const value = "sdfdfd";
			return (
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => console.log("Edit", value)}
					>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => console.log("Delete", value)}
					>
						Delete
					</Button>
				</div>
			);
		},
	},
];
