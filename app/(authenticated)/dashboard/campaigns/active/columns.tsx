"use client"

import { ColumnDef } from "@tanstack/react-table"

export type CampaignColumn = {
    id: string
    name: string
    targetAudience: string | null
    reachCount: number
    engagementRate: number
    startDate: string
}

export const columns: ColumnDef<CampaignColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "targetAudience",
        header: "Target Audience",
    },
    {
        accessorKey: "reachCount",
        header: "Reach",
        cell: ({ row }) => {
            const value = row.getValue("reachCount") as number
            return <div className="font-medium">{value.toLocaleString()}</div>
        },
    },
    {
        accessorKey: "engagementRate",
        header: "Engagement",
        cell: ({ row }) => {
            const value = row.getValue("engagementRate") as number
            return <div className="font-medium">{value}%</div>
        },
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
    },
    {
        id: "actions",
        header: "Actions",
    },
]

