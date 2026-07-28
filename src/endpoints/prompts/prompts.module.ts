//Nest
import { Module } from '@nestjs/common';

//Repository
import { PromptsRepository } from './prompts.repository';

//Sessions Repository
import { SessionsRepository } from '../chats/repos/sessions.repository';

//Service
import { PromptsService } from './prompts.service';

//Controller
import { PromptsController } from './prompts.controller';

//Prisma
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Module({
    controllers: [PromptsController],
    providers: [PrismaService, PromptsService, PromptsRepository, SessionsRepository],
})

export class PromptsModule { }