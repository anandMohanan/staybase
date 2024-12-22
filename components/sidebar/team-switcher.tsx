"use client"

import * as React from "react"
import { OrigamiIcon } from "lucide-react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggleButton } from "../mode-toggle"

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string
        logo?: string | null
        slug: string
    }[]
}) {

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <OrigamiIcon className="size-4" />

                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {teams.length > 0 && teams[0].name || "No Organizations"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {teams.length > 0 && teams[0].slug || "no-org"}
                        </span>
                    </div>
                    <ModeToggleButton />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

