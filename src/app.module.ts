import { Module } from '@nestjs/common';
import { PromptsModule } from './lib/prisma/prompts/prompts.module';
import { FirebaseModule } from './auth/firebase.module';

@Module({
	imports: [
		PromptsModule, 
		FirebaseModule,
	],
})

export class AppModule { }
