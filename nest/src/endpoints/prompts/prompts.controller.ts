//controller holds the routes and calls the service

//Nest
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";

//Service
import { PromptsService } from "./prompts.service";

//Firebase
import { FirebaseAuthGuard } from "src/auth/firebase.auth-guard";

@Controller('prompts')
export class PromptsController {
    constructor(private readonly promptsService: PromptsService) {}

    /**
     * Retrieve a prompt by prompt id
     * 
     * @param prompt_id - prompt id to look for
     * @returns prompt object found
    */
    @Get(':id')
    findById(@Param('id') prompt_id: number) {
        return this.promptsService.findById(Number(prompt_id));
    }

    /**
     * Retrieve prompts belonging to user
     * 
     * @param user_id - user id to search for prompts belonging to
     * @returns prompt objects found belonging to the provided user
    */
    @Get('user/:id')
    findAllByUserId(@Param('id') user_id: number) {
        return this.promptsService.findAllByUserId(Number(user_id))
    }

    /**
     * Creates a prompt
     * 
     * @param user_id - user prompt belongs to
     * @returns prompt object found belonging to provided user
    */
    @Post()
    create(@Body() body: { user_id: number; name: string; prompt: string }) {
        return this.promptsService.create(body.user_id, body.name, body.prompt);
    }

    /**
     * Delete a prompt
     * 
     * @param prompt_id — prompt to be deleted
     * @param user_id — user the prompt belongs to
     * @returns prompt object deleted
    */
    @Delete(':id')
    delete(@Body() body: { prompt_id: number; user_id: number }) {
        return this.promptsService.delete(Number(body.prompt_id), Number(body.user_id));
    }
}