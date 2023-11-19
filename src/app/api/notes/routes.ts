import { createnoteSchema } from "@/lib/Validation/note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";

export async function POST(req:Request) {
    try {
        const body = await req.json();

        // we are passing the body through the validation schema we have to see if it returns an error
        const parseResult = createnoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return Response.json({error: "Invalid Input"}, {status: 400})
        }

        const {title, content} = parseResult.data;

        const {userId} = auth()

        if (!userId) {
            return Response.json({error: "UnAuthorized"}, {status: 401});
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId
            }
        })

        return Response.json({note}, {status:201})

    }
    catch (err) {
        console.error(err);
        return Response.json({error: "Internal Server Error"}, {status: 500});
}
}