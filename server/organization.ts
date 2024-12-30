"use server";

import { db } from "@/db";
import { organizationSettings } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import type { SettingsFormValues } from "@/lib/types/organization";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const updateOrganizationSettings = async (
    settings: SettingsFormValues,
) => {
    try {
        const organization = await auth.api.listOrganizations({
            headers: await headers(),
        });
        const organizationId = organization?.[0]?.id;
        console.log("Organization ID:", organizationId);
        console.log("Settings:", settings);
        const alreadyExists = await db
            .select()
            .from(organizationSettings)
            .where(eq(organizationSettings.organizationId, organizationId));
        if (alreadyExists.length > 0) {
            console.log("Already exists");
            await db
                .update(organizationSettings)
                .set({
                    automaticCampaigns: settings.automaticCampaigns,
                    riskThreshold: settings.riskThreshold,
                    notificationPreferences: settings.notificationPreferences,
                    fromEmail: settings.fromEmail,
                    autoArchiveDays: settings.autoArchiveDays,
                    automaticDiscountOffers: settings.automaticDiscountOffers,
                    enableDiscountRestrictions: settings.enableDiscountRestrictions,
                    maxDiscountPercentage: settings.maxDiscountPercentage,
                    minPurchaseAmount: settings.minPurchaseAmount,
                    excludeDiscountedItems: settings.excludeDiscountedItems,
                    limitOnePerCustomer: settings.limitOnePerCustomer,
                })
                .where(eq(organizationSettings.organizationId, organizationId));
            return {
                success: true,
                message: "Settings updated successfully",
            };
        }
        console.log("Not exists");
        await db.insert(organizationSettings).values({
            organizationId: organizationId,
            organizationSettingsId: uuid(),
            automaticCampaigns: settings.automaticCampaigns,
            riskThreshold: settings.riskThreshold,
            notificationPreferences: settings.notificationPreferences,
            fromEmail: settings.fromEmail,
            autoArchiveDays: settings.autoArchiveDays,
            updatedAt: new Date(),
            createdAt: new Date(),
            automaticDiscountOffers: settings.automaticDiscountOffers,
            enableDiscountRestrictions: settings.enableDiscountRestrictions,
            maxDiscountPercentage: settings.maxDiscountPercentage,
            minPurchaseAmount: settings.minPurchaseAmount,
            excludeDiscountedItems: settings.excludeDiscountedItems,
            limitOnePerCustomer: settings.limitOnePerCustomer,
        });
        return {
            success: true,
            message: "Settings updated successfully",
        };
    } catch (error) {
        console.error("Error updating organization settings:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Error updating organization settings",
            error: error instanceof Error ? error.toString() : "Unknown error",
        };
    }
};
