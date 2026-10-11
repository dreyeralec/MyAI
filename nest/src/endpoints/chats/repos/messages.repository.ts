//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Creates a message in the database
     * 
     * @param session_id - session the message was created in
     * @param role - who produced the message
     * @param content - content of the message
     * @param token_count - amount of tokens used, recieved from API call
     * @returns message object created
     */
    create(session_id: number, role: "user" | "assistant", content: string, token_count: number | null) {
        return this.prisma.chat_messages.create({
            data: {
                session_id: session_id,
                role: role,
                content: content,
                token_count: token_count,
            }
        });
    }

    /**
     * Deletes a message in the database
     * 
     * @param message_id - id of the message to be deleted
     * @returns message object deleted
     */
    delete(message_id: number) {
        return this.prisma.chat_messages.delete({
            where: {
                message_id: message_id,
            }
        });
    }

    /**
     * Returns a message row from the database
     * 
     * @param message_id - id of the message being searched for
     * @returns message object with matching id
     */
    findById(message_id: number) {
        return this.prisma.chat_messages.findUnique({
            where: {
                message_id: message_id,
            }
        });
    }

    /**
     * Returns messages from a session
     * 
     * @param session_id - session the messages belong to
     * @param take - amount of messages to be returned, not specified returns all messages
     * @returns message objects in session
     */
    findBySessionId(session_id: number, take: number | undefined = undefined) {
        return this.prisma.chat_messages.findMany({
            take: take,
            where: {
                session_id: session_id,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
}