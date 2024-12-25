"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    AlertOctagon,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    DollarSign,
    TrendingDown,
    Plus,
    Download,
} from "lucide-react";

interface DashboardData {
    metrics: {
        highRiskCount: number;
        mediumRiskCount: number;
        totalCustomers: number;
        atRiskRevenue: number;
        avgRiskScore: number;
        retentionRate: number;
    };
    trends: Array<{
        date: string;
        riskScore: number;
        retention: number;
        revenue: number;
    }>;
    urgentActions: Array<{
        id: string;
        customer: string;
        riskScore: number;
        revenue: number;
        status: string;
    }>;
    recentCampaigns: Array<{
        id: string;
        name: string;
        status: string;
        impact: number;
        date: string;
    }>;
}

// Sample data
const dashboardData: DashboardData = {
    metrics: {
        highRiskCount: 24,
        mediumRiskCount: 45,
        totalCustomers: 342,
        atRiskRevenue: 128000,
        avgRiskScore: 42,
        retentionRate: 86
    },
    trends: [
        { date: 'Jan', riskScore: 45, retention: 82, revenue: 95000 },
        { date: 'Feb', riskScore: 42, retention: 84, revenue: 98000 },
        { date: 'Mar', riskScore: 38, retention: 86, revenue: 102000 },
        { date: 'Apr', riskScore: 35, retention: 88, revenue: 108000 },
    ],
    urgentActions: [
        { id: '1', customer: 'Acme Corp', riskScore: 85, revenue: 12000, status: 'urgent' },
        { id: '2', customer: 'TechStart Inc', riskScore: 78, revenue: 8500, status: 'high' },
        { id: '3', customer: 'Global Services', riskScore: 72, revenue: 15000, status: 'medium' },
    ],
    recentCampaigns: [
        { id: '1', name: 'Spring Retention', status: 'active', impact: 12, date: '2024-03-15' },
        { id: '2', name: 'Win-back Program', status: 'completed', impact: 8, date: '2024-03-10' },
        { id: '3', name: 'Loyalty Boost', status: 'scheduled', impact: 0, date: '2024-03-20' },
    ],
};


export const HomeClientComponent = () => {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="flex gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Button className="flex gap-2">
                        <Plus className="h-4 w-4" /> New Campaign
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Risk Customers</CardTitle>
                        <AlertOctagon className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.metrics.highRiskCount}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-red-500 inline-flex items-center">
                                <ArrowUpRight className="h-4 w-4 mr-1" />+5
                            </span>{' '}
                            vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${dashboardData.metrics.atRiskRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-red-500 inline-flex items-center">
                                <ArrowUpRight className="h-4 w-4 mr-1" />+12%
                            </span>{' '}
                            from previous
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.metrics.avgRiskScore}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500 inline-flex items-center">
                                <ArrowDownRight className="h-4 w-4 mr-1" />-3
                            </span>{' '}
                            vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.metrics.retentionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500 inline-flex items-center">
                                <ArrowUpRight className="h-4 w-4 mr-1" />+2%
                            </span>{' '}
                            vs target
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Trends Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Risk & Retention Trends</CardTitle>
                        <CardDescription>Track how risk scores and retention rates change over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dashboardData.trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="riskScore"
                                        stroke="#ef4444"
                                        name="Risk Score"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="retention"
                                        stroke="#22c55e"
                                        name="Retention %"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Urgent Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Urgent Actions</CardTitle>
                        <CardDescription>Customers requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Risk Score</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardData.urgentActions.map((action) => (
                                    <TableRow key={action.id}>
                                        <TableCell className="font-medium">{action.customer}</TableCell>
                                        <TableCell>{action.riskScore}</TableCell>
                                        <TableCell>${action.revenue.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                action.status === 'urgent' ? 'destructive' :
                                                    action.status === 'high' ? 'default' :
                                                        'secondary'
                                            }>
                                                {action.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Campaigns */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Campaigns</CardTitle>
                        <CardDescription>Performance of your latest retention campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Impact</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardData.recentCampaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">{campaign.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                campaign.status === 'active' ? 'default' :
                                                    campaign.status === 'completed' ? 'secondary' :
                                                        'outline'
                                            }>
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={campaign.impact > 0 ? 'text-green-500' : ''}>
                                            {campaign.impact > 0 ? `+${campaign.impact}%` : '-'}
                                        </TableCell>
                                        <TableCell>{new Date(campaign.date).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
