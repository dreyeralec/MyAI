//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    async create(firebase_uuid: string, username: string, email: string) {
        return this.prisma.user.create({
            data: { 
                firebase_uuid: firebase_uuid,
                username: username,
                email: email,
            }
        });
    }

    //delete
    async delete(id: number) {
        return this.prisma.user.delete({
            where: { user_id: id }
        });
    }

    //find by user_id
    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { user_id: id }
        });
    }

    //find by firebase_uuid
    async findByFirebaseUuid(id: string) {
        return this.prisma.user.findUnique({
            where: { firebase_uuid: id }
        });
    }

    //find by email
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email: email }
        });
    }

    //find by username
    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username: username }
        });
    }
}