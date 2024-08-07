import crypto from "crypto";
import { ITN_PayloadSchema, TransactionForm, TransactionFormSchema } from "./PayFastTypes";
import { generateParameter } from "./utils";
import dns from "dns";
import axios from "axios";
import { PayfastEnv } from "./env/PayfastEnv.mjs";
import { z } from "zod";

/**
 * Generates a PayFast secure Signature for the provided Form/Payload.
 * @param data The Checkout Form's data
 * @param passPhrase Payfast secure PassPhrase for encryption
 * @returns PayFast secure Signature
 */
export function generateTransactionFormSignature(data: TransactionForm, passPhrase: string) {
  const payload = TransactionFormSchema.safeParse(data);
  if (!payload.success) throw new Error("Invalid Transaction Form to generate a Valid Secure Signature");

  const pfOutput = generateParameter(payload.data);
  return generateSecureSignature(pfOutput, passPhrase);
}

/**
 * Generate a PayFast secure Signature from Transactional Data
 * @param param generated Parameter from Transactional Data
 * @param passPhrase PayFast secure PassPhrase for encryption
 * @returns Secure Signature
 */
function generateSecureSignature(param: string, passPhrase: string) {
  // Add passphrase
  param += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;

  return crypto.createHash("md5").update(param).digest("hex");
}

async function ipLookup(domain: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, { all: true }, (err, address) => {
      if (err) {
        reject(err);
      } else {
        const addressIps: string[] = address.map((item) => item.address);
        resolve(addressIps);
      }
    });
  });
}

const pfValidIP = async (req: Request) => {
  const validHosts = ["www.payfast.co.za", "sandbox.payfast.co.za", "w1w.payfast.co.za", "w2w.payfast.co.za"];

  let validIps: string[] = [];
  let pfIp = req.headers.get("x-forwarded-for") || ""; // Should also try get the remote address from req

  if (pfIp.split(",").length > 1) {
    pfIp = pfIp.split(",")[0];
  }

  try {
    for (let key in validHosts) {
      const ips = await ipLookup(validHosts[key]);
      validIps = [...validIps, ...ips];
    }
  } catch (err) {
    console.error(err);
  }

  const uniqueIps = Array.from(new Set(validIps));
  if (!uniqueIps.includes(pfIp)) return false;
  return true;
};

const pfValidPaymentData = (cartTotal: number, amount_gross: number) => {
  return Math.abs(cartTotal - amount_gross) <= 0.01;
};

const pfValidServerConfirmation = async (pfHost: string, pfParamString: string) => {
  const result = await axios
    .post(`https://${pfHost}/eng/query/validate`, pfParamString)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    });
  return result === "VALID";
};

export async function PayFastConfirmPayment(
  request: Request,
  pfParamString: string,
  payload: z.infer<typeof ITN_PayloadSchema>,
  cartTotal: number
) {
  // Check 1 - Verify payload Signature against TransactionFormData, Param Sting, and Passphrase
  const generatedSignature = generateSecureSignature(pfParamString, PayfastEnv.PAYFAST_PASSPHRASE);
  if (generatedSignature !== payload.signature) throw new Error("Invalid Signature");
  console.log("1 - Signature Validated: ", generatedSignature);

  // Check 2 - Verify domain is valid
  const isDomainValid = await pfValidIP(request);
  if (!isDomainValid) throw new Error("Invalid Domain");
  console.log("2 - Domain Validated: ", isDomainValid);

  // Check 3 - Compare Payment data
  const isPaymentValid = pfValidPaymentData(cartTotal, payload.amount_gross);
  if (!isPaymentValid) throw new Error("Invalid Payment Data");
  console.log("3 -Payment is Valid", isPaymentValid);

  // Check 4 - Perform a server request to confirm the details
  const response = await pfValidServerConfirmation(PayfastEnv.PAYFAST_HOST, pfParamString);
  if (!response) throw new Error("Invalid Server Response");
  console.log("4 - Server Confirmation: ", response);

  // Return 200 if all checks pass
  return true;
}
