import { CreateNoteSchema, createnoteSchema } from "@/lib/Validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  //we will need to create our own state for when a delete is happening
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // this is being used to refresh the page after every note is added so it can show up in the UI
  const router = useRouter();

  // useform is used to configure the form validation
  const form = useForm<CreateNoteSchema>({
    // this is being used as a global validation schema for the notes inputs
    resolver: zodResolver(createnoteSchema),
    // adding defaultvalues so the values are not undefined
    //checking to see if the notetoEdit contains a note and if it does we will populate the inputs
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  // here we are
  async function onSubmit(input: CreateNoteSchema) {
    try {
      //check to see if we are updating a note
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input
          })
        })

        if (!response.ok) throw Error("Status code: " + response.status);

      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) throw Error("Status code: " + response.status);

        // if the status is ok, then we will reset the form and refresh the page
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again");
    }
  }

  async function deleteNote() {
  if (!noteToEdit) return;
  // setting the deleteprogress to true 
  setDeleteInProgress(true);
  try {
    const response = await fetch("api/notes", {
      method: "DELETE",
      body: JSON.stringify({
        id: noteToEdit.id
      })
    })

    if (!response.ok) throw Error("Status code: " + response.status);

    router.refresh();
    setOpen(false);

  }
  catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again");
  } finally {
    //setting the deleteInProgress back to false no matter if it is successful or not
    setDeleteInProgress(false);
  }


  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {/* Adding a delete button option */}
              {noteToEdit && (
                <LoadingButton
                variant="destructive"
                loading={deleteInProgress}
                disabled={form.formState.isSubmitting}
                onClick={() => setShowDeleteDialog(true)}
                type="button"
                >Delete Note</LoadingButton>
              )}
              {/* the laoding will returin true until the onsubmit function is done  */}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    <DeleteDialog
    open={showDeleteDialog}
    setOpen={setShowDeleteDialog}
    noteToEdit={noteToEdit}
    />
    </>
  );
}
