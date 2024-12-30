"use client";

import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrganizationSettingsType } from "@/db/schema/user";
import { useForm } from "react-hook-form";
import {
	type SettingsFormValues,
	settingsFormSchema,
} from "@/lib/types/organization";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { updateOrganizationSettings } from "@/server/organization";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const OrganizationSettingsComponent = ({
	settings,
}: {
	settings: OrganizationSettingsType;
}) => {
	console.log("Settings:", settings);
	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsFormSchema),
		mode: "onSubmit",
		defaultValues: {
			automaticCampaigns: settings.automaticCampaigns || false,
			riskThreshold: settings.riskThreshold as "LOW" | "MEDIUM" | "HIGH",
			notificationPreferences: settings.notificationPreferences || {
				email: false,
				inApp: false,
				digest: "DAILY",
			},
			autoArchiveDays: settings.autoArchiveDays || 30,
			fromEmail: settings.fromEmail || "",
			automaticDiscountOffers: settings.automaticDiscountOffers || false,
			enableDiscountRestrictions: settings.enableDiscountRestrictions || false,
			maxDiscountPercentage: settings.maxDiscountPercentage || 0,
			minPurchaseAmount: settings.minPurchaseAmount || 0,
			excludeDiscountedItems: settings.excludeDiscountedItems || false,
			limitOnePerCustomer: settings.limitOnePerCustomer || true,
		},
	});
	const { toast } = useToast();

	const { mutateAsync: mutateSettings, isPending: updateSettingsPending } =
		useMutation({
			mutationFn: async (values: SettingsFormValues) => {
				const response = await updateOrganizationSettings(values);
				if (!response.success) throw new Error(response.message);
			},
			onError(error, variables, context) {
				console.log(error, "ERROR");
				if (error.status === 500) {
					toast({
						title: "Server Error",
						description:
							"Please check your internet connection or try again later.",
						variant: "default",
					});
					return;
				}
				toast({
					title: error.message,
					description: "Please try again.",
					variant: "default",
				});
			},
			onSuccess: () => {
				toast({
					title: "Settings Updated Successfully",
					variant: "default",
				});
			},
		});

	const onSubmit = async (data: SettingsFormValues) => {
		try {
			console.log("Form submitted:", data);
			await mutateSettings(data);
		} catch (error) {
			console.error("Submit error:", error);
		}
	};

	return (
		<Card className="mt-8">
			<CardHeader>
				<CardTitle>Organization Settings</CardTitle>
				<CardDescription>
					Configure how your organization handles campaigns, notifications, and
					data management.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							console.log("Form data:", form.getValues());
							form.handleSubmit(onSubmit)(e); // Actually execute the handler
						}}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="fromEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>From Email</FormLabel>
									<FormControl>
										<Input placeholder="organization@example.com" {...field} />
									</FormControl>
									<FormDescription>
										The email address used as the sender for campaigns
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="automaticCampaigns"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Automatic Campaigns
										</FormLabel>
										<FormDescription>
											Automatically create campaigns for high-risk customers
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="riskThreshold"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Risk Threshold</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select risk threshold" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="LOW">Low</SelectItem>
											<SelectItem value="MEDIUM">Medium</SelectItem>
											<SelectItem value="HIGH">High</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Set the risk level that triggers automatic actions
									</FormDescription>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notificationPreferences.digest"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Report Digest Frequency</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select digest frequency" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="DAILY">Daily</SelectItem>
											<SelectItem value="WEEKLY">Weekly</SelectItem>
											<SelectItem value="MONTHLY">Monthly</SelectItem>
											<SelectItem value="NONE">None</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="autoArchiveDays"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Auto-Archive Period</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select archive period" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="7">7 days</SelectItem>
											<SelectItem value="14">14 days</SelectItem>
											<SelectItem value="30">30 days</SelectItem>
											<SelectItem value="60">60 days</SelectItem>
											<SelectItem value="90">90 days</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Automatically archive completed campaigns after this period
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="automaticDiscountOffers"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Automatic Discount Offers
										</FormLabel>
										<FormDescription>
											Allow AI to automatically generate and send discount
											offers
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="enableDiscountRestrictions"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Enable Discount Offer Restrictions
										</FormLabel>
										<FormDescription>
											Set specific restrictions for AI-generated discount offers
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{form.watch("enableDiscountRestrictions") && (
							<div className="space-y-4 border rounded-lg p-4">
								<FormField
									control={form.control}
									name="maxDiscountPercentage"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Maximum Discount Percentage</FormLabel>
											<FormControl>
												<Input type="number" min="0" max="100" {...field} />
											</FormControl>
											<FormDescription>
												Set the maximum allowed discount percentage (0-100)
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="minPurchaseAmount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Minimum Purchase Amount</FormLabel>
											<FormControl>
												<Input type="number" min="0" {...field} />
											</FormControl>
											<FormDescription>
												Set the minimum purchase amount required for discount
												eligibility
											</FormDescription>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="excludeDiscountedItems"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between space-x-2">
											<div>
												<FormLabel>Exclude Already Discounted Items</FormLabel>
												<FormDescription>
													Prevent discounts on items already on sale
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="limitOnePerCustomer"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between space-x-2">
											<div>
												<FormLabel>Limit One Per Customer</FormLabel>
												<FormDescription>
													Allow only one discount offer per customer
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						)}
						<Button type="submit">
							{" "}
							{updateSettingsPending && (
								<Loader className="w-4 h-4 mr-2 animate-spin" />
							)}{" "}
							Save Settings
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
