//service is called by controller, holds business logic and calls the repository

//Nest
import { Injectable, BadRequestException } from "@nestjs/common";

//Repository
import { PromptsRepository } from "./prompts.repository";

@Injectable()
export class PromptsService {
    constructor(private readonly promptsRepository: PromptsRepository) {}

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

    //create
    create(user_id: number, name: string, prompt: string) {
        if (!user_id || user_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        if (!prompt || prompt.trim().length < 5) {
            throw new BadRequestException('Invalid prompt')
        }

        return this.promptsRepository.create(user_id, name, prompt);
    }

    //delete
    delete(prompt_id: number) {
        if (!prompt_id || prompt_id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return this.promptsRepository.delete(prompt_id);
    }
}