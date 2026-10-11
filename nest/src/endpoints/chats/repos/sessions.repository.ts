//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class SessionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Creates a session in the database
     * 
     * @param user_id - user the session belongs to
     * @param title - title of the session
     * @param prompt_id - prompt the session is using
     * @returns session object created
     */
    async create(user_id: number, title: string, prompt_id: number) {
        return this.prisma.chat_sessions.create({
            data: {
                user_id: user_id,
                title: title,
                prompt_id: prompt_id,
            }
        });
    }

    /**
     * Deletes a session in the database
     * 
     * @param session_id - session to be deleted
     * @returns session object deleted
     */
    async delete(session_id: number) {
        return this.prisma.chat_sessions.delete({
            where: {
                session_id: session_id,
            }
        });
    }

    /**
     * Find a session in the database
     * 
     * @param session_id - session being searched for
     * @returns session object that was found
     */
    async findById(session_id: number) {
        return this.prisma.chat_sessions.findUnique({
            where: {
                session_id: session_id,
            }
        });
    }

    /**
     * Finds session in the database from a user id
     * 
     * @param user_id - user the sessions belong to
     * @returns session objects belonging to user
     */
    async findByUserId(user_id: number) {
        return this.prisma.chat_sessions.findMany({
            where: {
                user_id: user_id,
            }
        });
    }

    /**
     * Finds sessions from a prompt
     * 
     * @param prompt_id - prompt the sessions are using
     * @returns session objects using this prompt
     */
    async findByPromptId(prompt_id: number) {
        return this.prisma.chat_sessions.findMany({
            where: {
                prompt_id: prompt_id,
            }
        });
    }

    /**
     * Updates updated_at timestamp for session
     * 
     * @param session_id - session to be updated
     * @returns session object updated
     */
    async updateTimestamp(session_id: number) {
        return this.prisma.chat_sessions.update({
            data: {
                updated_at: new Date(),
            },
            where: {
                session_id: session_id,
            },
        });
    }
}