import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Phone, Mail, ShieldCheck, Lock } from "lucide-react";

type Method = "phone" | "email";
type Step = "choose" | "otp" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { normalizePhone } = useAuth();

  const [method, setMethod] = useState<Method>("phone");
  const [step, setStep] = useState<Step>("choose");
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendPhoneOtp = async () => {
    const normalized = normalizePhone(phone);
    if (!/^\+\d{8,15}$/.test(normalized)) {
      toast({ title: "Telefone inválido", description: "Use o formato +258 84 XXX XXXX", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phone: normalized, purpose: "reset" },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error ?? error?.message ?? "Erro ao enviar SMS");
      }
      setOtpPhone((data as any).phone);
      setStep("otp");
      toast({ title: "Código enviado", description: `SMS enviado para ${(data as any).phone}.` });
    } catch (err) {
      toast({ title: "Erro", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndReset = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      toast({ title: "Código inválido", description: "Digite os 6 dígitos do SMS.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Senha curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { phone: otpPhone, code: otpCode, purpose: "reset", newPassword },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error ?? error?.message ?? "Erro");
      }
      setStep("done");
      toast({ title: "Senha alterada", description: "Já pode entrar com a nova senha." });
    } catch (err) {
      toast({ title: "Erro ao redefinir", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailReset = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: "Email inválido", description: "Exemplo: nome@email.com", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast({ title: "Email enviado", description: "Verifique a sua caixa de entrada." });
      setStep("done");
    } catch (err) {
      toast({ title: "Erro", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b border-border">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao login</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Recuperar senha</h1>
            <p className="text-muted-foreground">Escolha como quer receber o código de recuperação.</p>
          </div>

          {step === "choose" && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    method === "phone" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Phone className={`w-7 h-7 mx-auto mb-2 ${method === "phone" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-medium text-sm">Por SMS</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    method === "email" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Mail className={`w-7 h-7 mx-auto mb-2 ${method === "email" ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-medium text-sm">Por Email</p>
                </button>
              </div>

              {method === "phone" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rphone">Telefone da conta</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="rphone" type="tel" placeholder="+258 84 XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Exemplo: <strong>+258 84 123 4567</strong></p>
                  </div>
                  <Button onClick={sendPhoneOtp} variant="hero" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Receber código por SMS"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="remail">Email da conta</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="remail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <Button onClick={sendEmailReset} variant="hero" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar link por email"}
                  </Button>
                </div>
              )}
            </>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Código enviado para <strong>{otpPhone}</strong>
              </p>
              <div>
                <Label htmlFor="otp">Código de 6 dígitos</Label>
                <div className="relative mt-1">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="otp" type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} className="pl-10 tracking-widest text-lg" />
                </div>
              </div>
              <div>
                <Label htmlFor="newpass">Nova senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="newpass" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10" minLength={6} />
                </div>
              </div>
              <Button onClick={verifyAndReset} variant="hero" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Redefinir senha"}
              </Button>
              <button type="button" onClick={() => setStep("choose")} className="text-sm text-muted-foreground hover:underline block mx-auto">
                Mudar telefone
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground">
                {method === "phone" ? "Senha alterada com sucesso." : "Verifique o seu email para continuar."}
              </p>
              <Button onClick={() => navigate("/auth")} variant="hero" className="w-full" size="lg">
                Ir para login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}