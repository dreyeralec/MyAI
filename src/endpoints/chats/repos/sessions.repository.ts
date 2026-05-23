//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class SessionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    async create(user_id: number, title: string, prompt_id: number) {
        return this.prisma.chat_sessions.create({
            data: {
                user_id: user_id,
                title: title,
                prompt_id: prompt_id,
            }
        });
    }

    //delete
    async delete(session_id: number) {
        return this.prisma.chat_sessions.delete({
            where: {
                session_id: session_id,
            }
        });
    }

    //find by session_id
    async findById(session_id: number) {
        return this.prisma.chat_sessions.findUnique({
            where: {
                session_id: session_id,
            }
        });
    }

    //find by user_id
    async findByUserId(user_id: number) {
        return this.prisma.chat_sessions.findMany({
            where: {
                user_id: user_id,
            }
        });
    }

}