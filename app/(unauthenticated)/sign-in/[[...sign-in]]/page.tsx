import { SigninForm } from "@/components/auth/sign-in-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const title = "Welcome back";
const description = "Enter your details to sign in.";

const SignInPage = () => (
  <>
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <SigninForm />
    <div className="flex flex-col space-y-2 text-center">
      <p>
        Do not have an account?{" "}
        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Sign up
        </Link>
      </p>
    </div>
  </>
);

export default SignInPage;
