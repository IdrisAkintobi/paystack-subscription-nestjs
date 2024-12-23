import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaystackWebhookGuard implements CanActivate {
    constructor(private readonly config: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const secret = this.config.get<string>('PAYSTACK_SECRET');

        const signature = request.headers['x-paystack-signature'];
        if (!signature) {
            throw new UnauthorizedException('No signature provided');
        }

        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex');

        const signatureBuffer = Buffer.from(signature);
        const hashBuffer = Buffer.from(hash);

        try {
            const isValid =
                signatureBuffer.length === hashBuffer.length && crypto.timingSafeEqual(signatureBuffer, hashBuffer);

            if (!isValid) {
                throw new UnauthorizedException('Invalid signature');
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid signature');
        }
    }
}
