import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FiCode,
  FiMessageSquare,
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiZap,
  FiDownload,
} from "react-icons/fi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { generateResumePdfThunk, getInterviewReportByIdThunk } from "../store/features/interview/interview.thunk";
import Loader from "../components/Loader";
import SectionCard from "../components/SectionCard";
import SectionHeader from "../components/SectionHeader";
import QuestionCard from "../components/QuestionCard";
import { toast } from "react-toastify";

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

export const scoreColor = (s) => {
  if (s >= 80) return { text: "#22c55e", glow: "rgba(34,197,94,0.3)",   label: "Strong Match" };
  if (s >= 60) return { text: "#a855f7", glow: "rgba(168,85,247,0.3)",  label: "Good Match" };
  if (s >= 40) return { text: "#eab308", glow: "rgba(234,179,8,0.3)",   label: "Partial Match" };
  return        { text: "#f87171", glow: "rgba(248,113,113,0.3)", label: "Needs Work" };
};

const severityConfig = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", label: "High" },
  medium: { color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)",   label: "Medium" },
  low:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)",   label: "Low" },
};

/* ── Shimmer block ── */
const Shimmer = ({ className = "", style = {} }) => (
  <div
    className={`animate-pulse rounded-xl ${className}`}
    style={{ background: "rgba(255,255,255,0.06)", ...style }}
  />
);

/* ── Skeleton shown while fetching ── */
const FetchingSkeleton = () => (
  <div
    className="md:ml-66.5 overflow-x-hidden"
    style={{ minHeight: "100dvh", background: "linear-gradient(135deg,#0f0c1a 0%,#14101f 55%,#0c0c18 100%)" }}
  >
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute -top-32 right-0 w-125 h-125 rounded-full blur-[180px]" style={{ background: "rgba(124,58,237,0.08)" }} />
      <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full blur-[160px]"  style={{ background: "rgba(236,72,153,0.07)" }} />
    </div>

    <div className="relative" style={{ zIndex: 1 }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 md:pt-10">

        {/* Hero */}
        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <Shimmer className="h-6 w-44" />
            <Shimmer className="h-8 w-3/4" />
            <Shimmer className="h-8 w-1/2" />
            <Shimmer className="h-4 w-56" />
            <Shimmer className="h-9 w-36" />
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Shimmer className="w-24 h-24" style={{ borderRadius: "50%" }} />
            <Shimmer className="h-3 w-20" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: "rgba(168,85,247,0.1)" }} />

        <div className="flex flex-col gap-6">
          {/* Section cards */}
          {[3, 3, 3].map((rows, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Shimmer className="w-8 h-8 rounded-xl" />
                <Shimmer className="h-4 w-40" />
              </div>
              <div className="flex flex-col gap-3">
                {[...Array(rows)].map((_, j) => (
                  <Shimmer key={j} className="h-16" />
                ))}
              </div>
            </div>
          ))}

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Shimmer className="w-8 h-8 rounded-xl" />
                  <Shimmer className="h-4 w-32" />
                </div>
                <div className="flex flex-col gap-2.5">
                  {[...Array(3)].map((_, j) => <Shimmer key={j} className="h-12" />)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <Shimmer className="h-20 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const Interview = () => {
  const { reportId } = useParams();
  const { interviewReport: data, loading, pdfLoading } = useSelector(
    (state) => state.interview
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* local flag — set true the instant useEffect fires, cleared when fetch settles */
  const [fetching, setFetching] = useState(true);

  const handleDownload = async () => {
    try {
      await dispatch(generateResumePdfThunk(reportId)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      setFetching(true);                          // ← triggers immediately on every reportId change
      try {
        if (!data || data._id !== reportId) {
          await dispatch(getInterviewReportByIdThunk(reportId)).unwrap();
        }
      } catch (err) {
        navigate("/", { replace: true });
      } finally {
        setFetching(false);                       // ← cleared once fetch resolves or errors
      }
    };

    fetchReport();
  }, [dispatch, reportId]);

  if (fetching || loading || !data) return <FetchingSkeleton />;

  const score = data.matchScore;
  const sColor = scoreColor(score);
  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  return (
    <div
      className="md:ml-66.5 bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18] overflow-x-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-32 right-0 w-125 h-125 rounded-full blur-[180px]" style={{ background: "rgba(124,58,237,0.08)" }} />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full blur-[160px]"  style={{ background: "rgba(236,72,153,0.07)" }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 md:pt-10">
          {/* ── Hero header ── */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              {/* Left */}
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-violet-300 w-fit"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Interview Strategy Ready
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                  {data.title}
                </h1>

                <p className="text-white/35 text-sm">
                  {data.technicalQuestions.length + data.behavioralQuestions.length}{" "}
                  questions &nbsp;·&nbsp; {data.skillGaps.length} skill gaps
                  &nbsp;·&nbsp; {data.preparationPlan.length}-day plan
                </p>

                {/* Download button */}
                <div className="mt-1 flex items-center gap-3 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDownload}
                    disabled={pdfLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(168,85,247,0.16))",
                      border: "1px solid rgba(168,85,247,0.38)",
                      color: pdfLoading ? "rgba(192,132,252,0.5)" : "#c084fc",
                      boxShadow: "0 0 20px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
                      cursor: pdfLoading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!pdfLoading) {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.38), rgba(168,85,247,0.24))";
                        e.currentTarget.style.borderColor = "rgba(168,85,247,0.58)";
                        e.currentTarget.style.boxShadow = "0 0 28px rgba(168,85,247,0.22), inset 0 1px 0 rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#d8b4fe";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(168,85,247,0.16))";
                      e.currentTarget.style.borderColor = "rgba(168,85,247,0.38)";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = pdfLoading ? "rgba(192,132,252,0.5)" : "#c084fc";
                    }}
                  >
                    {pdfLoading ? (
                      <>
                        <svg className="animate-spin shrink-0" width={13} height={13} viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(192,132,252,0.25)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span>Preparing…</span>
                      </>
                    ) : (
                      <>
                        <FiDownload size={13} className="shrink-0" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </motion.button>

                  {/* helper caption */}
                  <p className="text-white/25 text-xs leading-snug max-w-50">
                    Resume tailored to this job's requirements &amp; skill gaps
                  </p>
                </div>
              </div>

              {/* Right: Match Score ring */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={sColor.text}
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - dash }}
                      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ filter: `drop-shadow(0 0 6px ${sColor.glow})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white leading-none">{score}</span>
                    <span className="text-white/30 text-[10px] mt-0.5">/ 100</span>
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: sColor.text }}>
                  {sColor.label}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Top glow divider */}
          <div
            className="h-px mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)" }}
          />

          <div className="flex flex-col gap-6">
            {/* Technical Questions */}
            <SectionCard delay={0.08}>
              <SectionHeader icon={FiCode} color="#a855f7" title="Technical Questions" count={data.technicalQuestions.length} />
              <div className="flex flex-col gap-3">
                {data.technicalQuestions.map((item, i) => (
                  <QuestionCard key={i} item={item} index={i} accent="#a855f7" />
                ))}
              </div>
            </SectionCard>

            {/* Behavioural Questions */}
            <SectionCard delay={0.14}>
              <SectionHeader icon={FiMessageSquare} color="#ec4899" title="Behavioural Questions" count={data.behavioralQuestions.length} />
              <div className="flex flex-col gap-3">
                {data.behavioralQuestions.map((item, i) => (
                  <QuestionCard key={i} item={item} index={i} accent="#ec4899" />
                ))}
              </div>
            </SectionCard>

            {/* Skill Gaps + Prep Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard delay={0.2}>
                <SectionHeader icon={FiAlertTriangle} color="#eab308" title="Skill Gaps" count={data.skillGaps.length} />
                <div className="flex flex-col gap-2.5">
                  {data.skillGaps.map((gap, i) => {
                    const cfg = severityConfig[gap.severity];
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm font-medium truncate">{gap.skill}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard delay={0.26}>
                <SectionHeader icon={FiCalendar} color="#3b82f6" title="Preparation Plan" count={`${data.preparationPlan.length} days`} />
                <div className="flex flex-col gap-3">
                  {data.preparationPlan.map((day, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-3 px-4 py-3"
                        style={{ background: "rgba(59,130,246,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}>
                          <span className="text-blue-400 text-[10px] font-black">{day.day}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiZap className="text-blue-400 text-xs shrink-0" />
                          <p className="text-white/75 text-sm font-semibold">{day.focus}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex flex-col gap-2">
                        {day.tasks.map((task, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <FiCheckCircle className="text-blue-400/50 text-xs mt-0.5 shrink-0" />
                            <p className="text-white/50 text-xs leading-relaxed">{task}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Footer summary */}
            <motion.div
              {...fadeUp(0.32)}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.08) 100%)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                style={{ background: "rgba(168,85,247,0.15)" }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 16px -4px rgba(168,85,247,0.5)" }}
                >
                  <FiAward className="text-white text-base" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm mb-0.5">You've got a solid foundation.</p>
                  <p className="text-white/40 text-xs leading-relaxed">
                    Focus on the high-severity skill gaps first, then work through the {data.preparationPlan.length}-day plan consistently. Good luck!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
