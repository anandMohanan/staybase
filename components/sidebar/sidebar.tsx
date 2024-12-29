'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    BookUserIcon,
    Building2,
    FileChartLineIcon,
    Frame,
    Home,
    MapIcon,
    PieChart,
    TentIcon,
    ToyBrickIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { authClient } from "@/lib/auth-client"
import { NavUser } from './nav-user';
import { NavProjects } from './nav-projects';
import { NavMain } from './nav-main';
import { TeamSwitcher } from './team-switcher';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type GlobalSidebarProperties = {
    readonly children: ReactNode;
};

const data = {
    navMain: [
        {
            title: "Campaigns",
            url: "/dashboard/campaigns",
            icon: TentIcon,
            items: [
                {
                    title: "Campaigns List",
                    url: "/dashboard/campaigns/active",
                },
                {
                    title: "Performance",
                    url: "/dashboard/campaigns/performance",
                }
            ],
        },
        {
            title: "Customers",
            url: "/dashboard/customers",
            icon: BookUserIcon,
            items: [
                {
                    title: "Customers List",
                    url: "/dashboard/customers/list",
                },
                {
                    title: "Risk Analysis",
                    url: "/dashboard/customers/risk-analysis",
                }
            ],
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: FileChartLineIcon,
            items: [
                {
                    title: "Customer Insights", // Combines behavior & retention
                    url: "/dashboard/analytics/customer-insights",
                },
                {
                    title: "ROI Analysis",
                    url: "/dashboard/analytics/roi-analysis",
                }
            ],
        }
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: MapIcon
        },
    ],
}

export const GlobalSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { data: organizations } = authClient.useListOrganizations()
    const { data: sessionData, error } = authClient.useSession()
    console.log(sessionData)
    if (error) {
        console.error(error)
    }
    console.log(organizations, "organizations")
    const isDisabled = organizations?.length === 0 || !organizations


    const sidebar = useSidebar();
    const pathname = usePathname()

    return (
        <>
            <Sidebar collapsible="icon" {...props} variant='floating'
                className={cn(
                    "transition-colors duration-300",
                    "dark:data-[state=expanded]:bg-black dark:data-[state=collapsed]:bg-transparent",
                    "light:data-[state=expanded]:bg-zinc-100 light:data-[state=collapsed]:bg-transparent"
                )}
            >
                <SidebarHeader>
                    <TeamSwitcher teams={organizations || []} />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled={isDisabled} asChild className={cn(
                                    pathname.startsWith('/dashboard/home') &&
                                    "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                                )}>
                                    <a href="/dashboard/home">
                                        <Home />
                                        Home
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled={isDisabled} asChild className={cn(
                                    pathname.startsWith('/dashboard/integrations') &&
                                    "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                                )}>
                                    <a href="/dashboard/integrations">
                                        <ToyBrickIcon />
                                        Integrations
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                    <NavMain items={data.navMain} isDisabled={isDisabled} />
                    <NavProjects projects={data.projects} isDisabled={isDisabled} />
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton disabled={isDisabled} asChild className={cn(
                                pathname.startsWith('/dashboard/org') &&
                                "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                            )}>
                                <a href="/dashboard/org">
                                    <Building2 />
                                    Organization
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    {sessionData?.user && (
                        <NavUser user={sessionData.user} />
                    )}

                </SidebarFooter>
            </Sidebar>
        </>
    );
};
