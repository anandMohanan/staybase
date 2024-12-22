"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { CREATEORGFORMTYPE, CREATEORGSCHEMA } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Building, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const CreateOrganization = () => {
    const form = useForm<CREATEORGFORMTYPE>({
        resolver: zodResolver(CREATEORGSCHEMA),
        defaultValues: {
            name: "",
            slug: "",
        },
    });
    const { toast } = useToast();
    const router = useRouter();
    const { mutate: createOrganization, isPending: createOrganizationPending } = useMutation({
        mutationFn: async (values: CREATEORGFORMTYPE) => {
            const { data, error } = await authClient.organization.create({
                name: values.name,
                slug: values.slug,
            });
            await authClient.organization.setActive({
                organizationId: data?.id
            })
            if (error) {
                throw error;
            }
        },
        onError(error, variables, context) {
            toast({
                title: "Error",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Organization created successfully.",
                variant: "default",
            });
        },
    });

    const onSubmit = async (values: CREATEORGFORMTYPE) => {
        createOrganization(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Staybase" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="stay" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={createOrganizationPending} variant="outline" className="aspect-square max-sm:p-0 w-full">
                    {createOrganizationPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin opacity-60 sm:-ms-1 sm:me-2" />
                    ) : (
                        <Building className="w-4 h-4 mr-2 opacity-60 sm:-ms-1 sm:me-2" />
                    )}
                    {createOrganizationPending ? "Creating..." : "Create Organization"}
                </Button>
            </form>
        </Form>
    );
};


