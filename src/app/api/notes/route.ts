import {
  DeleteNoteSchema,
  UpdateNoteSchema,
  createnoteSchema,
} from "@/lib/Validation/note";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // we are passing the body through the validation schema we have to see if it returns an error
    const parseResult = createnoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "UnAuthorized" }, { status: 401 });
    }

    // here we are creating the embedding for the new note object
    // before creating it in the database
    const embedding = await getEmbeddingForNote(title, content);

    // because we will want to make sure things go wll before adding to the
    // database we will use the prisma transaction method

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      /* it is important that we put the pinecone operation after the
      mongodb oepration becuas by definition of the transaction if the mongodb
      one fails then we will not get to the pinecone transaction which is good,
    and if the pinecone fails then we will roll back the mongodb automatically
      */
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });
    return Response.json({ note }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// creating the put request for changing notes
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // we are passing the body through the validation schema we have to see if it returns an error
    const parseResult = UpdateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not Found" }, { status: 404 });
    }

    const { userId } = auth();

    // checkinh to make sure the user is logged in but also that the logged in user is the one that create the note
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "UnAuthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//creating the delete endpoint
// creating the put request for changing notes
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    // we are passing the body through the validation schema we have to see if it returns an error
    const parseResult = DeleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not Found" }, { status: 404 });
    }

    const { userId } = auth();

    // checkinh to make sure the user is logged in but also that the logged in user is the one that create the note
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "UnAuthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id },
      });
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
