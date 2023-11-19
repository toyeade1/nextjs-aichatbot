import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  // checking to see if we are logged in ang have a user id so we skip this page entirely
  const {userId} = auth();
  // redirecting if the user exists
  if (userId) redirect("/notes")

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="FlowBrain logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Toye's Notes App
        </span>
      </div>
      <p className="max-w-prose text-center">
        An Intelligent Note Taking App with AI integration, built with OpenAI,
        PineCone, Next.js, Shadcn, Clerk, and more.
      </p>
      <Button asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
