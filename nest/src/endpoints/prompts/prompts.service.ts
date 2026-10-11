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

    /**
     * Calls repository to retrieve a prompt by prompt id
     * 
     * @param prompt_id - prompt id to look for
     * @throws {BadRequestException}
     * @returns prompt object found
    */
    findById(prompt_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.promptsRepository.findById(prompt_id);
    }

    /**
     * Calls repository to retrieve prompts belonging to user
     * 
     * @param user_id - user id to search for prompts belonging to
     * @throws {BadRequestException}
     * @returns prompt objects belonging to provided user
    */
    findAllByUserId(user_id: number) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.promptsRepository.findAllByUserId(user_id);
    }

    /**
     * Calls repository to create a prompt
     * 
     * @param user_id - user prompt belongs to
     * @param name - name of prompt
     * @param prompt - content of prompt
     * @throws {BadRequestException}
     * @returns prompt object created
    */
    create(user_id: number, name: string, prompt: string) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        if (!prompt || prompt.trim().length < 5) {
            throw new BadRequestException('Invalid prompt');
        }

        return this.promptsRepository.create(user_id, name, prompt);
    }

    /**
     * Calls repository to delete a prompt,
     * fails if the prompt has active sessions
     * 
     * @param prompt_id - prompt to be deleted
     * @param user_id - user the prompt belongs to
     * @throws {BadRequestException, ForbiddenException}
     * @returns prompt object deleted
    */
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