"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type CustomerList = {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    totalSpent: number;
    lastOrder: string;
    riskScore: number;
};
const getRiskBadge = (riskScore: number) => {
    if (riskScore > 70) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                High Risk
            </span>
        );
    }
    if (riskScore > 30) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Medium Risk
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low Risk
        </span>
    );
};

export const columns: ColumnDef<CustomerList>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
           const name = row.getValue("firstName") + " " + row.getValue("lastName");
            return (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{row.getValue("email")}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "riskScore",
        header: "Risk Level",
        cell: ({ row }) => {
            const role = row.getValue("riskScore");
            return <span> {getRiskBadge(role)}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const data = row.original;
            const { data: sessionData } = authClient.useSession();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    disabled={sessionData?.user?.id === data.id}
                                >
                                    Change Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Member</DropdownMenuItem>
                                        <DropdownMenuItem>Admin</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={sessionData?.user?.id === data.id}
                        >
                            Remove Member
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
