import { z } from "zod";
import { CardBrand, BankAccountType, UpiType } from "../types";

// Common validations
const email = z.string().email("Invalid email address");
const phone = z
  .string()
  .min(8, "Phone number too short")
  .max(15, "Phone number too long");
const amount = z.number().positive("Amount must be positive");
const currency = z.string().length(3, "Currency must be 3 characters");

// Card validations
const cardNumber = z
  .string()
  .min(13, "Card number too short")
  .max(19, "Card number too long")
  .regex(/^[0-9]+$/, "Must be only digits");

const expiryMonth = z
  .string()
  .length(2, "Must be 2 digits")
  .regex(/^(0[1-9]|1[0-2])$/, "Invalid month");

const expiryYear = z
  .string()
  .length(4, "Must be 4 digits")
  .refine((year) => parseInt(year) >= new Date().getFullYear(), "Card expired");

const cvv = z
  .string()
  .min(3, "CVV too short")
  .max(4, "CVV too long")
  .regex(/^[0-9]+$/, "Must be only digits");

// Bank validations
const accountNumber = z
  .string()
  .min(4, "Account number too short")
  .max(17, "Account number too long")
  .regex(/^[0-9]+$/, "Must be only digits");

const routingNumber = z
  .string()
  .length(9, "Must be 9 digits")
  .regex(/^[0-9]+$/, "Must be only digits");

// UPI validations
const upiId = z
  .string()
  .min(3, "UPI ID too short")
  .max(50, "UPI ID too long")
  .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, "Invalid UPI ID format");

// Address validations
const addressLine = z.string().min(1, "Required").max(100, "Too long");
const postalCode = z.string().min(3, "Too short").max(10, "Too long");

// Main schemas
export const cardSchema = z.object({
  number: cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  holderName: z.string().min(2, "Name too short"),
  brand: z
    .enum([
      "visa",
      "mastercard",
      "amex",
      "discover",
      "diners",
      "jcb",
      "unionpay",
      "unknown",
    ])
    .optional(),
});

export const bankSchema = z.object({
  accountNumber,
  routingNumber,
  holderName: z.string().min(2, "Name too short"),
  accountType: z.enum(["savings", "checking", "current"]), // Using z.enum() for string literal types
  ifscCode: z.optional(z.string().length(11, "IFSC must be 11 characters")),
});

export const upiSchema = z.object({
  type: z.enum(["id", "qr"]), // Using z.enum() for string literal types
  id: upiId,
  qrCode: z.optional(z.string()),
});

export const paymentSchema = z.object({
  method: z.enum(["card", "bank", "wallet", "upi", "netbanking"]),
  amount,
  currency,
  customer: z.object({
    name: z.string().min(2, "Name too short"),
    email,
    phone,
  }),
  billingAddress: z.optional(
    z.object({
      line1: addressLine,
      line2: z.optional(addressLine),
      city: addressLine,
      state: addressLine,
      postalCode,
      country: addressLine,
    })
  ),
  card: z.optional(cardSchema),
  bank: z.optional(bankSchema),
  upi: z.optional(upiSchema),
  netbanking: z.optional(
    z.object({
      bankCode: z.string().min(4, "Bank code required"),
    })
  ),
});
