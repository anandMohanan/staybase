"use client"

import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, AlertCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalSpent: number;
    lastOrderDate: string;
    orderCount: number;
    riskScore: number;
}

export const DataTable = ({customers}: {customers: Customer[]}) => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, high-risk, active


    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'high-risk') {
            return matchesSearch && customer.riskScore > 70;
        }
        if (filter === 'active') {
            // Active in last 30 days
            const lastOrder = new Date(customer.lastOrderDate);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return matchesSearch && lastOrder > thirtyDaysAgo;
        }
        return matchesSearch;
    });

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

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Button>Import Customers</Button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilter('all')}>
                            All Customers
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter('high-risk')}>
                            High Risk
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilter('active')}>
                            Active
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead>Risk Level</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {customer.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.orderCount}</TableCell>
                                    <TableCell>
                                        ${customer.totalSpent.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {getRiskBadge(customer.riskScore)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Create Campaign</DropdownMenuItem>
                                                <DropdownMenuItem>Export Data</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
