import { PaystackEvents } from './enums';

export type PaystackPaymentResponseData = {
    authorization_url: string;
    access_code: string;
    reference: string;
};

export type PaystackPaymentSessionResult = {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
};

export interface SubscriptionData {
    invoices: unknown[];
    customer: PaystackCustomer;
    plan: PaystackPlan;
    integration: number;
    authorization: PaystackAuthorization;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    easy_cron_id: string;
    cron_expression: string;
    next_payment_date: string;
    open_invoice: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionResponse {
    status: boolean;
    message: string;
    data: SubscriptionData;
}

export interface SubscriptionListResponse {
    status: boolean;
    message: string;
    data: SubscriptionData[];
    meta: PaystackMeta;
}

export interface PaystackWebhookPayload {
    event: PaystackEvents;
    data: SubscriptionData & {
        currency?: PaystackCurrency;
        reference: string;
        metadata: PaystackMetadata;
        paid_at: string;
    };
}

export interface PaystackResponseDTO {
    status: boolean;
    message: string;
    data: ResponseData;
    gateway_response: string;
}

export interface CustomerResponseDTO {
    status: boolean;
    message: string;
    data: PaystackCustomer;
}

export interface PaystackPaymentSessionResponse {
    status: boolean;
    message: string;
    data: PaystackPaymentResponseData;
}

export interface PlanResponse {
    status: boolean;
    message: string;
    data: {
        subscriptions: SubscriptionData[];
        integration: number;
        domain: string;
        name: string;
        plan_code: string;
        description: string;
        amount: number;
        interval: 'daily' | 'weekly' | 'monthly';
        send_invoices: boolean;
        send_sms: boolean;
        hosted_page: boolean;
        hosted_page_url: string;
        hosted_page_summary: string;
        currency: PaystackCurrency;
        id: number;
        createdAt: string;
        updatedAt: string;
    };
}

export type PaystackCurrency = 'NGN' | 'USD' | 'GHS' | 'ZAR' | 'KES';

export type PaystackTransactionStatus =
    | 'pending'
    | 'success'
    | 'failed'
    | 'send_otp'
    | 'send_pin'
    | 'send_birthday'
    | 'send_phone';

export type PaystackChannels = 'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer' | 'eft';

export interface ResponseData {
    amount: number;
    currency: string;
    transaction_date: string;
    display_text: string;
    status: PaystackTransactionStatus;
    reference: string;
    domain: string;
    metadata: PaystackMetadata;
    message: null;
    channel: PaystackChannels;
    ip_address: string;
    log: null;
    fees: number;
    authorization: PaystackAuthorization;
    customer: PaystackCustomer;
    plan: string;
}

export interface PaystackAuthorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: PaystackChannels;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: true;
    signature: string;
    account_name: string;
}

export type PaystackCustomer = {
    transactions: Array<Record<string, unknown>>;
    subscriptions: SubscriptionData[];
    authorizations: PaystackAuthorization;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    metadata: CustomerMetadata;
    domain: string;
    customer_code: string;
    risk_action: string;
    id: number;
    integration: number;
    createdAt: string;
    updatedAt: string;
    total_transactions: number;
    total_transaction_value: unknown[];
    dedicated_account?: unknown;
    dedicated_accounts?: unknown[];
    identified: boolean;
    identifications: unknown;
};

export type PaystackMetadata = {
    cart_id: string;
    cancel_action: string;
    custom_filters: {
        recurring: boolean;
        supported_mobile_money_providers: Array<'mtn' | 'atl' | 'vod'>; //Not supported in all countries
    };
    custom_fields: [
        {
            display_name: string;
            variable_name: string;
            value: string;
        },
    ];
};

export interface PaystackPlan {
    domain: string;
    name: string;
    plan_code: string;
    description: string;
    amount: number;
    interval: string;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    hosted_page_url: string;
    hosted_page_summary: string;
    currency: PaystackCurrency;
    migrate: string;
    id: number;
    integration: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaystackMeta {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
}

export interface CustomerMetadata {
    photos: Photo[];
}

export interface Photo {
    type: string;
    typeId: string;
    typeName: string;
    url: string;
    isPrimary: boolean;
}
