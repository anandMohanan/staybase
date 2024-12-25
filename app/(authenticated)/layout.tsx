import { GlobalSidebar } from '@/components/sidebar/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

type AppLayoutProperties = {
    readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session?.user.id === null || session?.user.email === null || session?.user.email === '') {
        redirect("/sign-in")
    }

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
