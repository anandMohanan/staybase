import { task } from "@trigger.dev/sdk/v3";
import { Resend } from "resend";
import { db } from "../../db";
import { campaignEmails, emailEvents, campaigns } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CampaignEmailPayload {
	campaignId: string;
	customerId: string;
	customerEmail: string;
}

export const campaignEmailTask = task({
	id: "campaign-email-send",
	run: async (payload: CampaignEmailPayload) => {
		try {
			const campaign = await db
				.select()
				.from(campaigns)
				.where(eq(campaigns.id, payload.campaignId))
				.limit(1);

			if (!campaign) {
				throw new Error("Campaign not found");
			}

			const emailId = nanoid();
			const emailRecord = await db.insert(campaignEmails).values({
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
