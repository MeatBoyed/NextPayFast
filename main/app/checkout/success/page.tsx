import { Card } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-md p-6 flex flex-col items-center justify-center gap-6">
        <div className="bg-green-500 text-green-50 rounded-full p-3">
          <Check className="h-8 w-8" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold">Purchase Successful</h3>
          <p className="text-muted-foreground">Thank you for your order! Your order details have been sent to your email.</p>
        </div>
        <Link href="/" className={buttonVariants({ className: "w-full" })} prefetch={true}>
          View Order
        </Link>
      </Card>
    </main>
  );
}
