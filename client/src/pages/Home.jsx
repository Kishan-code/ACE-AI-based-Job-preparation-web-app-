import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify"
import {
  FiBriefcase, FiUser, FiUpload,
  FiX, FiFileText, FiArrowRight,
} from "react-icons/fi";
import { generateInterviewReportThunk } from "../store/features/interview/interview.thunk";
import { useNavigate } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const Home = () => {

  const loading  = useSelector(state => state.interview.loading);
  const dispatch  = useDispatch();

  const navigate = useNavigate();

  const [jobDescription, setJobDescription]   = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [pdfFile, setPdfFile]                 = useState(null);
  const [dragging, setDragging]               = useState(false);
  const fileInputRef                          = useRef(null);

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") setPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!loading) handleFile(e.dataTransfer.files[0]);
  };

const handleSubmit = async () => {
  if (!jobDescription || !selfDescription || !pdfFile) {
    return toast.error("All fields are required!");
  }

  if (pdfFile.size > 3 * 1024 * 1024) {
    return toast.error("Resume file too large (max 3MB allowed)");
  }

  try {
    const res = await dispatch(
      generateInterviewReportThunk({
        jobDescription,
        selfDescription,
        pdfFile,
      })
    ).unwrap();

    if (res.success) {
      setJobDescription("");
      setSelfDescription("");
      setPdfFile(null);

      navigate(`/interview/${res.data._id}`);
    }

  } catch (error) {
    console.log(error);
  }
};

  /* ── Dynamic styles ── */
  const fieldWrapper = (focusColor) => ({
    background: loading ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    transition: "border-color 0.2s, background 0.2s",
    opacity: loading ? 0.5 : 1,
    pointerEvents: loading ? "none" : "auto",
  });

  return (
    <div
      className="md:ml-68 bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18]"
      style={{ minHeight: "100dvh" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 right-0 w-125 h-125 rounded-full blur-[180px]"
          style={{ background: "rgba(124,58,237,0.09)" }} />
        <div className="absolute -bottom-32 -left-16 w-105 h-105 rounded-full blur-[160px]"
          style={{ background: "rgba(236,72,153,0.08)" }} />
      </div>

      {/* Page wrapper */}
      <div
        className="relative z-10 flex items-center justify-center px-5 py-8 pt-24 md:pt-8"
        style={{ minHeight: "100dvh" }}
      >
        <div className="w-full max-w-4xl flex flex-col gap-6">

          {/* ── Header ── */}
          <motion.div {...fadeUp(0.05)} className="text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-violet-300 mb-4"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Interview Prep
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
              Nail your next{" "}
              <span style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                interview.
              </span>
            </h1>
            <p className="text-white/35 text-sm md:text-base leading-relaxed">
              Fill in the fields below and let AI craft a personalised strategy — tailored to the exact role you want.
            </p>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            {...fadeUp(0.12)}
            className="relative rounded-2xl p-6 md:p-8 backdrop-blur-2xl flex flex-col gap-5"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.45), transparent)" }}
            />

            {/* ── ROW 1: Textareas ── */}
            <motion.div {...fadeUp(0.18)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Job Description */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-widest font-semibold"
                  style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.2s" }}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                    <FiBriefcase className="text-violet-400" style={{ fontSize: "10px" }} />
                  </div>
                  Job Description
                </label>
                <div
                  style={fieldWrapper("rgba(168,85,247,0.5)")}
                  onFocus={(e) => { if (!loading) e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={loading}
                    placeholder="Paste the job posting — role, responsibilities, requirements…"
                    className="w-full bg-transparent outline-none text-white/75 placeholder:text-white/18 text-sm px-4 pt-3 pb-2 resize-none leading-relaxed disabled:cursor-not-allowed"
                    style={{ height: "160px", borderRadius: "12px" }}
                  />
                  <div className="px-4 pb-2 flex justify-between items-center">
                    <span className="text-white/18 text-xs">Include as much detail as possible</span>
                    <span className="text-white/18 text-xs tabular-nums">{jobDescription.length}</span>
                  </div>
                </div>
              </div>

              {/* About You */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-widest font-semibold"
                  style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.2s" }}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}>
                    <FiUser className="text-pink-400" style={{ fontSize: "10px" }} />
                  </div>
                  About You
                </label>
                <div
                  style={fieldWrapper("rgba(236,72,153,0.45)")}
                  onFocus={(e) => { if (!loading) e.currentTarget.style.borderColor = "rgba(236,72,153,0.45)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <textarea
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    disabled={loading}
                    placeholder="Your background, skills, experience, and career goals…"
                    className="w-full bg-transparent outline-none text-white/75 placeholder:text-white/18 text-sm px-4 pt-3 pb-2 resize-none leading-relaxed disabled:cursor-not-allowed"
                    style={{ height: "160px", borderRadius: "12px" }}
                  />
                  <div className="px-4 pb-2 flex justify-between items-center">
                    <span className="text-white/18 text-xs">Your strengths and experience</span>
                    <span className="text-white/18 text-xs tabular-nums">{selfDescription.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* ── ROW 2: PDF Upload ── */}
            <motion.div {...fadeUp(0.28)} className="flex flex-col gap-2"
              style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s", pointerEvents: loading ? "none" : "auto" }}
            >
              <label className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-widest font-semibold">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  <FiFileText className="text-blue-400" style={{ fontSize: "10px" }} />
                </div>
                Resume / CV
                <span className="text-white/20 normal-case tracking-normal font-normal">· PDF only</span>
              </label>

              <AnimatePresence mode="wait">
                {pdfFile ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4 px-6 rounded-xl w-full"
                    style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.22)", height: "110px" }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
                      <FiFileText className="text-green-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-semibold truncate">{pdfFile.name}</p>
                      <p className="text-white/35 text-xs mt-1">{(pdfFile.size / 1024).toFixed(1)} KB · PDF Document</p>
                    </div>
                    <button onClick={() => setPdfFile(null)} disabled={loading}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0 disabled:cursor-not-allowed"
                    >
                      <FiX className="text-base" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center gap-3 rounded-xl w-full cursor-pointer transition-all duration-200"
                    style={{
                      background: dragging ? "rgba(168,85,247,0.07)" : "rgba(255,255,255,0.02)",
                      border: `1px dashed ${dragging ? "rgba(168,85,247,0.55)" : "rgba(255,255,255,0.12)"}`,
                      height: "110px",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                        <FiUpload className="text-white/35 text-base" />
                      </div>
                      <div>
                        <p className="text-white/55 text-sm font-medium">Drag & drop your PDF here</p>
                        <p className="text-white/25 text-xs mt-0.5">
                          or <span className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">click to browse files</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
            </motion.div>

            {/* ── ROW 3: Submit Button ── */}
            <motion.div {...fadeUp(0.36)} className="flex flex-col gap-2">
              <motion.button
                whileHover={!loading ? { scale: 1.015 } : {}}
                whileTap={!loading ? { scale: 0.975 } : {}}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-xl font-semibold text-white text-sm tracking-wide flex items-center justify-center gap-2.5 relative overflow-hidden disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
                  boxShadow: loading ? "none" : "0 4px 32px -4px rgba(168,85,247,0.55)",
                  height: "52px",
                  opacity: loading ? 0.85 : 1,
                  transition: "opacity 0.2s, box-shadow 0.2s",
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3"
                    >
                      {/* Spinner */}
                      <svg
                        className="animate-spin"
                        style={{ width: "18px", height: "18px" }}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12" cy="12" r="10"
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Generating your strategy…</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2.5"
                    >
                      Generate My Interview Strategy
                      <FiArrowRight className="text-base shrink-0" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-white/18 text-xs text-center">
                Your data is never shared with third parties.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
