import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertCircle,
	CheckCircle2,
	RefreshCwIcon,
	ShoppingBag,
} from "lucide-react";
import { ShopifyIntegrationFormComponent } from "./shopify-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { INTEGRATION_TABLE } from "@/db/schema/integration";
import { eq } from "drizzle-orm";
import { CSVUploadComponent } from "./manual-csv";
import { ShopifyStatus } from "./shopify-status";

const IntegrationPage = async () => {
	const organization = await auth.api.listOrganizations({
		headers: await headers(),
	});
	const integrationData = await db
		.select()
		.from(INTEGRATION_TABLE)
		.where(eq(INTEGRATION_TABLE.organizationId, organization[0].id));

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleString();
	};
	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Shopify Integration</h1>
				<ShoppingBag className="h-8 w-8 text-primary" />
			</div>

			{integrationData.length === 0 && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="text-2xl">
							Connect Your Shopify Store
						</CardTitle>
						<CardDescription>
							Import your customers and orders automatically from Shopify
						</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-3">What you'll get:</h3>
								<ul className="space-y-2">
									{[
										"Automatic customer sync",
										"Order tracking",
										"Real-time updates",
										"Customer segments",
									].map((item, index) => (
										<li key={index} className="flex items-center space-x-2">
											<CheckCircle2 className="h-5 w-5 text-green-500" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
						<ShopifyIntegrationFormComponent />
					</CardContent>
				</Card>
			)}
			{integrationData.length > 0 ? (
				<ShopifyStatus integrationData={integrationData} />
			) : (
				<Card>
					<CardContent className="flex items-center justify-center h-40">
						<div className="flex items-center space-x-2 text-yellow-500">
							<AlertCircle className="h-5 w-5" />
							<span>
								No integration data available. Please connect your Shopify
								store.
							</span>
						</div>
					</CardContent>
				</Card>
			)}
			<CSVUploadComponent />
		</div>
	);
};

export default IntegrationPage;
