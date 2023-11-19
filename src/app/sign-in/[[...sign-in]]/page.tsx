import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next"

// we will be changing the metadata on the different pages so that they say different things when you click on them
export const metadata: Metadata = {
    title: "Sign In",
}

export default function SignInPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <SignIn appearance={{variables: {colorPrimary: "#0F172A"}}} />
        </div>
    )
}