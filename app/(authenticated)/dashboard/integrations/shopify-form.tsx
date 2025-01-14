"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FormEvent, useState } from "react";

export const ShopifyIntegrationFormComponent = () => {
	const [shopUrl, setShopUrl] = useState("");

	const handleConnect = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (shopUrl) {
			console.log(shopUrl);
			window.location.href = `/api/shopify/auth?shop=${shopUrl}`;
		} else {
			alert("Please enter your Shopify store URL");
		}
	};
	return (
		<form className="space-y-4" onSubmit={(e) => handleConnect(e)}>
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
				<Button className="w-full" type="submit">
					Connect Shopify Store
				</Button>
			</div>
		</form>
	);
};
