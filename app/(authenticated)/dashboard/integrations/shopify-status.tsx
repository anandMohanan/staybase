"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";

interface IntegrationData {
	id: string;
	organizationId: string;
	platform: string;
	accessToken: string;
	shopDomain: string;
	status: string;
	webhookSecret: string;
	lastSync: Date | null;
}

export const ShopifyStatus = ({
	integrationData,
}: { integrationData: IntegrationData[] }) => {
	const { toast } = useToast();

	const { mutate: RefreshCustomers, isPending: isRefreshing } = useMutation({
		mutationKey: ["shopify-integration"],
		mutationFn: async () => {
			const response = await fetch("/api/shopify/customers/revalidate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.json();
		},
		onSuccess: (data, variables, context) => {
			toast({
				title: "Revalidated",
				description: "Customers have been revalidated",
				variant: "default",
			});
		},
		onError: (error, variables, context) => {
			toast({
				title: "Error Revalidating",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const { mutate: DisconnectIntegration, isPending: isDisconnecting } =
		useMutation({
			mutationKey: ["shopify-integration"],
			mutationFn: async () => {
				const response = await fetch("/api/shopify/disconnect", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});
				return response.json();
			},
			onSuccess: (data, variables, context) => {
				toast({
					title: "Disconnected",
					description: "Integration has been disconnected",
					variant: "default",
				});
			},
			onError: (error, variables, context) => {
				toast({
					title: "Error Disconnecting",
					description: error.message,
					variant: "destructive",
				});
			},
		});
	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleString();
	};
	return (
		<Card className="mb-8">
			<CardHeader>
				<CardTitle className="text-xl">Integration Status</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="font-semibold">Status:</span>
					<Badge
						variant={
							integrationData[0].status === "active" ? "default" : "destructive"
						}
					>
						{integrationData[0].status.charAt(0).toUpperCase() +
							integrationData[0].status.slice(1)}
					</Badge>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold">Shop Domain:</span>
					<span>{integrationData[0].shopDomain}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold">Last Sync:</span>
					<span>{formatDate(integrationData[0].lastSync)}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold">Platform:</span>
					<span>{integrationData[0].platform}</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					variant={"destructive"}
					onClick={() => DisconnectIntegration()}
					disabled={isDisconnecting}
				>
					{isDisconnecting ? (
						<>
							<RefreshCwIcon className="animate-spin h-5 w-5" />
						</>
					) : (
						<>
							<RefreshCwIcon className="h-5 w-5" />
							Disconnect
						</>
					)}
				</Button>
				<Button
					variant={"outline"}
					className="ml-2"
					onClick={() => RefreshCustomers()}
					disabled={isRefreshing}
				>
					{isRefreshing ? (
						<>
							<RefreshCwIcon className="animate-spin h-5 w-5" />
						</>
					) : (
						<>
							<RefreshCwIcon className="h-5 w-5" />
							Refresh
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
};
