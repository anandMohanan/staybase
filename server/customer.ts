"use server"
import { db } from "@/db"
import { customers } from "@/db/schema/user"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { v4 as uuidv4 } from 'uuid'
import { RawCustomerData, ProcessedCustomerData, UploadResponse } from '@/lib/types/customer'

export const UploadCustomer = async ({
    customerData
}: {
    customerData: RawCustomerData[]
}): Promise<UploadResponse> => {
    try {
        const organization = await auth.api.listOrganizations({
            headers: await headers()
        })

        if (!organization?.[0]?.id) {
            throw new Error('Organization not found')
        }

        const customersToInsert: ProcessedCustomerData[] = customerData.map(customer => {
            let lastOrderDate: Date
            try {
                if (customer.last_order_date instanceof Date) {
                    lastOrderDate = customer.last_order_date
                } else if (typeof customer.last_order_date === 'string') {
                    lastOrderDate = new Date(customer.last_order_date)
                } else {
                    throw new Error('Invalid date format')
                }

                if (isNaN(lastOrderDate.getTime())) {
                    throw new Error('Invalid date')
                }
            } catch (error) {
                console.error(`Error processing date for customer ${customer.email}:`, error)
                throw new Error(`Invalid last_order_date format for customer ${customer.email}`)
            }

            const totalOrders = Number(customer.total_orders)
            const totalSpent = Number(customer.total_spent)

            if (isNaN(totalOrders) || isNaN(totalSpent)) {
                throw new Error(`Invalid numeric values for customer ${customer.email}`)
            }

            return {
                organizationId: organization[0].id,
                name: customer.name,
                email: customer.email,
                totalOrders,
                totalSpent,
                lastOrderDate,
                customerId: uuidv4(),
            }
        })

        await db.insert(customers).values(customersToInsert)
        return {
            success: true,
            message: 'Customers uploaded successfully'
        }
    } catch (error) {
        console.error("Error uploading customers:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error uploading customers',
            error: error instanceof Error ? error.toString() : 'Unknown error'
        }
    }
}
