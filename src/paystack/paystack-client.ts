import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import type { Customer } from 'src/types/dtos';
import type {
    CustomerResponseDTO,
    PaystackCustomer,
    PaystackPaymentSessionResponse,
    PaystackPaymentSessionResult,
    PlanResponse,
    SubscriptionData,
    SubscriptionResponse,
} from 'src/types/paystack-api-types';

@Injectable()
export class PaystackClient {
    private readonly httpInstance: AxiosInstance;

    private readonly checkoutSuccessUrl: string;

    private readonly logger: Logger;

    public constructor(private readonly configService: ConfigService) {
        this.httpInstance = axios.create({
            baseURL: this.configService.get('PAYSTACK_BASE_URL'),
            headers: {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
                'Content-Type': 'application/json',
            },
        });
        this.logger = new Logger('PAYSTACK CLIENT');
        this.checkoutSuccessUrl = this.configService.get('PAYSTACK_SUCCESS_URL');
    }

    async createCustomer(customerData: Customer): Promise<PaystackCustomer> {
        try {
            const { data } = await this.httpInstance.post<CustomerResponseDTO>('/customer', {
                first_name: customerData.firstName,
                last_name: customerData.lastName,
                email: customerData.email,
                phone: customerData.phoneNumber,
            });

            return data.data;
        } catch (e) {
            this.handleError(e);
        }
    }

    async findCustomerByEmail(email: string): Promise<PaystackCustomer> {
        try {
            const { data } = await this.httpInstance.get<CustomerResponseDTO>(`/customer/${email}`);
            return data.data;
        } catch (e) {
            this.handleError(e);
        }
    }

    async listSubscriptions(email: string): Promise<SubscriptionData[] | null> {
        const { subscriptions } = await this.findCustomerByEmail(email);

        return subscriptions.length ? subscriptions : null;
    }

    /**
     * This method is to initialize a charge transaction. We need to pass the amount that we want the customer to be charged.
     * Various payment method is available.
     * We concatenate the planId and transactionId as the value to the reference because we will need the planId to subscribe the user to the plan when the webhook event is received.
     */
    async initializeTransaction(
        customerEmail: string,
        planId: string,
        transactionId: string,
    ): Promise<PaystackPaymentSessionResult> {
        try {
            const planCost = await this.getPlanCost(planId);
            const { data } = await this.httpInstance.post<PaystackPaymentSessionResponse>('/transaction/initialize', {
                email: customerEmail,
                amount: planCost,
                reference: planId + '__' + transactionId,
                callback_url: this.checkoutSuccessUrl + '?' + transactionId, // This is to add the transactionId as a query parameter to the checkoutSuccessUrl
            });

            return {
                authorizationUrl: data.data.authorization_url,
                accessCode: data.data.access_code,
                reference: data.data.reference,
            };
        } catch (e) {
            this.handleError(e);
        }
    }

    /**
     * This method is to charge a customer and subscribe them to a plan.
     * Only card payment is allowed. Other payment methods can not be charged automatically
     */
    async initializeSubscription(
        customerEmail: string,
        planId: string,
        transactionId: string,
    ): Promise<PaystackPaymentSessionResult> {
        try {
            const { data } = await this.httpInstance.post<PaystackPaymentSessionResponse>('/transaction/initialize', {
                email: customerEmail,
                plan: planId,
                reference: transactionId,
                callback_url: this.checkoutSuccessUrl + '?' + transactionId,
            });

            return {
                authorizationUrl: data.data.authorization_url,
                accessCode: data.data.access_code,
                reference: data.data.reference,
            };
        } catch (e) {
            this.handleError(e);
        }
    }

    async getSubscription(id: string): Promise<SubscriptionData> {
        try {
            const { data } = await this.httpInstance.get<SubscriptionResponse>(`/subscription/${id}`);
            return data.data;
        } catch (e) {
            this.handleError(e);
        }
    }

    async createSubscription(customerId: string, planId: string): Promise<void> {
        try {
            await this.httpInstance.post<SubscriptionResponse>('/subscription/', {
                customer: customerId,
                plan: planId,
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    async cancelSubscription(subCode: string, emailToken: string): Promise<void> {
        try {
            await this.httpInstance.post(`/subscription/disable`, {
                code: subCode,
                token: emailToken,
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    /**
     * This is a function to get the cost of a plan.
     * For simplicity a map can be used but we want a single source of truth.
     */
    private async getPlanCost(id: string): Promise<string> {
        try {
            const { data } = await this.httpInstance.get<PlanResponse>(`/plan/${id}`);
            return data.data.amount.toString();
        } catch (e) {
            if (axios.isAxiosError(e)) {
                this.handleError(e);
            }
        }
    }

    private handleError(e: Error) {
        if (axios.isAxiosError(e)) {
            const response = e.response?.data as Record<string, unknown>;
            this.logger.warn('Paystack API error', JSON.stringify(response));
            throw new BadRequestException(response.message || 'Paystack API error');
        }
        throw new InternalServerErrorException((e as Error).message);
    }
}
