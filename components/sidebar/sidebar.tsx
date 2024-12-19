'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { authClient } from "@/lib/auth-client"
import { NavUser } from './nav-user';
import { NavProjects } from './nav-projects';
import { NavMain } from './nav-main';
import { TeamSwitcher } from './team-switcher';

type GlobalSidebarProperties = {
    readonly children: ReactNode;
};

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
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
    console.log(organizations)
    const isDisabled = organizations?.length === 0 || !organizations


    const sidebar = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <TeamSwitcher teams={organizations || []} />
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={data.navMain} isDisabled={isDisabled} />
                    <NavProjects projects={data.projects} isDisabled={isDisabled} />
                </SidebarContent>
                <SidebarFooter>
                    {sessionData?.user && (
                        <NavUser user={sessionData.user} />
                    )}
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </>
    );
};
