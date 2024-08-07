import { ITN_PayloadSchema } from "@/components/PayFast/PayFastTypes";
import { generateResponseParameter } from "@/components/PayFast/utils";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import { PayFastConfirmPayment } from "@/components/PayFast/main";
import { CART_TOTAL } from "@/lib/Payment";

const app = new Hono().basePath("/api");

// Return 500 if failed (Payfast will resend request, until valid, until 10mins)
app.post("/checkout/notify", async (c) => {
  const raw = c.req.raw;
  const params = await c.req.parseBody();
  const body = JSON.parse(JSON.stringify(params));

  //   Get payload object from params
  const payload = await ITN_PayloadSchema.safeParseAsync(params);
  if (!payload.success) throw new HTTPException(500, { message: "Invalid Request", cause: payload.error });

  // Generate PayFast Param String
  const pfParamString = generateResponseParameter(body);
  //   console.log("Created params: ", pfParamString);

  //   Confirm Payment
  const response = await PayFastConfirmPayment(raw, pfParamString, payload.data, CART_TOTAL);
  if (!response) throw new Error("Invalid Payment Confirmation");

  return c.status(200);
});

export const GET = handle(app);
export const POST = handle(app);
