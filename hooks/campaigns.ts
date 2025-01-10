import {
    campaignApiResponseSchema,
    campaignFormSchema,
    MinimalCampaignSchema,
} from "@/lib/types/campaign";
import { deleteCampaign } from "@/server/campaign";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useToast } from "./use-toast";

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

export const useGetCampaignById = (campaignId: string, isEdit: boolean) => {
    return useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: async () => {
            if (isEdit) {
                const res = await fetch("/api/campaign/get-campaign-by-id", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        campaignId: campaignId,
                    }),
                });
                console.log(res, "res");
                if (!res.ok) {
                    throw new Error("Failed to fetch campaign");
                }
                const data = await res.json();
                // Get the first item from the array
                const campaignData = data[0];

                // Transform the data to match form schema
                const transformedData = {
                    name: campaignData.name,
                    description: campaignData.description,
                    targetAudience: campaignData.targetAudience,
                    startDate: new Date(campaignData.startDate),
                    endDate: new Date(campaignData.endDate),
                    isAutomated: campaignData.isAutomated,
                };

                console.log(transformedData, "transformedData");
                // Validate transformed data
                const validatedData = campaignFormSchema.safeParse(transformedData);
                console.log(validatedData.error, "validatedData");
                console.log(validatedData.data, "validatedData");
                if (!validatedData.success) {
                    throw new Error("Invalid campaign data");
                }

                return validatedData.data;
            }else{
                return {};
            }
        },
        enabled: isEdit,
    });
};

export const useDeleteCampaign = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (campaignId: string) => {
            const res = await deleteCampaign(campaignId);
            if (!res.success) throw new Error(res.message);
        },
        onError(error: any) {
            if (error?.status === 500) {
                toast({
                    title: "Server Error",
                    description:
                        "Please check your internet connection or try again later.",
                    variant: "default",
                });
                return;
            }
            toast({
                title: error.message || "Something went wrong",
                description: "Please try again.",
                variant: "default",
            });
        },
        onSuccess: () => {
            toast({
                title: "Campaign Deleted Successfully",
                variant: "default",
            });
        },
    });
};
