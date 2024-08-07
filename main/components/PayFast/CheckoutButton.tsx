// Payment/Checkout & Redirecting to PayFast is initiated with a Form.
// To send Extra Data to PayFast, and secure the Payment, is done with adding hidden inputs/values to the form

import React from "react";
import { Button } from "../ui/button";
import { PayfastEnv } from "./env/PayfastEnv.mjs";
import { TransactionForm } from "./PayFastTypes";
import { generateTransactionFormSignature } from "./SecuirtyLayer";

// Idea: Interaction to Payfast may be completed with an API endpoint

// TODO: Make only necessary route (return/cancel/notify) as required value
interface CheckoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checkoutdetails: TransactionForm;
}

const CheckoutButton = React.forwardRef<HTMLButtonElement, CheckoutButtonProps>((props, ref) => {
  const { className, checkoutdetails } = props;

  const Merchant_Info = {
    merchant_id: PayfastEnv.PAYFAST_MERCHANT_ID,
    merchant_key: PayfastEnv.PAYFAST_MERCHANT_KEY,
    return_url: PayfastEnv.NEXT_PUBLIC_PAYFAST_RETURN_URL,
    cancel_url: PayfastEnv.NEXT_PUBLIC_PAYFAST_CANCEL_URL,
    notify_url: PayfastEnv.NEXT_PUBLIC_PAYFAST_NOTIFY_URL,
  };

  const signature = generateTransactionFormSignature({ ...Merchant_Info, ...checkoutdetails }, PayfastEnv.PAYFAST_PASSPHRASE);
  console.log("Generated Signature: ", signature);

  return (
    <form action={PayfastEnv.PAYFAST_POST_URL} method="post">
      {/* Merchant Info */}
      <input type="hidden" name="merchant_id" value={Merchant_Info.merchant_id} />
      <input type="hidden" name="merchant_key" value={Merchant_Info.merchant_key} />
      {Merchant_Info.return_url && <input type="hidden" name="return_url" value={Merchant_Info.return_url} />}
      {Merchant_Info.cancel_url && <input type="hidden" name="cancel_url" value={Merchant_Info.cancel_url} />}
      {Merchant_Info.notify_url && <input type="hidden" name="notify_url" value={Merchant_Info.notify_url} />}

      {/* Customer details */}
      {checkoutdetails?.name_first && <input type="hidden" name="name_first" value={checkoutdetails.name_first} />}
      {checkoutdetails?.name_last && <input type="hidden" name="name_last" value={checkoutdetails.name_last} />}
      {checkoutdetails?.email_address && <input type="hidden" name="email_address" value={checkoutdetails.email_address} />}
      {checkoutdetails?.cell_number && <input type="hidden" name="cell_number" value={checkoutdetails.cell_number} />}

      {/* Transaction details */}
      {checkoutdetails?.m_payment_id && <input type="hidden" name="m_payment_id" value={checkoutdetails.m_payment_id} />}
      <input type="hidden" name="amount" value={checkoutdetails.amount} />
      <input type="hidden" name="item_name" value={checkoutdetails.item_name} />
      {checkoutdetails?.item_description && (
        <input type="hidden" name="item_description" value={checkoutdetails.item_description} />
      )}
      {checkoutdetails?.custom_int1 && <input type="hidden" name="custom_int1" value={checkoutdetails.custom_int1} />}
      {checkoutdetails?.custom_str1 && <input type="hidden" name="custom_str1" value={checkoutdetails.custom_str1} />}

      {/* Transaction options */}
      {checkoutdetails?.email_confirmation && (
        <input
          type="hidden"
          name="email_confirmation"
          value={checkoutdetails?.email_confirmation ? (checkoutdetails?.email_confirmation ? "1" : "0") : "0"}
        />
      )}
      {checkoutdetails?.confirmation_email && (
        <input type="hidden" name="confirmation_address" value={checkoutdetails.confirmation_email} />
      )}

      {/* Payment method */}
      {checkoutdetails?.payment_method && <input type="hidden" name="payment_method" value={checkoutdetails.payment_method} />}

      {/* Security signature */}
      <input type="hidden" name="signature" value={signature} />

      <Button className={className} ref={ref} {...props}>
        Checkout with PayFast
      </Button>
    </form>
  );
});
CheckoutButton.displayName = "Button";

export { CheckoutButton };
