"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export const ShopifyIntegrationForm = () => {
    const [shopUrl, setShopUrl] = useState('')

    const handleConnect = () => {
        if (shopUrl) {
            window.location.href = `/api/shopify/auth?shop=${shopUrl}`
        } else {
            alert('Please enter your Shopify store URL')
        }
    }
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="shop-url">Shopify Store URL</Label>
                <Input
                    id="shop-url"
                    placeholder="your-store.myshopify.com"
                    type="text"
                    value={shopUrl}
                    onChange={(e) => setShopUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                    Enter your Shopify store URL without 'https://'
                </p>
            </div>
            <Button
                className="w-full"
                onClick={handleConnect}
            >
                Connect Shopify Store
            </Button>
        </div>
    )
}
