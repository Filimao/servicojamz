import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Flag } from "lucide-react";

interface ReportDialogProps {
  reportedUserId: string;
}

const reasons = [
  "Informações falsas",
  "Comportamento inadequado",
  "Spam ou fraude",
  "Serviço não realizado",
  "Outro",
];

export function ReportDialog({ reportedUserId }: ReportDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !reason) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: reportedUserId,
        reason,
        description: description || null,
      });
      if (error) throw error;
      toast.success("Denúncia enviada. Obrigado por nos ajudar.");
      setOpen(false);
      setReason("");
      setDescription("");
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === reportedUserId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="w-4 h-4 mr-1" /> Denunciar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denunciar Profissional</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Motivo</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    reason === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema..."
              rows={3}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSubmit} disabled={!reason || loading} className="w-full">
            {loading ? "Enviando..." : "Enviar Denúncia"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
