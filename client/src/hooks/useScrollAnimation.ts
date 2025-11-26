import { useEffect, useRef } from "react";
import { useAnimation, useInView } from "framer-motion";

type Direction = "left" | "right" | "up" | "down";

interface ScrollAnimationConfig {
  direction?: Direction;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
}

export function useScrollAnimation(
  config: ScrollAnimationConfig = {}
) {
  const {
    direction = "left",
    duration = 0.8,
    delay = 0,
    staggerChildren = 0,
  } = config;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const getInitialPosition = () => {
    const baseOffset = 60;
    switch (direction) {
      case "left":
        return { x: -baseOffset, opacity: 0 };
      case "right":
        return { x: baseOffset, opacity: 0 };
      case "up":
        return { y: baseOffset, opacity: 0 };
      case "down":
        return { y: -baseOffset, opacity: 0 };
      default:
        return { x: -baseOffset, opacity: 0 };
    }
  };

  const variants = {
    hidden: getInitialPosition(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-in-out
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return { ref, controls, variants, containerVariants };
}
