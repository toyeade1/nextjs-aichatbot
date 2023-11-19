import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next"

// we will be changing the metadata on the different pages so that they say different things when you click on them
export const metadata: Metadata = {
    title: "Notes",
}

export default async function NotesPage() {

    const {userId} = auth();

    if (!userId) {
        throw Error("UserId Undefined")
    }

    // bringing all the notes where the userid is the id passed
    const allNotes = await prisma.note.findMany({where: {userId}})
    

    return <div>{JSON.stringify(allNotes)}</div>
}