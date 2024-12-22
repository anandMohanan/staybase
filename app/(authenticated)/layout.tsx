import { GlobalSidebar } from '@/components/sidebar/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

type AppLayoutProperties = {
    readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {

    return (
        <SidebarProvider>
            <GlobalSidebar />
            <SidebarTrigger className='mt-4' />
            <SidebarInset>
                <div className='md:px-32 md:py-20 px-16 py-10'>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AppLayout;
