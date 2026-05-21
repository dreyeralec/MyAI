//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class PromptsRepository {
    constructor(private readonly prisma: PrismaService) {}

    //find all
    async findAll() {
        return this.prisma.prompt.findMany();
    }

    //find all by user_id
    async findAllByUserId(id: number) {
        return this.prisma.prompt.findMany({
            where: { user_id: id }
        });
    }

    //find by prompt_id
    async findById(id: number) {
        return this.prisma.prompt.findUnique({
            where: { prompt_id: id },
        });
    }

    //create
    async create(id: number, name: string, prompt: string) {
        return this.prisma.prompt.create({
            data: { user_id: id, name: name, prompt: prompt }
        })
    }

    //delete
    async delete(id: number) {
        return this.prisma.prompt.delete({
            where: { prompt_id: id }
        })
    }
}