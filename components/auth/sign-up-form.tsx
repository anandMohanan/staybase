"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type SIGNUPFORMTYPE, SIGNUPSCHEMA } from "@/lib/types/auth";
import { authClient } from "@/lib/auth-client";

export const SignupForm = () => {
    const form = useForm<SIGNUPFORMTYPE>({
        resolver: zodResolver(SIGNUPSCHEMA),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    const { toast } = useToast();
    const router = useRouter();
    const { mutate: createAccount, isPending: createAccountPending } =
        useMutation({
            mutationFn: async (values: SIGNUPFORMTYPE) => {
                const { data, error } = await authClient.signUp.email({
                    email: values.email,
                    password: values.password,
                    name: values.name,
                });
                if (error) {
                    throw error;
                }
            },
            onError: (error, variables, context) => {
                toast({
                    title: error.message,
                    description: "Sorry, we had an error creating your account.",
                    variant: "destructive",
                });
            },
            onSuccess: () => {
                toast({
                    title: "Account created",
                    description: "We've created your account for you.",
                    variant: "default",
                });
                // router.push("/home");
            },
        });

    const onSubmit = async (values: SIGNUPFORMTYPE) => {
        createAccount(values);
    };
    return (
        <div className="flex items-center justify-center m-auto">
            <Card className="m-auto min-w-lg border-none">
                <CardContent className="w-full p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="max" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="max@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="*********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={createAccountPending}>
                                    {createAccountPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
