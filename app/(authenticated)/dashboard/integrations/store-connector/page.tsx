"use client"

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ShopifyIntegration() {
    const businessId = process.env.NEXT_PUBLIC_SHOPIFY_BUSINESS
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shopify Integration</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Connect Your Shopify Store</CardTitle>
                    <CardDescription>
                        Import your customers and orders automatically from Shopify
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">What you'll get:</h3>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Automatic customer sync</li>
                                <li>Order tracking</li>
                                <li>Real-time updates</li>
                                <li>Customer segments</li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => {
                                const shop = prompt('Enter your shop domain (e.g., your-store.myshopify.com):');
                                if (shop) {
                                    window.location.href = `/api/shopify/auth?shop=${shop}&businessId=${businessId}`;
                                }
                            }}
                        >
                            Connect Shopify Store
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
