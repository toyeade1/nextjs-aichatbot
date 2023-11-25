"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
// import clerks dark theme library 
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes";
import AIChatButton from "@/components/AIChatButton";

export default function NavBar() {

    const {theme} = useTheme()

    const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  return (
    <>
    <div className="p-4 shadow">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/notes" className="flex items-center gap-1">
          <Image src={logo} alt="FlowBrain logo" width={40} height={40} />
          <span className="font-bold"> Toye's Note App</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              //adding the basetheme to toggle between light and dark using the global themeprovider component
              baseTheme: (theme === "dark" ? dark : undefined),
              elements: {
                avatarBox: {
                  width: "2.5rem",
                  height: "2.5rem",
                }
              },
            }}
          />
          <ThemeToggleButton />
          <Button onClick={() => setShowAddEditDialog(true)}>
            {/* The plus element is a custom icon from react and it gives the plus sign */}
            <Plus size={20} className="mr-2" />
            Add Note</Button>
          <AIChatButton />
        </div>
      </div>
    </div>
    {/* Here we are toggling the showdialog with the usestate function. it is default set to false. */}
    <AddEditNoteDialog open={showAddEditDialog} setOpen={setShowAddEditDialog} />
    </>
  );
}
