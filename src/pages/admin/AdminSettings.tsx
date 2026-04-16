import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, Database, Loader2, Save } from "lucide-react";
import { usePlatformSettings, useUpdatePlatformSettings, PlatformSettings } from "@/hooks/usePlatformSettings";

export default function AdminSettings() {
  const { data: settings, isLoading } = usePlatformSettings();
  const updateMutation = useUpdatePlatformSettings();
  const [form, setForm] = useState<Partial<PlatformSettings>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = () => {
    if (!settings?.id) return;
    updateMutation.mutate({ id: settings.id, ...form });
  };

  const set = <K extends keyof PlatformSettings>(k: K, v: PlatformSettings[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
            <p className="text-muted-foreground">Gerir as configurações da plataforma</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending} variant="hero">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar configurações
          </Button>
        </div>

        {/* GERAL */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Settings className="w-5 h-5 text-primary" /></div>
              <div>
                <CardTitle className="text-lg">Geral</CardTitle>
                <CardDescription>Informações públicas da plataforma</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform_name">Nome da plataforma</Label>
              <Input id="platform_name" value={form.platform_name || ""} onChange={(e) => set("platform_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do logo</Label>
              <Input id="logo_url" placeholder="https://..." value={form.logo_url || ""} onChange={(e) => set("logo_url", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="platform_description">Descrição do site</Label>
              <Textarea id="platform_description" rows={3} value={form.platform_description || ""} onChange={(e) => set("platform_description", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Email de suporte</Label>
              <Input id="support_email" type="email" value={form.support_email || ""} onChange={(e) => set("support_email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Número de contacto</Label>
              <Input id="contact_phone" value={form.contact_phone || ""} onChange={(e) => set("contact_phone", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" value={form.location || ""} onChange={(e) => set("location", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* SEGURANÇA */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10"><Shield className="w-5 h-5 text-secondary" /></div>
              <div>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>Controlo de acesso à plataforma</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Login obrigatório</p>
                <p className="text-sm text-muted-foreground">Exigir autenticação para aceder ao site</p>
              </div>
              <Switch checked={!!form.require_login} onCheckedChange={(v) => set("require_login", v)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Cadastro de prestadores</p>
                <p className="text-sm text-muted-foreground">Permitir que novos prestadores se registem</p>
              </div>
              <Switch checked={!!form.allow_provider_signup} onCheckedChange={(v) => set("allow_provider_signup", v)} />
            </div>
          </CardContent>
        </Card>

        {/* NOTIFICAÇÕES (preview) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10"><Bell className="w-5 h-5 text-warning" /></div>
              <div>
                <CardTitle className="text-lg">Notificações</CardTitle>
                <CardDescription>Canais e tipos de notificações</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Notificações in-app já estão ativas. SMS e WhatsApp serão adicionados numa próxima fase.
            </p>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>Novo pedido recebido — ativo</li>
              <li>Pedido aceite/recusado — ativo</li>
              <li>Avaliação recebida — em breve</li>
            </ul>
          </CardContent>
        </Card>

        {/* BASE DE DADOS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10"><Database className="w-5 h-5 text-info" /></div>
              <div>
                <CardTitle className="text-lg">Base de Dados</CardTitle>
                <CardDescription>Backups geridos pela infraestrutura</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Backups automáticos diários são realizados pela infraestrutura cloud. Para backups manuais ou restauros, contacte o suporte técnico.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
