import { CheckoutButton } from "./CheckoutButton";
import { PaymentMethods } from "./PayFastTypes";
import { generateTransactionFormSignature, PayFastConfirmPayment } from "./SecuirtyLayer";

// TODO: Write documentation for each function
// TODO: Write ReadMe for project
// TODO: Find if having a 404 error on Notify POST route is good or not

// Webhook completes Payment Verfication but returns 404
// Webhook redirects to success when Pay Now is clicked & then Cancel shortly after.

export { CheckoutButton, generateTransactionFormSignature, PayFastConfirmPayment, PaymentMethods };
