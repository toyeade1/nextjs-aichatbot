import {z} from "zod";

//using the Zod library for validation
export const createnoteSchema = z.object({
    title: z.string().min(1, {message: "Title is Required"}),
    content: z.string().optional(),
})

export type CreateNoteSchema = z.infer<typeof createnoteSchema>

export const UpdateNoteSchema = createnoteSchema.extend({
    id: z.string().min(1),
})

export const DeleteNoteSchema = z.object({
    id: z.string().min(1),
})