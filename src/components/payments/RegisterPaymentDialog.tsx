import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePayment } from "@/hooks/usePayments";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  clientId: string;
  providerId: string;
  defaultAmount?: string;
}

export function RegisterPaymentDialog({ open, onOpenChange, requestId, clientId, providerId, defaultAmount }: Props) {
  const { data: settings } = usePlatformSettings();
  const create = useCreatePayment();
  const [amount, setAmount] = useState(defaultAmount?.replace(/[^\d.]/g, "") || "");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");

  const platformNumber = settings?.contact_phone || "879132543";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Indique um valor válido.");
      return;
    }
    if (!mpesaNumber.trim() || mpesaNumber.replace(/\D/g, "").length < 9) {
      toast.error("Indique um número M-Pesa válido (9 dígitos).");
      return;
    }
    try {
      await create.mutateAsync({
        request_id: requestId,
        client_id: clientId,
        provider_id: providerId,
        amount: value,
        mpesa_number: mpesaNumber.trim(),
        transaction_ref: transactionRef.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
      setAmount("");
      setMpesaNumber("");
      setTransactionRef("");
      setNotes("");
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" /> Registar pagamento M-Pesa
          </DialogTitle>
          <DialogDescription>
            Envie o pagamento via M-Pesa para o número abaixo e depois preencha os dados da transação.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">Número para envio:</p>
          <p className="text-lg font-bold text-primary">{platformNumber}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Valor pago (MZN) <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 1500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Seu número M-Pesa <span className="text-destructive">*</span></Label>
            <Input
              type="tel"
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value)}
              placeholder="84xxxxxxx ou 85xxxxxxx"
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Referência da transação</Label>
            <Input
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Ex: ABC123XYZ (do SMS M-Pesa)"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes adicionais (opcional)"
              rows={2}
              maxLength={300}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
