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

    //create
    @Post()
    create(@Body() body: { firebase_uuid: string; username: string; email: string }) {
        return this.usersService.create(body.firebase_uuid, body.username, body.email);
    }

    //delete
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.usersService.delete(id);
    }

    //find by id
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.usersService.findById(id);
    }

    //find by firebase uuid
    @Get(':id')
    findByFirebaseUuid(@Param('id') id: string) {
        return this.usersService.findByFirebaseUuid(id);
    }

    //find by email
    @Get(':email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    //find by username
    @Get(':username')
    findByUsername(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }
}