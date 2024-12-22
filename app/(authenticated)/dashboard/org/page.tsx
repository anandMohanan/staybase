import { auth } from "@/lib/auth"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { headers } from "next/headers"
import { transformToTableOrganizations } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users } from 'lucide-react'
import { redirect } from "next/navigation"

export default async function OrganizationsPage() {
    try {
        const data = await auth.api.getFullOrganization({
            headers: await headers()
        })
        const tableData = transformToTableOrganizations(data)

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground">
                        Manage your organizations and team members.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Organization
                </Button>
            </div>

            {data && tableData.length > 0 ? (
                <DataTable columns={columns} data={tableData} />
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg">
                    <Users className="h-10 w-10 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Organizations</h2>
                    <p className="text-muted-foreground mb-4">You haven't created any organizations yet.</p>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Organization
                    </Button>
                </div>
            )}
        </div>
    )
    } catch (error) {
        redirect('/dashboard/home')
    }
}


