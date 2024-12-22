import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
    const data = await auth.api.listOrganizations({
        headers: await headers()
    })
    if (data.length <= 0) {
        redirect('/dashboard/')
    }
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-background">
            <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
                <h1 className="text-4xl font-bold">
                    Create an organization
                </h1>
                <p className="text-lg text-muted-foreground">
                    Create a new organization to manage your projects and
                    campaigns.
                </p>
            </div>
        </div>
    )
}
