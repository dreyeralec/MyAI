//service is called by controller, holds business logic and calls the repository

//Nest
import { Injectable, BadRequestException } from "@nestjs/common";

//Repository
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    //variables for testing inputs
    FIREBASE_UID_REGEX = /^[A-Za-z0-9_-]{10,128}$/;
    EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    USERNAME_REGEX = /^[a-zA-Z0-9]+$/;

    //create
    create(firebase_uuid: string, username: string, email: string) {
        if (!firebase_uuid || !username || !email) {
            throw new BadRequestException('Missing parameters');
        }

        if (!this.FIREBASE_UID_REGEX.test(firebase_uuid)) {
            throw new BadRequestException('Invalid firebase uuid');
        }

        if (!this.EMAIL_REGEX.test(email)) {
            throw new BadRequestException('Invalid email');
        }

        if (username.length < 3 || !this.USERNAME_REGEX.test(username)) {
            throw new BadRequestException('Invalid username');
        }

        return this.usersRepository.create(firebase_uuid, username, email);
    }

    //delete
    delete(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        return this.usersRepository.delete(id);
    }

    //find by user_id
    findById(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        return this.usersRepository.findById(id)
    }

    //find by firebase_uuid
    findByFirebaseUuid(id: string) {
        if (!id || !this.FIREBASE_UID_REGEX.test(id)) {
            throw new BadRequestException('Invalid firebase uuid');
        }

        return this.usersRepository.findByFirebaseUuid(id)
    }

    //find by email
    findByEmail(email: string) {
        if (!email || !this.EMAIL_REGEX.test(email)) {
            throw new BadRequestException('Invalid email');
        }

        return this.usersRepository.findByEmail(email)
    }

    //find by username
    findByUsername(username: string) {
        if (!username || !this.USERNAME_REGEX.test(username)) {
            throw new BadRequestException('Invalid email');
        }

        return this.usersRepository.findByUsername(username)
    }
}