import { GlobalSidebar } from '@/components/sidebar/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

type AppLayoutProperties = {
    readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {

    return (
        <SidebarProvider>
            <GlobalSidebar />
        </SidebarProvider>
    );
};

export default AppLayout;
