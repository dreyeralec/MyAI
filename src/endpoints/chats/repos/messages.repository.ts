//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
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

    //delete
    delete(message_id: number) {
        return this.prisma.chat_messages.delete({
            where: {
                message_id: message_id,
            }
        });
    }

    //find by message_id
    findById(message_id: number) {
        return this.prisma.chat_messages.findUnique({
            where: {
                message_id: message_id,
            }
        });
    }

    //find by session_id
    findBySessionId(session_id: number, take: number) {
        return this.prisma.chat_messages.findMany({
            take: take,
            where: {
                session_id: session_id,
            }
        });
    }

}