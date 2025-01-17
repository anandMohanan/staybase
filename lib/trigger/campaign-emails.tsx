import { schedules, logger } from "@trigger.dev/sdk/v3";
import { Resend } from "resend";
import { db } from "../../db";
import { eq, and, gte } from "drizzle-orm";
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
    logger.info("Campaign email task starting");

    try {
      // Fetch active campaigns
      const campaigns = await db
        .select({
          id: CAMPAIGNS_TABLE.id,
          name: CAMPAIGNS_TABLE.name,
          description: CAMPAIGNS_TABLE.description,
          status: CAMPAIGNS_TABLE.status,
          organizationId: CAMPAIGNS_TABLE.organizationId,
        })
        .from(CAMPAIGNS_TABLE)
        .where(eq(CAMPAIGNS_TABLE.status, "ACTIVE"));

      logger.info(`Found ${campaigns.length} active campaigns`);

      if (!campaigns.length) {
        logger.warn("No active campaigns found");
        return { success: false, reason: "no_active_campaigns" };
      }

      const apiKey = process.env.TRIGGER_API_KEY;
      if (!apiKey) {
        logger.warn("No trigger API key found");
        return { success: false, reason: "no_trigger_api_key" };
      }

      // Keep track of customers who have received emails in this run
      const processedCustomers = new Set<string>();
      
      // Get cutoff time for recently sent emails (e.g., last 24 hours)
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24);

      // Fetch recently contacted customers
      const recentEmails = await db
        .select({
          customerEmail: CAMPAIGN_EMAILS_TABLE.customerEmail,
        })
        .from(CAMPAIGN_EMAILS_TABLE)
        .where(
          and(
            eq(CAMPAIGN_EMAILS_TABLE.status, "SENT"),
            gte(CAMPAIGN_EMAILS_TABLE.sentAt, cutoffTime)
          )
        );

      // Add recently contacted customers to the processed set
      recentEmails.forEach(email => processedCustomers.add(email.customerEmail));

      for (const campaign of campaigns) {
        logger.info(`Processing campaign: ${campaign.id}`);

        try {
          const shopifyResponse = await fetch(
            "http://localhost:3000/api/shopify/get-customer-by-org",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Trigger-Key": apiKey,
              },
              body: JSON.stringify({
                organizationId: campaign.organizationId,
              }),
            }
          );

          const customers = await shopifyResponse.json();

          // Process each customer, skipping those who already received emails
          for (const customer of customers) {
            // Skip if customer has already been processed in this run or recently
            if (processedCustomers.has(customer.email)) {
              logger.info(`Skipping customer ${customer.email} - already processed`);
              continue;
            }

            try {
              const emailId = nanoid();

              // Create email record
              await db.insert(CAMPAIGN_EMAILS_TABLE).values({
                id: emailId,
                campaignId: campaign.id,
                customerEmail: customer.email,
                emailType: "initial",
                status: "PENDING",
                scheduledFor: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
              });

              const emailContent = generateEmailContent({
                title: campaign.name,
                content: campaign.description,
                customerName: customer.firstName || "Valued Customer",
                lastOrderDate: customer.lastOrderDate,
                totalSpent: customer.totalSpent,
                riskScore: customer.riskScore,
              });

              const { data, error } = await resend.emails.send({
                from: "campaigns@staybase.tech",
                to: customer.email,
                subject: campaign.name,
                html: emailContent,
                tags: [
                  { name: "campaignId", value: campaign.id },
                  { name: "emailId", value: emailId },
                ],
              });

              if (error) {
                throw error;
              }

              // Update email status to sent
              await db
                .update(CAMPAIGN_EMAILS_TABLE)
                .set({
                  status: "SENT",
                  sentAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(CAMPAIGN_EMAILS_TABLE.id, emailId));

              // Add customer to processed set
              processedCustomers.add(customer.email);

              logger.info(
                `Successfully sent email ${emailId} to ${customer.email}`
              );
            } catch (error) {
              logger.error(`Failed to process customer ${customer.email}`, {
                error,
              });
              continue;
            }
          }
        } catch (error) {
          logger.error(`Failed to process campaign ${campaign.id}`, { error });
          continue;
        }
      }

      return { success: true };
    } catch (error) {
      logger.error("Campaign email task failed", { error });
      throw error;
    }
  },
});

function generateEmailContent(data: {
  title: string;
  content: string;
  customerName: string;
  lastOrderDate: string | null;
  totalSpent: number;
  riskScore: number;
}): string {
  const lastOrderDate = data.lastOrderDate
    ? new Date(data.lastOrderDate).toLocaleDateString()
    : "N/A";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">${data.title}</h1>
          
          <p>Dear ${data.customerName},</p>
          
          <div style="margin: 20px 0;">
            ${data.content}
          </div>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 5px 0;">Your Last Order: ${lastOrderDate}</p>
            <p style="margin: 5px 0;">Total Spent: $${data.totalSpent.toFixed(2)}</p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Latest Products
            </a>
          </div>

          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>This email was sent as part of our customer appreciation program.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
