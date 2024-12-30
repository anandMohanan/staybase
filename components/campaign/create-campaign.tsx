"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, LoaderIcon, PlusCircle } from "lucide-react";
import {
	campaignFormSchema,
	type CampaignFormValues,
} from "@/lib/types/campaign";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createCampaign } from "@/server/campaign";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const steps = [
	{ id: "basics", title: "Basic Info" },
	{ id: "audience", title: "Target Audience" },
	{ id: "schedule", title: "Schedule" },
	{ id: "review", title: "Review" },
];

export const CampaignCreationDialog = () => {
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);

	const form = useForm<CampaignFormValues>({
		resolver: zodResolver(campaignFormSchema),
		defaultValues: {
			name: "",
			description: "",
			targetAudience: undefined,
			riskLevel: undefined,
			isAutomated: false,
		},
	});

	const { isSubmitting, isDirty } = form.formState;

	async function onSubmit(data: CampaignFormValues) {
		try {
			const response = await createCampaign(data);
			if (!response.success) throw new Error(response.message);
			setOpen(false);
		} catch (error) {
			toast.error("Failed to create campaign");
			console.error("Error creating campaign:", error);
		}
	}

	const { toast } = useToast();

	const { mutate: mutateCampaign, isPending: createCampaignPending } =
		useMutation({
			mutationFn: async (values: CampaignFormValues) => {
				console.log(values);
				const response = await createCampaign(values);
				if (!response.success) throw new Error(response.message);
				setOpen(false);
				form.reset();
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
					title: "Campaign Created Successfully",
					variant: "default",
				});
			},
		});

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Campaign Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter campaign name" {...field} />
									</FormControl>
									<FormDescription>
										Choose a clear and descriptive name for your campaign.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your campaign"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Provide details about the campaign's goals and strategy.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				);

			case 1:
				return (
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="targetAudience"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Target Audience</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select target audience" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="HIGH_RISK">
												High Risk Customers
											</SelectItem>
											<SelectItem value="MEDIUM_RISK">
												Medium Risk Customers
											</SelectItem>
											<SelectItem value="LOW_RISK">
												Low Risk Customers
											</SelectItem>
											<SelectItem value="ALL">All Customers</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Choose the customer segment for this campaign.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="riskLevel"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Risk Level</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select risk level" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="HIGH">High</SelectItem>
											<SelectItem value="MEDIUM">Medium</SelectItem>
											<SelectItem value="LOW">Low</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Set the risk level for campaign monitoring.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				);

			case 2:
				return (
					<div className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											When should the campaign begin?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											When should the campaign end?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				);

			case 3:
				const values = form.getValues();
				return (
					<div className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<Card className="p-6">
								<h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
								<dl className="space-y-2">
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											Name
										</dt>
										<dd className="text-sm">{values.name}</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											Description
										</dt>
										<dd className="text-sm">{values.description}</dd>
									</div>
								</dl>
							</Card>
							<Card className="p-6">
								<h3 className="text-lg font-semibold mb-4">
									Target & Schedule
								</h3>
								<dl className="space-y-2">
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											Target Audience
										</dt>
										<dd className="text-sm">{values.targetAudience}</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											Risk Level
										</dt>
										<dd className="text-sm">{values.riskLevel}</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											Start Date
										</dt>
										<dd className="text-sm">
											{values.startDate
												? format(values.startDate, "PPP")
												: "Not set"}
										</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-muted-foreground">
											End Date
										</dt>
										<dd className="text-sm">
											{values.endDate
												? format(values.endDate, "PPP")
												: "Not set"}
										</dd>
									</div>
								</dl>
							</Card>
						</div>
						<Card className="p-6 bg-muted">
							<h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>
							<p className="text-sm">
								This {values.riskLevel?.toLowerCase()} risk campaign named "
								{values.name}" targets{" "}
								{values.targetAudience?.toLowerCase().replace("_", " ")}{" "}
								customers. It is scheduled to run from{" "}
								{values.startDate
									? format(values.startDate, "MMMM d, yyyy")
									: "TBD"}
								to{" "}
								{values.endDate
									? format(values.endDate, "MMMM d, yyyy")
									: "TBD"}
								.
							</p>
						</Card>
					</div>
				);
		}
	};

	const handleNext = async () => {
		if (currentStep === steps.length - 1) {
			// await form.handleSubmit(onSubmit)();
			mutateCampaign(form.getValues());
		} else {
			setCurrentStep((prev) => prev + 1);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Campaign
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Create New Campaign</DialogTitle>
					<DialogDescription>
						Set up a new campaign in just a few steps.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-8 mb-8">
					{steps.map((step, index) => (
						<div
							key={step.id}
							className={cn(
								"flex items-center gap-2",
								index <= currentStep ? "text-primary" : "text-muted-foreground",
							)}
						>
							<div
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center",
									index <= currentStep
										? "bg-primary text-primary-foreground"
										: "bg-muted",
								)}
							>
								{index + 1}
							</div>
							<span>{step.title}</span>
						</div>
					))}
				</div>

				<Card className="p-6">
					<Form {...form}>
						<form className="space-y-6">
							{renderStep()}

							<div className="flex justify-between mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={() => setCurrentStep((prev) => prev - 1)}
									disabled={currentStep === 0}
								>
									Previous
								</Button>
								<Button
									type="button"
									onClick={handleNext}
									disabled={isSubmitting}
								>
									{createCampaignPending && (
										<LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
									)}
									{currentStep === steps.length - 1
										? "Create Campaign"
										: "Next"}
								</Button>
							</div>
						</form>
					</Form>
				</Card>
			</DialogContent>
		</Dialog>
	);
};
