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

    //find all
    @Get()
    //@UseGuards(FirebaseAuthGuard)
    findAll() {
        return this.promptsService.findAll();
    }

    //find unique
    @Get(':id')
    findById(@Param('id') prompt_id: string) {
        return this.promptsService.findById(Number(prompt_id));
    }

    //create
    @Post()
    create(@Body() body: { user_id: number; name: string; prompt: string }) {
        return this.promptsService.create(body.user_id, body.name, body.prompt);
    }

    //delete
    @Delete(':id')
    delete(@Param('id') prompt_id: number) {
        return this.promptsService.delete(Number(prompt_id));
    }
}