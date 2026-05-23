/*
chats controller will have endpoints taking in the userid and validating it
then calling chats.service to add the chat
*/ 

//controller holds the routes and calls the service

//Nest
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";

//Service
import { ChatsService } from "./chats.service";

//Firebase
import { FirebaseAuthGuard } from "src/auth/firebase.auth-guard";

@Controller('chats')
export class ChatsController {
    constructor (private readonly chatsService: ChatsService) {}

    //communicate with model
    @Post()
    getModelResponse(@Body() body: { session_id: number; content: string }) {
        return this.chatsService.getModelResponse(body.session_id, body.content);
    }

    //get sessions
    @Get(':id')
    findSessionsByUserId(id: number) {
        return this.chatsService.findSessionsByUserId(id);
    }

    //get specific session
    @Get(':id')
    findSessionById(id: number) {
        return this.chatsService.findSessionById(id);
    }

    //create session
    @Post()
    createSession(@Body() body: { user_id: number; title: string; prompt_id: number }) {
        return this.chatsService.createSession(body.user_id, body.title, body.prompt_id);
    }
}