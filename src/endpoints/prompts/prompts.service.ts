//service is called by controller, holds business logic and calls the repository

//Nest
import { Injectable, BadRequestException } from "@nestjs/common";

//Repository
import { PromptsRepository } from "./prompts.repository";

@Injectable()
export class PromptsService {
    constructor(private readonly promptsRepository: PromptsRepository) {}

    //find all
    async findAll() {
        return await this.promptsRepository.findAll();
    }

    //find unique
    async findById(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return await this.promptsRepository.findById(id);
    }

    //create
    async create(id: number, name: string, prompt: string) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        if (!prompt || prompt.trim().trim.length < 5) {
            throw new BadRequestException('Invalid prompt')
        }

        return await this.promptsRepository.create(id, name, prompt);
    }

    //delete
    async delete(id: number) {
        if (!id || id < 1) {
            throw new BadRequestException('Invalid user id');
        }

        return await this.promptsRepository.delete(id);
    }
}