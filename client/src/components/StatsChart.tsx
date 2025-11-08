import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMonthlyStats } from "@/lib/api";

export default function StatsChart() {
  const { data: stats, isLoading } = useMonthlyStats();

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2" data-testid="card-stats-chart">
        <CardHeader>
          <CardTitle>Aperçu rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = stats || [];

  return (
    <Card className="col-span-full lg:col-span-2" data-testid="card-stats-chart">
      <CardHeader>
        <CardTitle>Aperçu rapide</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDépenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--popover-border))",
                borderRadius: "6px",
              }}
              formatter={(value: number) => `${value.toLocaleString('fr-FR')} €`}
            />
            <Area
              type="monotone"
              dataKey="revenus"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenus)"
            />
            <Area
              type="monotone"
              dataKey="dépenses"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDépenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-5" />
            <span className="text-sm text-muted-foreground">Dépenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
