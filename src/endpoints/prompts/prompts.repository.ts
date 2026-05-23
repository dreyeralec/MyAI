//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class PromptsRepository {
    constructor(private readonly prisma: PrismaService) {}

    //find all
    findAll() {
        return this.prisma.prompt.findMany();
    }

    //find all by user_id
    findAllByUserId(user_id: number) {
        return this.prisma.prompt.findMany({
            where: { user_id: user_id }
        });
    }

    //find by prompt_id
    findById(prompt_id: number) {
        return this.prisma.prompt.findUnique({
            where: { prompt_id: prompt_id },
        });
    }

    //create
    create(user_id: number, name: string, prompt: string) {
        return this.prisma.prompt.create({
            data: { user_id: user_id, name: name, prompt: prompt }
        })
    }

    //delete
    delete(prompt_id: number) {
        return this.prisma.prompt.delete({
            where: { prompt_id: prompt_id }
        })
    }
}