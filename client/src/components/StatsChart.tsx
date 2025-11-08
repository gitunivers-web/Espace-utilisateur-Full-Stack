import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartDataPoint {
  month: string;
  revenus: number;
  dépenses: number;
  remboursements: number;
}

const mockData: ChartDataPoint[] = [
  { month: "Jan", revenus: 45000, dépenses: 32000, remboursements: 5000 },
  { month: "Fév", revenus: 52000, dépenses: 38000, remboursements: 5000 },
  { month: "Mar", revenus: 48000, dépenses: 35000, remboursements: 5000 },
  { month: "Avr", revenus: 61000, dépenses: 42000, remboursements: 5000 },
  { month: "Mai", revenus: 55000, dépenses: 39000, remboursements: 5000 },
  { month: "Juin", revenus: 67000, dépenses: 45000, remboursements: 5000 },
];

export default function StatsChart() {
  return (
    <Card className="col-span-full lg:col-span-2" data-testid="card-stats-chart">
      <CardHeader>
        <CardTitle>Aperçu rapide</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
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
