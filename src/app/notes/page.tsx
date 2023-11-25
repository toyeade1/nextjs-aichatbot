import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

// we will be changing the metadata on the different pages so that they say different things when you click on them
export const metadata: Metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  // make sure we are getting the correct user before showing any notes
  const { userId } = auth();

  if (!userId) {
    throw Error("UserId Undefined");
  }

  // bringing all the notes where the userid is the id passed
  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        // We always need to add a key
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any notes yet. Why don't you make some"}
        </div>
      )}
    </div>
  );
}
