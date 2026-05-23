//Nest
import { Module } from '@nestjs/common';

//Repository
import { UsersRepository } from './users.repository';

//Service
import { UsersService } from './users.service';

//Controller
import { UsersController } from './users.controller';

//Prisma
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Module({
    controllers: [UsersController],
    providers: [PrismaService, UsersService, UsersRepository],
})

export class UsersModule { }