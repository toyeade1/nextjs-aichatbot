import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // the openai ai expects an arraty of messages to be passed in the body
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    // here we are turing the messaages into one string and truncating them
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    // make sure the user is logged in
    const { userId } = auth();

    if (!userId) {
      return Response.json(
        {
          error: "UnAuthorizedUser",
        },
        { status: 401 },
      );
    }

    //
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    // prisma
    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found:", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note taking app named TboyAI. You answer the user's questions based on their exsisting notes." +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content} `)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [systemMessage, ...messagesTruncated]
    })

    // here we are getting the response from the API one character at a time and updating it into the stream variable
    const stream = OpenAIStream(response)
    // we are then returning the response stream in real time 
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
