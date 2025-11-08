import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progress?: number;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  progress,
  className = "",
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`hover-elevate ${className}`} data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold break-words" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>{value}</div>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? 'text-chart-3' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" data-testid={`progress-${title.toLowerCase().replace(/\s+/g, '-')}`} />
              <p className="text-xs text-muted-foreground mt-1">{progress}% utilisé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
