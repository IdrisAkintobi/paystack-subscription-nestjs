import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { PaystackEvents } from 'src/types/enums';
import { PaystackPaymentSessionResult, PaystackWebhookPayload } from 'src/types/paystack-api-types';
import { PaystackPaymentSessionDTO } from '../types/dtos';
import { PaystackClient } from './paystack-client';

@Injectable()
export class PaystackService {
    private readonly logger: Logger;

    constructor(@Inject(PaystackClient) private readonly client: PaystackClient) {
        this.logger = new Logger('PAYSTACK SERVICE');
    }

    public async createPaymentSession(
        paymentSession: PaystackPaymentSessionDTO,
    ): Promise<PaystackPaymentSessionResult> {
        this.logger.localInstance;
        if (!paymentSession.planId) {
            throw new BadRequestException('Paystack Plan ID is required');
        }

        if (!paymentSession.transactionId) {
            throw new BadRequestException('transaction ID is required');
        }

        const customer = await this.client.createCustomer(paymentSession.customer);

        const activeSubscriptionResult = await this.client.listSubscriptions(customer.email);

        if (activeSubscriptionResult) {
            throw new BadRequestException('customer already has an active subscription');
        }

        const subscriptionResponse = await this.client.initializeTransaction(
            paymentSession.customer.email,
            paymentSession.planId,
            paymentSession.transactionId,
        );

        return subscriptionResponse;
    }

    // In our implementation, the customer can only be subscribed to a plan at a time.
    //There will only be one active subscription for a customer and they can cancel it if they want to subscribe to another plan.
    public async cancelSubscription(email: string): Promise<void> {
        const customerSubscriptions = await this.client.listSubscriptions(email);
        if (!customerSubscriptions) {
            throw new BadRequestException('User have no active subscription');
        }

        const activeSubscriptions = customerSubscriptions[0];
        await this.client.cancelSubscription(activeSubscriptions.subscription_code, activeSubscriptions.email_token);
    }

    async handleWebhookEvents(payload: PaystackWebhookPayload): Promise<void> {
        const { event, data } = payload;

        switch (event) {
            case PaystackEvents.PAYMENT_SUCCESSFUL:
                // Get the planId and transactionId from the reference
                const [planId, transactionId] = data.reference.split('__');
                this.logger.log(`New Paystack subscription with transaction Id: ${transactionId}`);

                // Check if subscription is already existing, if not create subscription for customer
                const activeSubscriptionResult = await this.client.listSubscriptions(data.customer.email);
                if (!activeSubscriptionResult) {
                    await this.client.createSubscription(data.customer.customer_code, planId);
                }

                return;
            case PaystackEvents.SUBSCRIPTION_CREATE:
                this.logger.log(`Subscription created for user : ${data.customer.customer_code}`);
                return;

            default:
                this.logger.warn(`Unhandled paystack event.`, JSON.stringify({ event, data }));
                break;
        }
    }
}
