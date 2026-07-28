//service is called by controller, holds business logic and calls the repository

//Nest
import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";

//Repository
import { PromptsRepository } from "./prompts.repository";

//Sessions repository
import { SessionsRepository } from "../chats/repos";

@Injectable()
export class PromptsService {
    constructor(
        private readonly promptsRepository: PromptsRepository,
        private readonly sessionsRepository: SessionsRepository,
    ) {}

    //find all
    findAll() {
        return this.promptsRepository.findAll();
    }

    //find unique
    findById(prompt_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.promptsRepository.findById(prompt_id);
    }

    //find al by user
    findAllByUserId(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.promptsRepository.findAllByUserId(user_id);
    }

    //create
    create(user_id: number, name: string, prompt: string) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        if (!prompt || prompt.trim().length < 5) {
            throw new BadRequestException('Invalid prompt');
        }

        return this.promptsRepository.create(user_id, name, prompt);
    }

    //delete
    async delete(prompt_id: number, user_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException('Invalid prompt id');
        }

        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        const prompt = await this.promptsRepository.findById(prompt_id);

        if (!prompt) {
            throw new BadRequestException("Prompt not found");
        }

        if (prompt.user_id !== user_id) {
            throw new ForbiddenException("User does not own this prompt");
        }

        const sessions = await this.sessionsRepository.findByPromptId(prompt_id);

        if (sessions.length > 0) {
            throw new ForbiddenException("Agent still has active chat history");
        }

        return this.promptsRepository.delete(prompt_id);
    }
}