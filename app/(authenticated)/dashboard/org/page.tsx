import { auth } from "@/lib/auth";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { headers } from "next/headers";
import { transformToTableOrganizations } from "@/lib/utils";
import { db } from "@/db";
import { organizationSettings } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { OrganizationSettingsComponent } from "./org-settings";
import type { SettingsFormValues } from "@/lib/types/organization";
import { redirect } from "next/navigation";

export default async function OrganizationsPage() {
	const data = await auth.api.getFullOrganization({
		headers: await headers(),
	});

	if (!data || data.id === null) {
		redirect("/create-organization");
	}
	const tableData = transformToTableOrganizations(data);

	const settings = await db
		.select()
		.from(organizationSettings)
		.where(eq(organizationSettings.organizationId, data?.id));
        console.log("Settings:", settings);


	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center justify-between mb-8">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
					<p className="text-muted-foreground">
						Manage your organizations and team members.
					</p>
				</div>
			</div>

			{data && tableData.length > 0 && (
				<DataTable columns={columns} data={tableData} />
			)}

			<OrganizationSettingsComponent
				settings={settings}
			/>
		</div>
	);
}
