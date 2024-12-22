import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrganizationSchema, TableOrganization, TableOrganizationSchema } from "./types/organization";

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
