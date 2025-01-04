import { MinimalCampaignSchema } from "@/lib/types/campaign";
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