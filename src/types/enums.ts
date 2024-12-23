export enum PaystackEvents {
  PAYMENT_SUCCESSFUL = 'charge.success',
  INVOICE_CREATED = 'invoice.create',
  INVOICE_FAILED = 'invoice.payment_failed',
  INVOICE_UPDATED = 'invoice.update',
  PAYMENT_REQUEST_PENDING = 'paymentrequest.pending',
  PAYMENT_REQUEST_SUCCESSFUL = 'paymentrequest.success',
  REFUND_PENDING = 'refund.pending',
  SUBSCRIPTION_CREATE = 'subscription.create',
  SUBSCRIPTION_NOT_RENEW = 'subscription.not_renew',
  SUBSCRIPTION_EXPIRING = 'subscription.expiring_cards',
  CHARGE_DISPUTE_CREATE = 'charge.dispute.create',
  CUSTOMER_IDENTIFICATION_FAILED = 'customeridentification.failed',
}
