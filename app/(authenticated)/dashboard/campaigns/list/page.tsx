import React from 'react';
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { campaigns } from "@/db/schema/user";
import { headers } from "next/headers";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CampaignCreationDialog } from '@/components/campaign/create-campaign';
import { eq } from 'drizzle-orm';

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'scheduled':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-gray-100 text-gray-800';
        case 'paused':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getRiskLevelColor(level) {
    switch (level.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default async function CampaignsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const allCampaigns = await db.select().from(campaigns).where(eq(campaigns.organizationId, session?.session.activeOrganizationId!));

    // Calculate summary metrics
    const totalCampaigns = allCampaigns.length;
    const activeCampaigns = allCampaigns.filter(campaign => campaign.status === 'active').length;
    const totalReach = allCampaigns.reduce((sum, campaign) => sum + campaign.reachCount, 0);

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">
                        View and manage all your campaigns in one place.
                    </p>
                </div>
                <CampaignCreationDialog />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCampaigns}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCampaigns}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Narrow down your campaign list</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                placeholder="Search campaigns..."
                                className="w-full"
                            />
                        </div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="low">Low Risk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Campaigns Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Target Audience</TableHead>
                            <TableHead>Reach</TableHead>
                            <TableHead>Engagement Rate</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allCampaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                                <TableCell className="font-medium">
                                    {campaign.name}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(campaign.status)}>
                                        {campaign.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={getRiskLevelColor(campaign.riskLevel)}>
                                        {campaign.riskLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell>{campaign.targetAudience}</TableCell>
                                <TableCell>{campaign.reachCount.toLocaleString()}</TableCell>
                                <TableCell>{campaign.engagementRate.toFixed(1)}%</TableCell>
                                <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                                            <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                Delete Campaign
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
