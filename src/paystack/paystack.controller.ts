import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { PaystackPaymentSessionDTO } from 'src/types/dtos';
import { PaystackWebhookPayload } from '../types/paystack-api-types';
import { PaystackWebhookGuard } from './paystack-webhook.guard';
import { PaystackService } from './paystack.service';

@Controller('paystack')
export class PaystackController {
    constructor(@Inject(PaystackService) private readonly paystackService: PaystackService) {}

    @Post('/create')
    async createPaymentSession(@Body() body: PaystackPaymentSessionDTO) {
        return await this.paystackService.createPaymentSession(body);
    }

    @UseGuards(PaystackWebhookGuard)
    @Post('/webhook-events')
    async handleWebhookEvents(@Body() body: PaystackWebhookPayload) {
        return await this.paystackService.handleWebhookEvents(body);
    }
}
