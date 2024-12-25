"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Mail, UserCheck, DollarSign, Target } from "lucide-react";
import { MetricCard } from '@/components/metric-card';

interface CampaignMetrics {
    name: string;
    revenue: number;
    responses: number;
    engagement: number;
    retention: number;
}

interface CampaignData {
    id: string;
    name: string;
    status: 'active' | 'completed' | 'scheduled';
    targetSegment: string;
    sentCount: number;
    responseRate: number;
    revenue: number;
    riskScoreChange: number;
}

const performanceData = [
    { month: 'Jan', revenue: 4000, engagement: 65, retention: 75 },
    { month: 'Feb', revenue: 4500, engagement: 68, retention: 78 },
    { month: 'Mar', revenue: 5100, engagement: 72, retention: 82 },
    { month: 'Apr', revenue: 4800, engagement: 70, retention: 80 },
];

const campaignList: CampaignData[] = [
    {
        id: '1',
        name: 'Re-engagement Campaign',
        status: 'active',
        targetSegment: 'High Risk',
        sentCount: 1200,
        responseRate: 35,
        revenue: 24000,
        riskScoreChange: -12
    },
    {
        id: '2',
        name: 'Loyalty Program',
        status: 'completed',
        targetSegment: 'Medium Risk',
        sentCount: 800,
        responseRate: 42,
        revenue: 18000,
        riskScoreChange: -8
    },
    {
        id: '3',
        name: 'Win-back Campaign',
        status: 'scheduled',
        targetSegment: 'Churned',
        sentCount: 500,
        responseRate: 28,
        revenue: 12000,
        riskScoreChange: -5
    },
];

const CampaignPerformance = () => {
    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Campaign Performance</h2>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                    title="Total Campaigns"
                    value="12"
                    icon={Target}
                    tooltipContent="Total Campaigns is the total number of campaigns in the system"
                />
                <MetricCard
                    title="Messages Sent"
                    value="2,500"
                    icon={Mail}
                    tooltipContent="Messages Sent is the total number of messages sent by the campaigns in the system"
                />
                <MetricCard
                    title="Revenue Impact"
                    value="$54,000"
                    icon={DollarSign}
                    tooltipContent="Revenue Impact is the total revenue impact of the campaigns in the system"
                />
                <MetricCard
                    title="Retained Customers"
                    value="85%"
                    icon={UserCheck}
                    tooltipContent="Retained Customers is the percentage of customers who have been retained by the campaigns in the system"
                />
            </div>

            {/* Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
                                <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement (%)" />
                                <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#ffc658" name="Retention (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Campaign List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Target Segment</TableHead>
                                <TableHead>Sent</TableHead>
                                <TableHead>Response Rate</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Risk Score Impact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaignList.map((campaign) => (
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
                                    <TableCell>{campaign.targetSegment}</TableCell>
                                    <TableCell>{campaign.sentCount.toLocaleString()}</TableCell>
                                    <TableCell>{campaign.responseRate}%</TableCell>
                                    <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                                    <TableCell className="text-green-500">{campaign.riskScoreChange}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CampaignPerformance;
