import { Global, Module } from '@nestjs/common';
import { FirebaseProvider } from './firebase.providers';

@Global()
@Module({
    providers: [FirebaseProvider],
    exports: [FirebaseProvider],
})

export class FirebaseModule { }