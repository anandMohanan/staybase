import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { CreateOrganization } from './create-organization';
import { headers } from 'next/headers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { redirect } from 'next/navigation';

const title = 'Staybase';
const description = 'Manage your organizations and projects with ease.';

export const metadata: Metadata = {
    title,
    description,
};

const AuthLanding = async () => {
    const data = await auth.api.listOrganizations({
        headers: await headers()
    })

    if (data.length === 0) {
        return (
            <div className="flex">
                <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 mx-auto">
                    <Building2 className="w-16 h-16 mb-8 text-primary" />
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-center lg:text-5xl">
                        Welcome to Staybase
                    </h1>
                    <p className="mb-8 text-xl text-center">
                        Create an organization or accept an invitation to get started.
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="aspect-square max-sm:p-0">
                                <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
                                <span className="max-sm:sr-only">
                                    Create Organization
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create an Organization</DialogTitle>
                                <DialogDescription>
                                    Set up your organization to start managing projects and users.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateOrganization />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    redirect('/dashboard/home')
};

export default AuthLanding;


