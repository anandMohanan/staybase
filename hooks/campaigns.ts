import { campaignFormSchema, MinimalCampaignSchema } from "@/lib/types/campaign";
import { useQuery } from "@tanstack/react-query";

export const useGetCampaigns = () => {
	return useQuery({
		queryKey: ["campaigns"],
		queryFn: async () => {
			const res = await fetch("/api/campaign/get-campaigns");
			const data = await res.json();
			console.log(data, "campaigns");
			const validatedData = MinimalCampaignSchema.safeParse(data);
			return validatedData.success ? validatedData.data : [];
		},
		enabled: true,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};

export const useGetCampaignById = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaign", campaignId],
		queryFn: async () => {
			const res = await fetch("/api/campaign/get-campaign-by-id", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					campaignId: campaignId,
				}),
			});
			const data = await res.json();
			console.log(data, "campaign");
			const validatedData = campaignFormSchema.safeParse(data);
			return validatedData.success ? validatedData.data : null;
		},
		enabled: true,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
};
