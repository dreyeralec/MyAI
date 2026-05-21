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
    findById(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        return this.promptsRepository.findById(id);
    }

    //create
    create(id: number, name: string, prompt: string) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        if (!prompt || prompt.trim().trim.length < 5) {
            throw new BadRequestException('Invalid prompt')
        }

        return this.promptsRepository.create(id, name, prompt);
    }

    //delete
    delete(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid userID');
        }

        return this.promptsRepository.delete(id);
    }
}