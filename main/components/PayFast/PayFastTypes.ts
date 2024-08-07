import { z } from "zod";

// fica_idnumber Not in use
export enum PaymentMethods {
  eft = "eft",
  cc = "cc",
  dc = "dc",
  mp = "mp",
  mc = "mc",
  sc = "sc",
  ss = "ss",
  zp = "zp",
  mt = "mt",
  rcs = "rcs",
}
const PaymentMethodsEnum = ["eft", "cc", "dc", "mp", "mc", "sc", "ss", "zp", "mt", "rcs"] as const;

// TODO: Convert into Zod Schema Strictly following Doc Req
export interface TransactionForm {
  //   Merchant info
  merchant_id?: string;
  merchant_key?: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;

  // Customer
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;

  // Transaction
  m_payment_id?: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_int1?: string;
  custom_str1?: string;

  // Transaction Options
  email_confirmation?: boolean;
  confirmation_email?: string;

  // payment methods
  payment_method?: PaymentMethods;
}

export const TransactionFormSchema = z.object({
  //   Merchant
  merchant_id: z.string().optional(),
  merchant_key: z.string().optional(),
  return_url: z.string().optional(),
  cancel_url: z.string().optional(),
  notify_url: z.string().optional(),

  //   Customer
  name_first: z.string().max(100).optional(),
  name_last: z.string().max(100).optional(),
  email_address: z.string().max(100).optional(),
  cell_number: z.string().max(100).optional(),

  //   Transaction
  m_payment_id: z.string().max(100).optional(),
  amount: z.string(),
  item_name: z.string().max(100),
  item_description: z.string().max(225).optional(),
  custom_int1: z.string().max(225).optional(),
  custom_str1: z.string().max(225).optional(),

  //   Transaction options
  email_confirmation: z.enum(["0", "1"]).optional(),
  confirmation_email: z.string().max(100).optional(),

  payment_method: z.enum(PaymentMethodsEnum).optional(),
});

export const ITN_PayloadSchema = z.object({
  m_payment_id: z.string().optional(),
  pf_payment_id: z.string(),
  payment_status: z.string(),
  item_name: z.string(),
  item_description: z.string().optional(),
  amount_gross: z.coerce.number(),
  amount_fee: z.coerce.number().optional(),
  amount_net: z.coerce.number().optional(),
  custom_str1: z.string().optional(),
  custom_str2: z.string().optional(),
  custom_str3: z.string().optional(),
  custom_str4: z.string().optional(),
  custom_str5: z.string().optional(),
  custom_int1: z.string().optional(),
  custom_int2: z.string().optional(),
  custom_int3: z.string().optional(),
  custom_int4: z.string().optional(),
  custom_int5: z.string().optional(),

  name_first: z.string().optional(),
  name_last: z.string().optional(),
  email_address: z.string().optional(),
  merchant_id: z.string(),
  signature: z.string(),
});
