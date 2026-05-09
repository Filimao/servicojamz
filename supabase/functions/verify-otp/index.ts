import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { phone, code, purpose, newPassword } = await req.json();
    if (!phone || !code || !purpose) {
      return new Response(JSON.stringify({ error: "phone, code e purpose obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const normalized = normalizePhone(phone);
    const codeHash = await sha256(String(code) + normalized);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: otp, error: otpErr } = await supabase
      .from("phone_otps")
      .select("*")
      .eq("phone", normalized)
      .eq("purpose", purpose)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpErr) throw otpErr;
    if (!otp) {
      return new Response(JSON.stringify({ error: "Código não encontrado. Solicite novo." }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "Código expirado. Solicite novo." }), {
        status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (otp.attempts >= 5) {
      return new Response(JSON.stringify({ error: "Demasiadas tentativas. Solicite novo código." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (otp.code_hash !== codeHash) {
      await supabase.from("phone_otps").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
      return new Response(JSON.stringify({ error: "Código incorreto." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark used
    await supabase.from("phone_otps").update({ used_at: new Date().toISOString() }).eq("id", otp.id);

    // Action by purpose
    if (purpose === "verify" || purpose === "signup") {
      // Mark profile.phone_verified if a profile exists for this phone
      await supabase.from("profiles").update({ phone_verified: true }).eq("phone", normalized);
      return new Response(JSON.stringify({ success: true, verified: true, phone: normalized }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (purpose === "reset") {
      if (!newPassword || String(newPassword).length < 6) {
        return new Response(JSON.stringify({ error: "Senha deve ter pelo menos 6 caracteres." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: prof } = await supabase
        .from("profiles").select("user_id").eq("phone", normalized).maybeSingle();
      if (!prof?.user_id) {
        return new Response(JSON.stringify({ error: "Conta não encontrada." }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: updErr } = await supabase.auth.admin.updateUserById(prof.user_id, {
        password: String(newPassword),
      });
      if (updErr) throw updErr;
      return new Response(JSON.stringify({ success: true, reset: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Purpose desconhecido" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});