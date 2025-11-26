import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Direction = "left" | "right" | "up" | "down";

interface ScrollAnimatedElementProps {
  children: React.ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  className?: string;
}

export function ScrollAnimatedElement({
  children,
  direction = "left",
  duration = 0.8,
  delay = 0,
  className = "",
}: ScrollAnimatedElementProps) {
  const { ref, variants } = useScrollAnimation({
    direction,
    duration,
    delay,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      variants={variants}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
