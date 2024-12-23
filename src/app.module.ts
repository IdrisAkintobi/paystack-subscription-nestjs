import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaystackClient } from './paystack/paystack-client';
import { PaystackController } from './paystack/paystack.controller';
import { PaystackService } from './paystack/paystack.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [AppController, PaystackController],
    providers: [AppService, PaystackService, PaystackClient],
})
export class AppModule {}
