import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiChevronDown,
  FiEye,
  FiBookOpen,
} from "react-icons/fi";

const QuestionCard = ({ item, index, accent }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Question row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left transition-colors duration-200 hover:bg-white/3"
      >
        <span
          className="text-xs font-mono mt-0.5 shrink-0 w-5 text-right"
          style={{ color: accent, opacity: 0.7 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="flex-1 text-white/80 text-sm font-medium leading-snug">
          {item.question}
        </p>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="shrink-0 mt-0.5"
        >
          <FiChevronDown className="text-white/30 text-base" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 flex flex-col gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Intention */}
              <div className="flex items-start gap-2 pt-3">
                <FiEye
                  className="text-xs mt-0.5 shrink-0"
                  style={{ color: accent }}
                />
                <p className="text-white/35 text-xs leading-relaxed italic">
                  {item.intention}
                </p>
              </div>
              {/* Answer */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <FiBookOpen className="text-xs" style={{ color: accent }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: accent, opacity: 0.7 }}
                  >
                    Suggested Answer
                  </span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;