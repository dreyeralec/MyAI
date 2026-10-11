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

    /**
     * Calls repository to create a user
     * 
     * @param firebase_uuid - firebase uuid of user
     * @param username - username of user
     * @param email - email of user
     * @throws {BadRequestException}
     * @returns user object created
    */
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

    /**
     * Calls repository to delete a user
     * 
     * @param user_id - id of user to be deleted
     * @throws {BadRequestException}
     * @returns user object deleted
    */
    delete(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        return this.usersRepository.delete(user_id);
    }

    /**
     * Calls repository to find a user from id passed
     * 
     * @param user_id - id of user to be searched for
     * @throws {BadRequestException}
     * @returns user object found from provided id
    */
    findById(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.usersRepository.findById(user_id)
    }

    /**
     * Calls repository to find a user from firebase uuid passed
     * 
     * @param firebase_uuid - firebase uuid of user to be searched for
     * @throws {BadRequestException}
     * @returns user object found from provided id
    */
    findByFirebaseUuid(firebase_uuid: string) {
        if (!firebase_uuid || !this.FIREBASE_UID_REGEX.test(firebase_uuid)) {
            throw new BadRequestException('Invalid firebase uuid');
        }

        return this.usersRepository.findByFirebaseUuid(firebase_uuid)
    }

    /**
     * Calls repository to find a user from email passed
     * 
     * @param email - email of user to be searched for
     * @throws {BadRequestException}
     * @returns user object found from provided email
    */
    findByEmail(email: string) {
        if (!email || !this.EMAIL_REGEX.test(email)) {
            throw new BadRequestException('Invalid email');
        }

        return this.usersRepository.findByEmail(email)
    }

    /**
     * Calls repository to find a user from username passed
     * 
     * @param username - username of user to be searched for
     * @throws {BadRequestException}
     * @returns user object found from provided username
    */
    findByUsername(username: string) {
        if (!username || !this.USERNAME_REGEX.test(username)) {
            throw new BadRequestException('Invalid email');
        }

        return this.usersRepository.findByUsername(username)
    }
}