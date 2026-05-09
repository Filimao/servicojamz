import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TWILIO_GATEWAY = "https://connector-gateway.lovable.dev/twilio";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("258")) return `+${digits}`;
  if (digits.startsWith("8") && digits.length === 9) return `+258${digits}`;
  return digits;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { phone, purpose } = await req.json();
    if (!phone || !purpose || !["signup", "reset", "verify"].includes(purpose)) {
      return new Response(JSON.stringify({ error: "phone e purpose válidos são obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const normalized = normalizePhone(phone);
    if (!/^\+\d{8,15}$/.test(normalized)) {
      return new Response(JSON.stringify({ error: "Formato de telefone inválido. Ex: +258 84 XXX XXXX" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Rate limit: max 3 OTPs in last 10 min for same phone+purpose
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("phone_otps")
      .select("id", { count: "exact", head: true })
      .eq("phone", normalized)
      .eq("purpose", purpose)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: "Demasiadas tentativas. Aguarde 10 minutos." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For reset, ensure account exists
    if (purpose === "reset") {
      const { data: prof } = await supabase
        .from("profiles").select("user_id").eq("phone", normalized).maybeSingle();
      if (!prof) {
        return new Response(JSON.stringify({ error: "Telefone não está registado." }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await sha256(code + normalized);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabase.from("phone_otps").insert({
      phone: normalized, code_hash: codeHash, purpose, expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    // Send SMS via Twilio gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY) {
      throw new Error("Credenciais Twilio não configuradas");
    }
    if (!TWILIO_FROM) {
      throw new Error("TWILIO_FROM_NUMBER não configurado (número Twilio remetente)");
    }

    const body = new URLSearchParams({
      To: normalized,
      From: TWILIO_FROM,
      Body: `ServicoJa: o seu codigo e ${code}. Valido por 10 minutos. Nao partilhe com ninguem.`,
    });

    const smsRes = await fetch(`${TWILIO_GATEWAY}/Messages.json`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const smsData = await smsRes.json();
    if (!smsRes.ok) {
      console.error("Twilio error:", smsData);
      return new Response(JSON.stringify({ error: "Falha ao enviar SMS", details: smsData?.message ?? null }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, phone: normalized }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});