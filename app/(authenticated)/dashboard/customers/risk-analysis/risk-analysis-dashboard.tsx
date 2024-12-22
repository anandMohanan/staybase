import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertOctagon, TrendingDown, Users, DollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface CustomerRisk {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    riskScore: number;
    totalSpent: number;
    lastOrderDate: string;
    orderCount: number;
}

interface RiskAnalyticsProps {
    customers: CustomerRisk[];
}

export default function RiskAnalytics({ customers }: RiskAnalyticsProps) {
    // Your existing calculations remain the same
    const riskSegments = customers.reduce((acc, customer) => {
        if (customer.riskScore >= 75) acc.highRisk++;
        else if (customer.riskScore >= 50) acc.mediumRisk++;
        else acc.lowRisk++;
        return acc;
    }, { highRisk: 0, mediumRisk: 0, lowRisk: 0 });

    const atRiskRevenue = customers
        .filter(c => c.riskScore >= 75)
        .reduce((sum, customer) => sum + customer.totalSpent, 0);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Risk Analysis Dashboard</h1>

            {/* Risk Overview Cards - Keeping the same */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Your existing cards remain the same */}
                <Card>
                    <CardContent className="flex items-center p-4">
                        <AlertOctagon className="h-8 w-8 text-red-500 mr-3" />
                        <div>
                            <p className="text-sm text-muted-foreground">High Risk Customers</p>
                            <p className="text-2xl font-bold">{riskSegments.highRisk}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-4">
                        <DollarSign className="h-8 w-8 text-yellow-500 mr-3" />
                        <div>
                            <p className="text-sm text-muted-foreground">At Risk Revenue</p>
                            <p className="text-2xl font-bold">${atRiskRevenue.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-4">
                        <TrendingDown className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                            <p className="text-2xl font-bold">
                                {Math.round(customers.reduce((sum, c) => sum + c.riskScore, 0) / customers.length)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-4">
                        <Users className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Customers</p>
                            <p className="text-2xl font-bold">{customers.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* High Risk Customers Table - Using shadcn Table */}
            <Card>
                <CardHeader>
                    <CardTitle>High Risk Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Risk Score</TableHead>
                                <TableHead>Last Order</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Orders</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers
                                .filter(customer => customer.riskScore >= 75)
                                .sort((a, b) => b.riskScore - a.riskScore)
                                .slice(0, 5)
                                .map(customer => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {customer.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="destructive">
                                                {customer.riskScore}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {customer.lastOrderDate 
                                                ? new Date(customer.lastOrderDate).toLocaleDateString()
                                                : 'No orders'}
                                        </TableCell>
                                        <TableCell>
                                            ${customer.totalSpent.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {customer.orderCount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
