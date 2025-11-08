import { motion } from "framer-motion";

interface TickerMessage {
  id: number;
  text: string;
}

const messages: TickerMessage[] = [
  { id: 1, text: "Nouvelle offre : 0% de frais sur vos premiers transferts" },
  { id: 2, text: "Vos données sont protégées grâce au chiffrement AES-256" },
  { id: 3, text: "Altus Finance Group : la confiance, notre priorité depuis 2020" },
  { id: 4, text: "Disponible 24/7 pour répondre à vos besoins bancaires" },
];

export default function InfoTicker() {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden py-2 px-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...messages, ...messages, ...messages].map((msg, index) => (
          <span key={`${msg.id}-${index}`} className="text-sm font-medium">
            {msg.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
