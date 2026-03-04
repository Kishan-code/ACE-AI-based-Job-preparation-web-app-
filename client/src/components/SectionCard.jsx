import React from "react";
import { motion } from "motion/react";
import { fadeUp } from "../pages/Interview";

const SectionCard = ({ children, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-2xl p-6 backdrop-blur-sm"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px -8px rgba(0,0,0,0.4)",
    }}
  >
    {children}
  </motion.div>
);

export default SectionCard;
