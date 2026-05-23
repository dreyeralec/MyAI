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
        return this.prisma.users.create({
            data: { 
                firebase_uuid: firebase_uuid,
                username: username,
                email: email,
            }
        });
    }

    //delete
    async delete(user_id: number) {
        return this.prisma.users.delete({
            where: { user_id: user_id }
        });
    }

    //find by user_id
    async findById(user_id: number) {
        return this.prisma.users.findUnique({
            where: { user_id: user_id }
        });
    }

    //find by firebase_uuid
    async findByFirebaseUuid(firebase_uuid: string) {
        return this.prisma.users.findUnique({
            where: { firebase_uuid: firebase_uuid }
        });
    }

    //find by email
    async findByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: { email: email }
        });
    }

    //find by username
    async findByUsername(username: string) {
        return this.prisma.users.findUnique({
            where: { username: username }
        });
    }
}