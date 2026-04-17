import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

interface PaymentRow {
  amount: number;
  confirmed_at: string | null;
}

export function RevenueWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, confirmed_at")
        .eq("status", "confirmed");
      if (error) throw error;
      return data as PaymentRow[];
    },
  });

  const total = (data || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Build last 6 months series
  const months: { key: string; label: string; total: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      label: d.toLocaleDateString("pt-PT", { month: "short" }),
      total: 0,
    });
  }
  (data || []).forEach((p) => {
    if (!p.confirmed_at) return;
    const d = new Date(p.confirmed_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const m = months.find((x) => x.key === key);
    if (m) m.total += Number(p.amount || 0);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receita estimada (confirmada)
          </CardTitle>
          <p className="text-2xl font-bold text-foreground mt-1">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${total.toLocaleString("pt-PT")} MZN`}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-success/10">
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ total: { label: "MZN", color: "hsl(var(--primary))" } }}
          className="h-[180px] w-full"
        >
          <BarChart data={months}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
