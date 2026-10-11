//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class PromptsRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Finds all prompts belonging to a user
     * 
     * @param user_id - user to find prompts for
     * @returns prompt objects belonging to user
     */
    findAllByUserId(user_id: number) {
        return this.prisma.prompt.findMany({
            where: { user_id: user_id }
        });
    }

    /**
     * Finds a prompt by the id
     * 
     * @param prompt_id - prompt being searched for
     * @returns prompt object found
     */
    findById(prompt_id: number) {
        return this.prisma.prompt.findUnique({
            where: { prompt_id: prompt_id },
        });
    }

    /**
     * Creates a prompt in the database
     * 
     * @param user_id - user the prompt belongs to
     * @param name - name of the prompt
     * @param prompt - content of the prompt
     * @returns prompt object created
     */
    create(user_id: number, name: string, prompt: string) {
        return this.prisma.prompt.create({
            data: { user_id: user_id, name: name, prompt: prompt }
        })
    }

    /**
     * Deletes a prompt in the database
     * 
     * @param prompt_id - prompt to be deleted
     * @returns prompt object deleted
     */
    delete(prompt_id: number) {
        return this.prisma.prompt.delete({
            where: { prompt_id: prompt_id }
        })
    }
}