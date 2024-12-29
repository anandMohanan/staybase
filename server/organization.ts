"use server";

import { db } from "@/db";
import { organizationSettings } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import type { SettingsFormValues } from "@/lib/types/organization";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const updateOrganizationSettings = async (
	settings: SettingsFormValues,
) => {
	try {
		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});
		const organizationId = organization?.[0]?.id;
		console.log("Organization ID:", organizationId);
		const data = await db
			.update(organizationSettings)
			.set(settings)
			.where(eq(organizationSettings.organizationId, organizationId))
			.returning({
				id: organizationSettings.fromEmail,
			});
		console.log("Settings ID:", data[0].id);
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
