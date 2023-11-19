import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next"

// we will be changing the metadata on the different pages so that they say different things when you click on them
export const metadata: Metadata = {
    title: "Sign Up",
}

export default function SignUpPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <SignUp appearance={{variables: {colorPrimary: "#0F172A"}}} />
        </div>
    )
}