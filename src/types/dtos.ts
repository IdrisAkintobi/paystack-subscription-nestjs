export type Customer = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
};

export type PaystackPaymentSessionDTO = {
    customer: Customer;
    planId: string;
    transactionId: string;
};

export type PaystackPaymentResponseDTO = {
    authorization_url: string;
    access_code: string;
    reference: string;
};
