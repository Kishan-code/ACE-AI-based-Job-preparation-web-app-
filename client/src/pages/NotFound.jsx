import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18] flex items-center justify-center px-5"
      style={{ minHeight: "100dvh" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 right-0 w-125 h-125 rounded-full blur-[180px]"
          style={{ background: "rgba(124,58,237,0.1)" }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-105 h-105 rounded-full blur-[160px]"
          style={{ background: "rgba(236,72,153,0.09)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full blur-[140px]"
          style={{ background: "rgba(139,92,246,0.05)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        {/* ── Glowing 404 number ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6 select-none"
        >
          {/* Glow layer */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[9rem] md:text-[11rem] font-black tracking-tighter blur-2xl opacity-30 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </span>
          {/* Crisp text */}
          <span
            className="relative text-[9rem] md:text-[11rem] font-black tracking-tighter leading-none"
            style={{
              background: "linear-gradient(135deg, #a855f7 20%, #ec4899 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </span>
        </motion.div>

        {/* ── Glass card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full rounded-2xl px-8 py-8 backdrop-blur-2xl"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)" }}
          />

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-violet-300 mb-4"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Page Not Found
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
            Oops! You've gone off the map.
          </h1>
          <p className="text-white/35 text-sm leading-relaxed mb-8">
            The page you're looking for doesn't exist, was moved, or the URL might be incorrect. Let's get you back on track.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white/90 transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <FiArrowLeft className="text-base" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/",{replace: true})}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
                boxShadow: "0 4px 24px -4px rgba(168,85,247,0.55)",
              }}
            >
              <FiHome className="text-base" />
              Back to Home
            </motion.button>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-white/18 text-xs mt-5"
        >
          Error 404 · Page does not exist
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
