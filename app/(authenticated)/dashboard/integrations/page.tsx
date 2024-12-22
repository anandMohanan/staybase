import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react'
import { ShopifyIntegrationForm } from './shopify-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { integrations } from '@/db/schema/integration'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function ShopifyIntegration() {
    const organization = await auth.api.listOrganizations({
        headers: await headers()
    })
    const integrationData = await db.select().from(integrations).where(eq(integrations.organizationId, organization[0].id))

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleString()
    }
    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Shopify Integration</h1>
                <ShoppingBag className="h-8 w-8 text-primary" />
            </div>

            {integrationData.length === 0 && (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Connect Your Shopify Store</CardTitle>
                    <CardDescription>
                        Import your customers and orders automatically from Shopify
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">What you'll get:</h3>
                            <ul className="space-y-2">
                                {['Automatic customer sync', 'Order tracking', 'Real-time updates', 'Customer segments'].map((item, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <ShopifyIntegrationForm />
                </CardContent>
            </Card>
            )}
            {
                integrationData.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Integration Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Status:</span>
                                <Badge variant={integrationData[0].status === 'active' ? 'default' : 'destructive'}>
                                    {integrationData[0].status.charAt(0).toUpperCase() + integrationData[0].status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Shop Domain:</span>
                                <span>{integrationData[0].shopDomain}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Last Sync:</span>
                                <span>{formatDate(integrationData[0].lastSync)}</span>

                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Platform:</span>
                                <span>{integrationData[0].platform}</span>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex items-center justify-center h-40">
                            <div className="flex items-center space-x-2 text-yellow-500">
                                <AlertCircle className="h-5 w-5" />
                                <span>No integration data available. Please connect your Shopify store.</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            }

        </div>
    )
}


