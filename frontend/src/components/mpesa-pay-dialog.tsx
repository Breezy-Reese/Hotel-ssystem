import { useEffect, useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInitiateStkPush, useInvalidateAfterMpesaPayment, useMpesaStatus, type MpesaSource } from "@/lib/mpesa";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";

export function MpesaPayDialog({
  open,
  onOpenChange,
  source,
  sourceId,
  amount,
  accountReference,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: MpesaSource;
  sourceId: string;
  amount: number;
  accountReference?: string;
}) {
  const [phone, setPhone] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | undefined>();

  const initiate = useInitiateStkPush();
  const { data: statusRes } = useMpesaStatus(checkoutRequestId);
  const invalidate = useInvalidateAfterMpesaPayment(source);

  const status = statusRes?.data.status;

  useEffect(() => {
    if (status === "Success") {
      toast.success("Payment received via M-Pesa.");
      invalidate();
      onOpenChange(false);
      resetState();
    } else if (status === "Failed" || status === "Cancelled") {
      toast.error(statusRes?.data.resultDesc || "M-Pesa payment was not completed.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function resetState() {
    setPhone("");
    setCheckoutRequestId(undefined);
  }

  async function handleSend() {
    if (!phone.trim()) {
      toast.error("Enter the customer's phone number");
      return;
    }
    try {
      const res = await initiate.mutateAsync({
        phone,
        amount,
        source,
        sourceId,
        accountReference,
      });
      setCheckoutRequestId(res.data.checkoutRequestId);
      toast.info("STK push sent — ask the customer to check their phone.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send M-Pesa request");
    }
  }

  const isWaiting = !!checkoutRequestId && (status === "Pending" || status === undefined);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetState();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="size-4" /> Pay with M-Pesa
          </DialogTitle>
          <DialogDescription>
            Amount: <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
          </DialogDescription>
        </DialogHeader>

        {!isWaiting && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mpesa-phone">Customer phone number</Label>
              <Input
                id="mpesa-phone"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={initiate.isPending}
              />
            </div>
          </div>
        )}

        {isWaiting && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="size-8 animate-spin text-accent" />
            <p className="text-sm font-medium">Waiting for the customer to enter their M-Pesa PIN…</p>
            <p className="text-xs text-muted-foreground">This updates automatically once they respond.</p>
          </div>
        )}

        <DialogFooter>
          {!isWaiting && (
            <Button onClick={handleSend} disabled={initiate.isPending}>
              {initiate.isPending ? "Sending…" : "Send STK push"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}