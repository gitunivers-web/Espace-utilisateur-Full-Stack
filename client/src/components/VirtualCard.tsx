import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CreditCard, Wifi } from "lucide-react";

interface VirtualCardProps {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
}

export default function VirtualCard({ cardHolder, cardNumber, expiryDate }: VirtualCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, rotateY: 5 }}
      className="perspective-1000"
    >
      <Card 
        className="relative overflow-hidden p-6 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground border-0 shadow-xl"
        style={{
          backdropFilter: "blur(20px)",
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(227 100% 42%) 100%)",
        }}
        data-testid="card-virtual-card"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-12 bg-gold/90 rounded" />
              <Wifi className="h-5 w-5 rotate-90" />
            </div>
            <CreditCard className="h-6 w-6" />
          </div>

          <div className="mb-6">
            <p className="text-xs opacity-70 mb-1">Numéro de carte</p>
            <p className="text-xl font-mono tracking-wider" data-testid="text-card-number">
              {cardNumber}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs opacity-70 mb-1">Titulaire</p>
              <p className="font-semibold tracking-wide" data-testid="text-card-holder">{cardHolder}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">Expire</p>
              <p className="font-mono" data-testid="text-card-expiry">{expiryDate}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-bold tracking-wider">ALTUS</span>
            <div className="flex gap-1">
              <div className="h-6 w-6 rounded-full bg-white/80" />
              <div className="h-6 w-6 rounded-full bg-gold/80 -ml-3" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
