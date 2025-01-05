import { schedules, task } from "@trigger.dev/sdk/v3";
import { Resend } from "resend";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
    CAMPAIGN_EMAILS_TABLE,
    CAMPAIGNS_TABLE,
    CUSTOMERS_TABLE,
} from "@/db/schema/campaign";

const resend = new Resend(process.env.RESEND_API_KEY);

export const campaignEmailTask = schedules.task({
    id: "campaign-email-send",
    run: async (payload) => {
        try {
            const campaign = await db
                .select({
                    name: CAMPAIGNS_TABLE.name,
                    description: CAMPAIGNS_TABLE.description,
                    status: CAMPAIGNS_TABLE.status,
                    organizationId: CAMPAIGNS_TABLE.organizationId,
                })
                .from(CAMPAIGNS_TABLE)
                .where(eq(CAMPAIGNS_TABLE.status, "ACTIVE"));

            if (!campaign) {
                throw new Error("Campaign not found");
            }

            let AllCustomers = [];

            // biome-ignore lint/complexity/noForEach: <explanation>
            campaign.forEach(async (campaign) => {
                const shopifyCustomers = await fetch(
                    "/api/shopify/get-customer-by-org",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            organizationId: campaign.organizationId,
                        }),
                    },
                );
                const shopifyCustomersData = await shopifyCustomers.json();
                AllCustomers.push(shopifyCustomersData);

            });

            // 1. Get campaign emails

            const emailId = nanoid();
            const emailRecord = await db.insert(CAMPAIGN_EMAILS_TABLE).values({
                id: emailId,
                campaignId: campaign[0].id,
                customerEmail: payload.customerEmail,
                emailType: "initial",
                scheduledFor: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // 3. Send email using Resend
            const { data, error } = await resend.emails.send({
                from: "campaigns@yourdomain.com",
                to: payload.customerEmail,
                subject: campaign[0].name,
                html: generateEmailContent(payload.templateData),
                tags: [
                    { name: "campaignId", value: campaign.id },
                    { name: "emailId", value: emailId },
                ],
            });

            if (error) {
                // Record failure event
                await db.insert(emailEvents).values({
                    id: nanoid(),
                    emailId,
                    eventType: "failed",
                    metadata: { error: error.message },
                    occurredAt: new Date(),
                    createdAt: new Date(),
                });

                throw error;
            }

            // 4. Update email record as sent
            await db
                .update(campaignEmails)
                .set({
                    status: "SENT",
                    sentAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(campaignEmails.id, emailId));

            // 5. Record sent event
            await db.insert(emailEvents).values({
                id: nanoid(),
                emailId,
                eventType: "sent",
                metadata: { resendId: data?.id },
                occurredAt: new Date(),
                createdAt: new Date(),
            });

            return { success: true, emailId };
        } catch (error) {
            logger.error("Failed to send campaign email", { error });
            throw error;
        }
    },
});

// Helper function to generate email content
function generateEmailContent(templateData: Record<string, any>): string {
    // Implement your email template logic here
    return `
    <html>
      <body>
        <h1>${templateData.title}</h1>
        <p>${templateData.content}</p>
      </body>
    </html>
  `;
}
