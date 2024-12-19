import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { SignupForm } from "@/components/auth/sign-up-form";

const title = "Create an account";
const description = "Enter your details to get started.";

const SignUpPage = () => (
  <>
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <SignupForm />
    <div className="flex flex-col space-y-2 text-center">
      <p>
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign in
        </Link>
      </p>
    </div>
  </>
);

export default SignUpPage;
