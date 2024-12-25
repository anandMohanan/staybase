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
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    AudioWaveform,
    BookOpen,
    BookUserIcon,
    Bot,
    Building2,
    Command,
    FileChartLineIcon,
    Frame,
    GalleryVerticalEnd,
    Home,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    TentIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { authClient } from "@/lib/auth-client"
import { NavUser } from './nav-user';
import { NavProjects } from './nav-projects';
import { NavMain } from './nav-main';
import { TeamSwitcher } from './team-switcher';
import { ModeToggleButton } from '../mode-toggle';
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
                    title: "Active Campaigns",
                    url: "/dashboard/campaigns/active",
                },
                {
                    title: "Templates",
                    url: "/dashboard/campaigns/templates",
                },
                {
                    title: "Campaigns list",
                    url: "/dashboard/campaigns/list",
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
                },
                {
                    title: "Quantum",
                    url: "/dashboard/customers/quantum",
                },
            ],
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: FileChartLineIcon,
            items: [
                {
                    title: "Retention",
                    url: "/dashboard/analytics/retention",
                },
                {
                    title: "Campaign Performance",
                    url: "/dashboard/analytics/campaign-performance",
                },
                {
                    title: "Customer behavior",
                    url: "/dashboard/analytics/customer-behavior",
                },
                {
                    title: "ROI Analysis",
                    url: "/dashboard/analytics/roi-analysis",
                },
            ],
        },
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
            icon: Map
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
                    "dark:data-[state=expanded]:bg-zinc-950 dark:data-[state=collapsed]:bg-transparent",
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
                                        <Home />
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
