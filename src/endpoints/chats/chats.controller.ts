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
    @Post('model')
    getModelResponse(@Body() body: { session_id: number; content: string }) {
        return this.chatsService.getModelResponse(body.session_id, body.content);
    }

    //get sessions
    @Get('user/:id')
    findSessionsByUserId(user_id: number) {
        return this.chatsService.findSessionsByUserId(user_id);
    }

    //get specific session
    @Get('session/:id')
    findSessionById(session_id: number) {
        return this.chatsService.findSessionById(session_id);
    }

    //create session
    @Post('session')
    createSession(@Body() body: { user_id: number; title: string; prompt_id: number }) {
        return this.chatsService.createSession(body.user_id, body.title, body.prompt_id);
    }
}