import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit: any;

}
export default function DeleteDialog({ open, setOpen, noteToEdit }: DeleteDialogProps) {
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const router = useRouter();


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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>Are you sure you want to delete this note</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* Adding a delete button option */}
            <LoadingButton
              variant="destructive"
              loading={deleteInProgress}
              type="button"
              onClick={deleteNote}
            >
              Yes 
            </LoadingButton>
          {/* the laoding will returin true until the onsubmit function is done  */}
          <Button
          onClick={() => setOpen(false)}
            type="button"
            disabled={deleteInProgress}
          >
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
