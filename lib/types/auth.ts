import { object, string, z } from "zod";

export const SIGNINSCHEMA = object({
    email: string({ required_error: "Username or Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export type SIGNINFORMTYPE = z.infer<typeof SIGNINSCHEMA>;

export const SIGNUPSCHEMA = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    name: string({ required_error: "Name is required" })
        .min(1, "UserName is required")
        .max(32, "UserName must be less than 32 characters"),
});

export type SIGNUPFORMTYPE = z.infer<typeof SIGNUPSCHEMA>;


export const CREATEORGSCHEMA = object({
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .max(32, "Name must be less than 32 characters"),
    slug: string({ required_error: "Slug is required" })
        .min(1, "Slug is required")
        .max(10, "Slug must be less than 10 characters"),
});

export type CREATEORGFORMTYPE = z.infer<typeof CREATEORGSCHEMA>;
