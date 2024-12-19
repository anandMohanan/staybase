"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SIGNINFORMTYPE, SIGNINSCHEMA } from "@/lib/types/auth";

export const SigninForm = () => {
    const form = useForm<SIGNINFORMTYPE>({
        resolver: zodResolver(SIGNINSCHEMA),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { toast } = useToast();
    const router = useRouter();
    const { mutate: signInAccount, isPending: signInPending } = useMutation({
        mutationFn: async (values: SIGNINFORMTYPE) => {
            const { data, error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });
            console.log(data, error);
            if (error) {
                throw error;
            }
        },
        onError(error, variables, context) {
            toast({
                title: error.message,
                description: "Please try again.",
                variant: "default",
                action: (
                    <ToastAction
                        altText="Sign up"
                        onClick={() => router.push("/sign-up")}
                    >
                        Sign up
                    </ToastAction>
                ),
            });
        },
        onSuccess: () => {
            toast({
                title: "Signed in Successfully",
                variant: "default",
            });
            router.push("/dashboard");
        },
    });

    const onSubmit = async (values: SIGNINFORMTYPE) => {
        signInAccount(values);
    };
    return (
        <div className="flex items-center justify-center">
            <Card className="m-auto max-w-sm border-none">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="max@staybase.com" {...field} />
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
                                <Button type="submit" disabled={signInPending}>
                                    {signInPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
