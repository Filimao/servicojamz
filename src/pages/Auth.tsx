import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Lock, User, Phone, Briefcase, Users, ShieldCheck, AlertCircle, Handshake } from "lucide-react";

type AuthMode = "login" | "register";
type RegisterStep = "form" | "otp";
type UserType = "client" | "provider";

const isLikelyEmail = (v: string) => v.includes("@");
const isLikelyPhone = (v: string) => /[\d+]/.test(v) && !v.includes("@");

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, normalizePhone } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<RegisterStep>("form");
  const [userType, setUserType] = useState<UserType>("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [identifierWarning, setIdentifierWarning] = useState<string | null>(null);

  const validateIdentifier = (v: string): string | null => {
    if (!v) return null;
    if (isLikelyEmail(v)) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      return ok ? null : "Email inválido. Exemplo: nome@email.com";
    }
    const normalized = normalizePhone(v);
    if (!/^\+\d{8,15}$/.test(normalized)) {
      return "Telefone inválido. Use o formato +258 84 XXX XXXX";
    }
    return null;
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Não foi possível continuar com Google",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const requestOtp = async (targetPhone: string) => {
    const { data, error } = await supabase.functions.invoke("send-otp", {
      body: { phone: targetPhone, purpose: "signup" },
    });
    if (error) throw new Error(error.message);
    if ((data as any)?.error) throw new Error((data as any).error);
    return (data as any)?.phone as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const warn = validateIdentifier(identifier);
        if (warn) {
          setIdentifierWarning(warn);
          toast({ title: "Verifique os seus dados", description: warn, variant: "destructive" });
          return;
        }
        const { error } = await signIn(identifier, password);
        if (error) {
          toast({
            title: "Erro ao entrar",
            description: error.message === "Invalid login credentials"
              ? "Credenciais incorretas. Verifique email/telefone e senha."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso." });
          navigate("/");
        }
      } else if (registerStep === "form") {
        if (!phone || phone.trim().length < 6) {
          toast({ title: "Telefone obrigatório", description: "Insira o seu número para criar a conta.", variant: "destructive" });
          return;
        }
        const phoneErr = validateIdentifier(phone);
        if (phoneErr) {
          toast({ title: "Telefone inválido", description: phoneErr, variant: "destructive" });
          return;
        }
        try {
          const normalized = await requestOtp(phone);
          setOtpPhone(normalized);
          setRegisterStep("otp");
          toast({ title: "Código enviado", description: `SMS enviado para ${normalized}.` });
        } catch (err) {
          toast({ title: "Não foi possível enviar SMS", description: (err as Error).message, variant: "destructive" });
        }
      } else {
        if (!/^\d{6}$/.test(otpCode)) {
          toast({ title: "Código inválido", description: "Digite os 6 dígitos do SMS.", variant: "destructive" });
          return;
        }
        const { data: vData, error: vErr } = await supabase.functions.invoke("verify-otp", {
          body: { phone: otpPhone, code: otpCode, purpose: "signup" },
        });
        if (vErr || (vData as any)?.error) {
          toast({
            title: "Código incorreto",
            description: (vData as any)?.error ?? vErr?.message ?? "Tente novamente.",
            variant: "destructive",
          });
          return;
        }
        const { error } = await signUp(email || undefined, password, fullName, phone, userType);
        if (error) {
          toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Conta criada!", description: "Telefone verificado. Bem-vindo ao ServiçoJá!" });
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await requestOtp(otpPhone || phone);
      toast({ title: "Código reenviado", description: "Verifique o SMS." });
    } catch (err) {
      toast({ title: "Erro ao reenviar", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                <Handshake className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground">ServiçoJá</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {mode === "login"
                ? "Entrar na conta"
                : registerStep === "otp"
                  ? "Verificar telefone"
                  : "Criar conta"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Entre para continuar"
                : registerStep === "otp"
                  ? `Digite o código enviado para ${otpPhone}`
                  : "Cadastre-se para começar"}
            </p>
          </div>

          {mode === "register" && registerStep === "form" && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setUserType("client")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "client" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <Users className={`w-8 h-8 mx-auto mb-2 ${userType === "client" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-medium ${userType === "client" ? "text-primary" : "text-foreground"}`}>Sou Cliente</p>
                <p className="text-xs text-muted-foreground mt-1">Procuro serviços</p>
              </button>
              <button
                type="button"
                onClick={() => setUserType("provider")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "provider" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <Briefcase className={`w-8 h-8 mx-auto mb-2 ${userType === "provider" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-medium ${userType === "provider" ? "text-primary" : "text-foreground"}`}>Sou Profissional</p>
                <p className="text-xs text-muted-foreground mt-1">Ofereço serviços</p>
              </button>
            </div>
          )}

          {mode === "login" && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full bg-card"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.66 5.94c4.47-4.13 7.12-10.2 7.12-17.59Z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.86l-7.66-5.94c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                </svg>
                {isGoogleLoading ? "A ligar ao Google..." : "Continuar com Google"}
              </Button>
              <div className="flex items-center gap-3 py-1" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">ou use email/telefone</span>
                <span className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && registerStep === "form" && (
              <>
                <div>
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="fullName" type="text" placeholder="Seu nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+258 84 XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" required />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Vamos enviar um código por SMS para confirmar o número.</p>
                </div>

                <div>
                  <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </>
            )}

            {mode === "login" && (
              <div>
                <Label htmlFor="identifier">Email ou Telefone</Label>
                <div className="relative mt-1">
                  {isLikelyPhone(identifier) ? (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  )}
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="seu@email.com ou +258 84 XXX XXXX"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setIdentifierWarning(validateIdentifier(e.target.value));
                    }}
                    className="pl-10"
                    required
                  />
                </div>
                {identifierWarning ? (
                  <p className="text-xs text-destructive mt-1 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{identifierWarning}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Exemplos: <strong>+258 84 123 4567</strong> ou <strong>nome@email.com</strong>
                  </p>
                )}
              </div>
            )}

            {(mode === "login" || registerStep === "form") && (
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                </div>
              </div>
            )}

            {mode === "register" && registerStep === "otp" && (
              <div>
                <Label htmlFor="otp">Código de 6 dígitos</Label>
                <div className="relative mt-1">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="pl-10 tracking-widest text-lg"
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <button type="button" onClick={() => setRegisterStep("form")} className="text-muted-foreground hover:underline">
                    Editar telefone
                  </button>
                  <button type="button" onClick={resendOtp} disabled={isLoading} className="text-primary font-medium hover:underline disabled:opacity-50">
                    Reenviar código
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
              {isLoading
                ? "Carregando..."
                : mode === "login"
                  ? "Entrar"
                  : registerStep === "otp"
                    ? "Verificar e criar conta"
                    : "Receber código SMS"}
            </Button>
          </form>

          {mode === "login" && (
            <div className="text-center mt-4">
              <Link to="/recuperar-senha" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setRegisterStep("form");
                  setIdentifierWarning(null);
                }}
                className="text-primary font-semibold hover:underline"
              >
                {mode === "login" ? "Cadastre-se" : "Entrar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}