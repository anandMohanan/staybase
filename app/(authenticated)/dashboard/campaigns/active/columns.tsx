"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { CampaignTableActions } from "./table-action";

export type CampaignColumn = {
	id: string;
	name: string;
	targetAudience: string | null;
	reachCount: number;
	engagementRate: number;
	startDate: string;
	type: string;
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
				<Badge
					variant={
						value === "ACTIVE"
							? "default"
							: value === "PAUSED"
								? "destructive"
								: "outline"
					}
				>
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
		accessorKey: "type",
		header: "Campaign Type",
		cell: ({ row }) => {
			const value = row.getValue("type") as string;
            console.log(value)
			return (
				<div
					className={cn(
						"font-medium",
					)}
				>
					{value}
				</div>
			);
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
			const status = row.getValue("status") as string;
			const value = row.original.id;
			return <CampaignTableActions campaignId={value} status={status} />;
		},
	},
];
