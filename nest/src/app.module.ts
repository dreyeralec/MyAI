import { Module } from '@nestjs/common';
import { PromptsModule } from './endpoints/prompts/prompts.module';
import { FirebaseModule } from './auth/firebase.module';
import { UsersModule } from './endpoints/users/users.module';
import { ChatsModule } from './endpoints/chats/chats.module';

@Module({
	imports: [
		PromptsModule, 
		UsersModule,
		ChatsModule,
		FirebaseModule,
	],
})

export class AppModule { }
