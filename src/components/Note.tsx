"use client";

import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";

// creating the interface for the note, it should be the same as the note model in the prisma client.
interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {

    //using this to toggle the state and show the note edit dialog, set it to false initially so it does not show
    const [showEditDialog, setShowEditDialog] = useState(false);
  // checking to see if the note was updated
  const wasUpdated = note.updateAt > note.createAt;

  // create a timestamp that will check to see if the wasUpdated is true and will show a differnt time depending.
  const createUpdatedAtTimeStamp = (
    wasUpdated ? note.updateAt : note.createAt
  ).toDateString();

  return (
    <>
    <Card className="cursor-pointer hover:shadow-lg transition-shadow"
    onClick={() => setShowEditDialog(true)}>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>
          {createUpdatedAtTimeStamp}
          {/* the && checks to see if the boolean before is a true or false and if it is true it will display what is after it */}
        {wasUpdated && " (Updated)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">
            {note.content}
        </p>
      </CardContent>
    </Card>
    <AddEditNoteDialog
    open={showEditDialog}
    setOpen={setShowEditDialog}
    noteToEdit={note}
    />
    </>
  );
}
