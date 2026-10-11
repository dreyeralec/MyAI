//repository is called by the service and interacts with the database

//Nest
import { Injectable } from "@nestjs/common";

//Prisma
import { PrismaService } from "src/lib/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Creates a user in the database
     * 
     * @param firebase_uuid - firebase id for the user
     * @param username - username of the user
     * @param email - email address of the user
     * @returns user object created
    */
    create(firebase_uuid: string, username: string, email: string) {
        return this.prisma.users.create({
            data: { 
                firebase_uuid: firebase_uuid,
                username: username,
                email: email,
            }
        });
    }

    /**
     * Deletes a user in the database
     * 
     * @param user_id - user to be deleted
     * @returns user object deleted
    */
    delete(user_id: number) {
        return this.prisma.users.delete({
            where: { user_id: user_id }
        });
    }

    /**
     * Finds a user in the database by user id
     * 
     * @param user_id - user id of user being searched for
     * @returns user object found
    */
    findById(user_id: number) {
        return this.prisma.users.findUnique({
            where: { user_id: user_id }
        });
    }

    /**
     * Finds a user in the database by firebase uuid
     * 
     * @param firebase_uuid - firebase user id of user being searched for
     * @returns user object found
    */
    findByFirebaseUuid(firebase_uuid: string) {
        return this.prisma.users.findUnique({
            where: { firebase_uuid: firebase_uuid }
        });
    }

    /**
     * Finds a user in the database by email
     * 
     * @param email - email of the user being searched for
     * @returns user object found
    */
    findByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: { email: email }
        });
    }

    /**
     * Finds a user in the database by username
     * 
     * @param username - username of user being searched for
     * @returns user object found
    */
    findByUsername(username: string) {
        return this.prisma.users.findUnique({
            where: { username: username }
        });
    }
}