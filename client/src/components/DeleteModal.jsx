import { useState } from "react";
import { FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "motion/react";

const DeleteModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isConfirmed = password.length >= 8;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-999 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl p-7 w-full max-w-md"
        style={{
          background: "linear-gradient(160deg,rgba(20,16,35,0.99),rgba(15,12,26,0.99))",
          border: "1px solid rgba(248,113,113,0.2)",
          boxShadow: "0 32px 80px -8px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-full"
          style={{ background: "linear-gradient(90deg,transparent,rgba(248,113,113,0.5),transparent)" }}
        />

        {/* icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 20px rgba(239,68,68,0.15)",
          }}
        >
          <FiAlertTriangle className="text-red-400" size={20} />
        </div>

        <h3 className="text-white font-bold text-lg mb-1.5">Delete your account?</h3>
        <p className="text-white/38 text-sm leading-relaxed mb-5">
          This will permanently erase your account and all interview reports.{" "}
          <span className="text-white/60 font-semibold">This action cannot be undone.</span>
        </p>

        {/* password label */}
        <p className="text-white/30 text-xs mb-2">
          Enter your{" "}
          <code className="text-red-400 font-mono font-bold bg-red-400/10 px-1.5 py-0.5 rounded-md">
            PASSWORD
          </code>{" "}
          to confirm
        </p>

        {/* password input */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${isConfirmed ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
            transition: "border-color 0.2s",
          }}
        >
          <input
            autoFocus
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && isConfirmed) onConfirm(password); }}
            placeholder="Enter your password"
            className="flex-1 bg-transparent outline-none text-white/80 text-sm font-mono tracking-widest placeholder:text-white/15 placeholder:tracking-normal placeholder:font-sans"
          />
          <button
            onClick={() => setShowPassword((p) => !p)}
            className="shrink-0 text-white/25 hover:text-white/55 transition-colors"
          >
            {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
          </button>
        </div>

        {/* hint */}
        {password.length > 0 && !isConfirmed && (
          <p className="text-white/25 text-xs mb-4 -mt-3">
            Password must be at least 8 characters
          </p>
        )}

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => isConfirmed && onConfirm(password)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: isConfirmed ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.02)",
              border:     isConfirmed ? "1px solid rgba(239,68,68,0.45)" : "1px solid rgba(255,255,255,0.06)",
              color:      isConfirmed ? "#f87171" : "rgba(255,255,255,0.15)",
              cursor:     isConfirmed ? "pointer" : "not-allowed",
              boxShadow:  isConfirmed ? "0 0 20px rgba(239,68,68,0.15)" : "none",
            }}
          >
            Delete account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal;
