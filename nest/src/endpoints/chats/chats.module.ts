//Nest
import { Module } from '@nestjs/common';

//Repositories
import { MessagesRepository, SessionsRepository } from './repos';

//Service
import { ChatsService } from './chats.service';

//Controller
import { ChatsController } from './chats.controller';

//Prisma
import { PrismaService } from 'src/lib/prisma/prisma.service';

//Prompts
import { PromptsRepository } from '../prompts/prompts.repository';

@Module({
    controllers: [ChatsController],
    providers: [PrismaService, ChatsService, MessagesRepository, SessionsRepository, PromptsRepository],
})

export class ChatsModule { }