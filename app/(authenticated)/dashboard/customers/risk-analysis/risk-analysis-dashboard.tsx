"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertOctagon, TrendingDown, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { MetricCard } from "@/components/metric-card";

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

const getRiskBadgeVariant = (riskScore: number) => {
    if (riskScore >= 75) return "destructive";
    if (riskScore >= 50) return "warning";
    return "success";
};

const CustomerTable = ({
    customers,
    title,
}: { customers: CustomerRisk[]; title: string }) => (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
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
                    {customers.map((customer) => (
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
                                <Badge variant={getRiskBadgeVariant(customer.riskScore)}>
                                    {customer.riskScore}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {customer.lastOrderDate
                                    ? new Date(customer.lastOrderDate).toLocaleDateString()
                                    : "No orders"}
                            </TableCell>
                            <TableCell>${customer.totalSpent.toLocaleString()}</TableCell>
                            <TableCell>{customer.orderCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default function RiskAnalytics({ customers }: RiskAnalyticsProps) {
    const riskSegments = customers.reduce(
        (acc, customer) => {
            if (customer.riskScore >= 75) acc.highRisk++;
            else if (customer.riskScore >= 50) acc.mediumRisk++;
            else acc.lowRisk++;
            return acc;
        },
        { highRisk: 0, mediumRisk: 0, lowRisk: 0 },
    );

    const atRiskRevenue = customers
        .filter((c) => c.riskScore >= 75)
        .reduce((sum, customer) => sum + customer.totalSpent, 0);

    const highRiskCustomers = customers
        .filter((c) => c.riskScore >= 75)
        .sort((a, b) => b.riskScore - a.riskScore);

    const mediumRiskCustomers = customers
        .filter((c) => c.riskScore >= 50 && c.riskScore < 75)
        .sort((a, b) => b.riskScore - a.riskScore);

    const lowRiskCustomers = customers
        .filter((c) => c.riskScore < 50)
        .sort((a, b) => b.riskScore - a.riskScore);

    const riskDistribution = Array.from({ length: 10 }, (_, i) => ({
        name: `${i * 10}-${(i + 1) * 10}`,
        total: customers.filter(
            (c) => c.riskScore >= i * 10 && c.riskScore < (i + 1) * 10,
        ).length,
    }));

    const pieData = [
        {
            name: "Low Risk",
            value: riskSegments.lowRisk,
            fill: "var(--color-lowRisk)",
        },
        {
            name: "Medium Risk",
            value: riskSegments.mediumRisk,
            fill: "var(--color-mediumRisk)",
        },
        {
            name: "High Risk",
            value: riskSegments.highRisk,
            fill: "var(--color-highRisk)",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Risk Analysis Dashboard
                </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="High Risk Customers"
                    value={riskSegments.highRisk}
                    icon={AlertOctagon}
                    tooltipContent="High Risk Customers are at risk of churning"
                />
                <MetricCard
                    title="At Risk Revenue"
                    value={atRiskRevenue.toLocaleString()}
                    icon={DollarSign}
                    tooltipContent="At Risk Revenue is the total revenue of customers at risk of churning"
                />
                <MetricCard
                    title="Avg Risk Score"
                    value={Math.round(
                        customers.reduce((sum, c) => sum + c.riskScore, 0) /
                        customers.length,
                    )}
                    icon={TrendingDown}
                    tooltipContent="Average Risk Score is the average risk score of all customers"
                />
                <MetricCard
                    title="Total Customers"
                    value={customers.length}
                    icon={Users}
                    tooltipContent="Total Customers is the total number of customers in the system"
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Risk Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                total: {
                                    label: "Total Customers",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="h-[350px]"
                        >
                            <BarChart data={riskDistribution}>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-total)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="hsl(var(--chart-2))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Risk Segments</CardTitle>
                        <CardDescription>
                            Distribution of customer risk levels
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                lowRisk: {
                                    label: "Low Risk",
                                    color: "hsl(var(--chart-3))",
                                },
                                mediumRisk: {
                                    label: "Medium Risk",
                                    color: "hsl(var(--chart-4))",
                                },
                                highRisk: {
                                    label: "High Risk",
                                    color: "hsl(var(--chart-5))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={(entry) => `${entry.name}: ${entry.value}`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                            <ChartLegend content={<ChartLegendContent />} />
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <CustomerTable
                customers={highRiskCustomers}
                title={`High Risk Customers (${riskSegments.highRisk})`}
            />
            <CustomerTable
                customers={mediumRiskCustomers}
                title={`Medium Risk Customers (${riskSegments.mediumRisk})`}
            />
            <CustomerTable
                customers={lowRiskCustomers}
                title={`Low Risk Customers (${riskSegments.lowRisk})`}
            />
        </div>
    );
}
