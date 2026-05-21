//Nest
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException, 
    Inject
} from '@nestjs/common';

//Firebase
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(
        @Inject('FIREBASE_ADMIN')
        private firebaseApp: admin.app.App
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing token');
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            const decoded = await this.firebaseApp.auth().verifyIdToken(token);
            request.user = decoded;

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}