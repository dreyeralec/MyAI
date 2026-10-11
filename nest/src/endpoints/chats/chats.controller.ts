//Nest
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    ParseIntPipe,
    Delete
} from "@nestjs/common";

//Service
import { ChatsService } from "./chats.service";

//Firebase
import { FirebaseAuthGuard } from "src/auth/firebase.auth-guard";

@Controller('chats')
export class ChatsController {
    constructor (private readonly chatsService: ChatsService) {}

    /**
     * Send the message to the model and get response
     * 
     * @param session_id - session the message belongs to
     * @param content - content for the message
     * @returns message object of the models response
    */
    @Post('model')
    getModelResponse(@Body() body: { session_id: number; content: string }) {
        return this.chatsService.getModelResponse(body.session_id, body.content);
    }

    /**
     * Find sessions by a user
     * 
     * @param user_id - user the sessions belong to
     * @returns sessions belonging to user
    */
    @Get('user/:id')
    findSessionsByUserId(@Param('id', ParseIntPipe) user_id: number) {
        return this.chatsService.findSessionsByUserId(user_id);
    }

    /**
     * Find a session by its id
     * 
     * @param session_id - session id of session being searched for
     * @returns session object that was found
    */
    @Get('messages')
    findMessagesBySessionId(
        @Query('session_id') session_id: string,
        @Query('take') take: string )
    {
        return this.chatsService.findBySessionId(session_id, take)
    }

    /**
     * Find sessions using provided prompt id
     * 
     * @param prompt_id - prompt the sessions belong to
     * @returns sessions belonging to prompt
    */
    @Get('session/prompt/:pid')
    findSessionsByPromptId(@Param('pid', ParseIntPipe) prompt_id: number) {
        return this.chatsService.findSessionsByPromptId(prompt_id);
    }

    /**
     * Create a session
     * 
     * @param user_id - user the session belongs to
     * @param title - title of session
     * @param prompt - prompt the session is using
     * @returns sessions belonging to user
    */
    @Post('session')
    createSession(@Body() body: { user_id: number; title: string; prompt_id: number }) {
        return this.chatsService.createSession(body.user_id, body.title, body.prompt_id);
    }

    /**
     * Delete a session
     * 
     * @param session_id - session that is being deleted
     * @param user_id - user the session belongs to
     * @returns session object that was deleted
    */
    @Delete(':id')
    delete(@Body() body: {session_id: number; user_id: number}) {
        return this.chatsService.deleteSession(body.session_id, body.user_id);
    }
}