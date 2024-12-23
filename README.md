# Paystack Subscription-Based Billing with NestJS

This repository contains the code for integrating **Paystack** subscription-based billing into a **NestJS** application.

## Features

- **Customer Management**: Create and retrieve customer information.
- **Subscription Plans**: Create and manage subscription plans.
- **Webhook Integration**: Handle Paystack events like `charge.success` and `subscription.create`.
- **Secure API**: Ensure webhook authenticity with signature validation.

## Note

This application is a simple implementation to demonstrate how to integrate Paystack for subscription-based billing.  
It does not include:

- Proper error handling
- Input validation
- Logging mechanisms
- Unit or integration tests

Use it as a reference for building a more robust application.

## Prerequisites

- Node.js and npm installed
- Paystack account setup (for test/live environments)
- NestJS CLI installed globally (`npm install -g @nestjs/cli`)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd paystack-nestjs
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file with your Paystack credentials:
    ```env
    PAYSTACK_SECRET=your_paystack_secret_key
    PAYSTACK_BASE_URL=https://api.paystack.co
    PAYSTACK_SUCCESS_URL=https://example.com
    ```

## Usage

1. Start the development server:
    ```bash
    npm run start:dev
    ```
2. Test webhook events using [Webhook.site](https://webhook.site/).

## Contributing

Feel free to fork this repository, create a new branch, and submit a pull request. Contributions are always welcome!

## License

This project is licensed under the MIT License.
