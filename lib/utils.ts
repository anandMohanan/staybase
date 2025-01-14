import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrganizationSchema, TableOrganization, TableOrganizationSchema } from "./types/organization";
import { CampaignFormValues } from "./types/campaign";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const transformToTableOrganizations = (data: unknown): TableOrganization[] => {
    const validatedData = OrganizationSchema.parse(data);

    return validatedData.members.map(member => {
        const tableOrg = {
            id: member.user.id,
            name: member.user.name,
            role: member.role,
            email: member.user.email,
            image: member.user.image,
        };

        return TableOrganizationSchema.parse(tableOrg);
    });
};

// utils/customer-analytics.ts

// Calculate average days between orders
function calculateAverageOrderGap(orderDates: Date[]): number {
    if (orderDates.length <= 1) return 0;
    
    const sortedDates = orderDates.sort((a, b) => b.getTime() - a.getTime());
    let totalGap = 0;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const gap = sortedDates[i].getTime() - sortedDates[i + 1].getTime();
        totalGap += gap / (1000 * 60 * 60 * 24); // Convert to days
    }
    
    return Math.round(totalGap / (sortedDates.length - 1));
}

// Calculate most purchased product categories
function calculatePreferredCategories(orders: any[]): string[] {
    const categoryCount: { [key: string]: number } = {};
    
    orders.forEach(order => {
        order.lineItems.edges.forEach((item: any) => {
            const category = item.node.variant?.product?.productType || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + item.node.quantity;
        });
    });
    
    // Sort categories by count and take top 3
    return Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);
}

// Calculate most purchased products
function calculateTopProducts(orders: any[]): any[] {
    const productCount: { [key: string]: { 
        title: string, 
        purchaseCount: number,
        totalSpent: number 
    } } = {};
    
    orders.forEach(order => {
        order.lineItems.edges.forEach((item: any) => {
            const product = item.node;
            const price = parseFloat(product.variant?.price || 0);
            const quantity = product.quantity;
            
            if (!productCount[product.title]) {
                productCount[product.title] = {
                    title: product.title,
                    purchaseCount: 0,
                    totalSpent: 0
                };
            }
            
            productCount[product.title].purchaseCount += quantity;
            productCount[product.title].totalSpent += price * quantity;
        });
    });
    
    // Sort by purchase count and take top 5
    return Object.values(productCount)
        .sort((a, b) => b.purchaseCount - a.purchaseCount)
        .slice(0, 5);
}

// Calculate churn probability based on order patterns
function calculateChurnProbability(orders: any[]): number {
    if (orders.length === 0) return 100;
    
    const lastOrderDate = new Date(orders[0].createdAt);
    const daysSinceLastOrder = Math.floor(
        (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Calculate average time between orders
    const avgOrderGap = calculateAverageOrderGap(
        orders.map(order => new Date(order.createdAt))
    );
    
    if (avgOrderGap === 0) return 50;
    
    // Basic probability calculation
    // If the time since last order is more than 2x the average gap, increase churn probability
    const probability = Math.min(
        100,
        Math.round((daysSinceLastOrder / (avgOrderGap * 2)) * 100)
    );
    
    return probability;
}

// Calculate the trend in customer's spending
function calculateLifetimeValueTrend(orders: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (orders.length < 2) return 'stable';

    const recentOrders = orders
        .slice(0, Math.min(orders.length, 3))
        .map(order => parseFloat(order.totalPriceSet.shopMoney.amount));

    const oldOrders = orders
        .slice(-Math.min(orders.length, 3))
        .map(order => parseFloat(order.totalPriceSet.shopMoney.amount));

    const recentAvg = recentOrders.reduce((a, b) => a + b, 0) / recentOrders.length;
    const oldAvg = oldOrders.reduce((a, b) => a + b, 0) / oldOrders.length;

    if (recentAvg > oldAvg * 1.1) return 'increasing';
    if (recentAvg < oldAvg * 0.9) return 'decreasing';
    return 'stable';
}

export {
    calculateAverageOrderGap,
    calculatePreferredCategories,
    calculateTopProducts,
    calculateChurnProbability,
    calculateLifetimeValueTrend
};

export function calculatePriorityScore(campaign: Partial<CampaignFormValues>): number {
	let score = 0;

	// Base score by campaign type
	const typeScores = {
		ABANDONED_CART: 100,
		WINBACK: 80,
		REENGAGEMENT: 70,
		LOYALTY_REWARD: 60,
		PRODUCT_UPDATE: 50,
		NEWSLETTER: 30,
	};

	if (campaign.type) {
		score += typeScores[campaign.type];
	}

	// Adjust based on target audience
	if (campaign.targetAudience) {
		const audienceScores = {
			HIGH_RISK: 30,
			MEDIUM_RISK: 20,
			LOW_RISK: 10,
			ALL: 0,
		};
		score += audienceScores[campaign.targetAudience];
	}

	// Adjust based on automation
	if (campaign.isAutomated) {
		score += 10;
	}

	return Math.min(score, 100);
}
