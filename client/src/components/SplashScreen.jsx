import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../assets/logo1.png";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Ease-out feel — faster at start, slower near end
        const increment = prev < 60 ? Math.random() * 6 + 3 : Math.random() * 2 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-999 flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18]"
        >
          {/* Background ambient blobs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
            style={{ background: "rgba(124, 58, 237, 0.12)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
            style={{ background: "rgba(236, 72, 153, 0.1)" }} />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-10">

            {/* Logo / Spinner combined */}
            <div className="relative flex items-center justify-center w-24 h-24">

              {/* Spinning outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent 70%, #a855f7, #ec4899, transparent)",
                  padding: "2px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Slower counter-spin ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full"
                style={{
                  background: "conic-gradient(from 180deg, transparent 75%, rgba(124,58,237,0.6), transparent)",
                  padding: "1px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Center logo badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
              >
                  <img src={logo} alt="ACE Logo"
                  className="w-full h-full object-contain object-center" />
              </div>
            </div>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center gap-1"
            >
              <h1 className="text-white text-2xl font-bold tracking-tight">ACE</h1>
              <p className="text-white/30 text-sm tracking-widest uppercase">Loading your experience</p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center gap-3 w-64"
            >
              {/* Bar track */}
              <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
                    boxShadow: "0 0 12px rgba(168,85,247,0.6)",
                    transition: "width 0.12s ease-out",
                  }}
                />
              </div>

              {/* Percentage */}
              <p className="text-white/25 text-xs tabular-nums">
                {Math.floor(progress)}%
              </p>
            </motion.div>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "rgba(168,85,247,0.7)" }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom version tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 text-white/15 text-xs tracking-widest uppercase"
          >
            v1.0.0
          </motion.p>
        </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
