//controller holds the routes and calls the service

//Nest
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";

//Service
import { UsersService } from "./users.service";

//Firebase
import { FirebaseAuthGuard } from "src/auth/firebase.auth-guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Creates a user
     * 
     * @param firebase_uuid - firebase id for the user
     * @param username - username of the user
     * @param email - email address of the user
     * @returns user object created
    */
    @Post()
    create(@Body() body: { firebase_uuid: string; username: string; email: string }) {
        return this.usersService.create(body.firebase_uuid, body.username, body.email);
    }

    /**
     * Deletes a user
     * 
     * @param user_id - user to be deleted
     * @returns user object deleted
    */
    @Delete(':id')
    delete(@Param('id') user_id: number) {
        return this.usersService.delete(user_id);
    }

    /**
     * Finds a use by user id
     * 
     * @param user_id - user id of user being searched for
     * @returns user object found
    */
    @Get(':id')
    findById(@Param('id') user_id: number) {
        return this.usersService.findById(user_id);
    }

    /**
     * Finds a user by firebase uuid
     * 
     * @param firebase_uuid - firebase user id of user being searched for
     * @returns user object found
    */
    @Get(':id')
    findByFirebaseUuid(@Param('id') firebase_uuid: string) {
        return this.usersService.findByFirebaseUuid(firebase_uuid);
    }

    /**
     * Finds a user by email
     * 
     * @param email - email of the user being searched for
     * @returns user object found
    */
    @Get(':email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    /**
     * Finds a user by username
     * 
     * @param username - username of user being searched for
     * @returns user object found
    */
    @Get(':username')
    findByUsername(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }
}