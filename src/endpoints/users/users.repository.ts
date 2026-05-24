//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    create(firebase_uuid: string, username: string, email: string) {
        return this.prisma.users.create({
            data: { 
                firebase_uuid: firebase_uuid,
                username: username,
                email: email,
            }
        });
    }

    //delete
    delete(user_id: number) {
        return this.prisma.users.delete({
            where: { user_id: user_id }
        });
    }

    //find by user_id
    findById(user_id: number) {
        return this.prisma.users.findUnique({
            where: { user_id: user_id }
        });
    }

    //find by firebase_uuid
    findByFirebaseUuid(firebase_uuid: string) {
        return this.prisma.users.findUnique({
            where: { firebase_uuid: firebase_uuid }
        });
    }

    //find by email
    findByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: { email: email }
        });
    }

    //find by username
    findByUsername(username: string) {
        return this.prisma.users.findUnique({
            where: { username: username }
        });
    }
}