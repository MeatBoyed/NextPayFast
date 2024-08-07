import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
// import { CheckoutButton } from "@/components/PayFast/CheckoutButton";
import { CheckoutButton, PaymentMethods } from "@/components/PayFast/main";
import { CART_TOTAL, ITEM_NAME } from "@/lib/Payment";

export default function Home() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center w-full p-24 md:max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Order Number #3131007</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span>{ITEM_NAME}</span>
              <span>R {CART_TOTAL}</span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span>Taxes</span>
              <span>R11.20</span>
            </div> */}
            <Separator />
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>R {CART_TOTAL}</span>
          </div>

          <CheckoutButton
            className="w-full"
            // ORDER MATTERS HERE TOO
            checkoutdetails={{
              // name_first: "Charles Nerf",
              // name_last: "Designs LLP",
              // email_address: "charliejrcool@gmail.com",
              // cell_number: "",
              // m_payment_id: "696969",
              amount: CART_TOTAL.toString(),
              item_name: ITEM_NAME,
              // item_description: "The best eCommerce platform in South Africa",
              // payment_method: PaymentMethods.eft,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
