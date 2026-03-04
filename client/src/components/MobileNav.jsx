import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavLink } from "react-router-dom";
import {
  FiUser, FiLogOut, FiMenu, FiX,
  FiHome, FiInfo, FiFileText, FiChevronDown, FiClock, FiPlus, FiTrash2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteInterviewReportThunk } from "../store/features/interview/interview.thunk";


const MobileNav = ({
  Avatar,
  user = { name: "John Doe", avatar: null },
  onLogout,
}) => {
  const dispatch = useDispatch();
  const allInterviewReports = useSelector((state) => state.interview.allInterviewReports);
  const navLoading = useSelector((state) => state.interview.navLoading);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const topLinks = [
    { label: "Home",  to: "/",      icon: FiHome },
    { label: "About", to: "/about", icon: FiInfo },
  ];

  const handleDeleteReport = async (e, reportId) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId === reportId) return;
    setDeletingId(reportId);
    try {
      await dispatch(deleteInterviewReportThunk(reportId)).unwrap();
    } catch (err) {
      console.error("Failed to delete report:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* ── Top header bar ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 py-3 backdrop-blur-2xl"
        style={{
          background: "rgba(10,8,18,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white transition-colors duration-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <FiMenu className="text-xl" />
        </motion.button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 12px -2px rgba(168,85,247,0.5)" }}
          >
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">AppName</span>
        </div>

        {user && (
          <NavLink to="/profile">
            <Avatar size="w-9 h-9" radius="rounded-xl" />
          </NavLink>
        )}
      </motion.header>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-60 md:hidden"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Slide-in drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 z-70 md:hidden w-72 flex flex-col backdrop-blur-2xl"
            style={{
              background: "rgba(10,8,20,0.98)",
              borderRight: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "8px 0 40px -4px rgba(0,0,0,0.6)",
            }}
          >
            {/* Right glow edge */}
            <div
              className="absolute top-0 bottom-0 right-0 w-px"
              style={{ background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.3), transparent)" }}
            />

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 pt-12 pb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 16px -2px rgba(168,85,247,0.5)" }}
                >
                  <span className="text-white text-sm font-black">A</span>
                </div>
                <span className="text-white font-semibold text-base tracking-tight">AppName</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white/80 transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <FiX className="text-lg" />
              </motion.button>
            </div>

            {/* User card */}
            <div
              className="mx-4 mb-5 p-3 rounded-2xl flex items-center gap-3 shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Avatar size="w-11 h-11" radius="rounded-xl" />
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user?.username}</p>
                <p className="text-white/30 text-xs mt-0.5">Active session</p>
              </div>
            </div>

            <div className="mx-4 h-px mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />

            {/* ── Nav ── */}
            <nav className="flex flex-col gap-1 px-3 flex-1 min-h-0 overflow-hidden">

              {/* Home + About */}
              {topLinks.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                      isActive ? "text-white" : "text-white/40 hover:text-white/80 hover:bg-white/4"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="drawer-pill"
                            className="absolute inset-0 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                            style={{ background: "linear-gradient(180deg,#7c3aed,#ec4899)", boxShadow: "0 0 8px rgba(168,85,247,0.7)" }}
                          />
                        </>
                      )}
                      <Icon className="text-lg shrink-0 relative z-10" />
                      <span className="relative z-10">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* ── Interview Reports dropdown ── */}
              <div className="flex flex-col flex-1 min-h-0">

                <button
                  onClick={() => setReportsOpen(!reportsOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/4 transition-all duration-200 shrink-0"
                >
                  <FiFileText className="text-lg shrink-0" />
                  <span className="flex-1 text-left">Interview Reports</span>
                  <motion.div animate={{ rotate: reportsOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <FiChevronDown className="text-sm shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {reportsOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col flex-1 min-h-0"
                    >
                      <div className="flex flex-col flex-1 min-h-0 pl-3 pr-1 pb-1">

                        {/* New Report */}
                        <NavLink
                          to="/"
                          onClick={() => setDrawerOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/35 hover:text-white/70 hover:bg-white/4 transition-all duration-200 shrink-0"
                        >
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
                          >
                            <FiPlus className="text-violet-400" style={{ fontSize: "10px" }} />
                          </div>
                          <span>New Report</span>
                        </NavLink>

                        {/* Divider */}
                        {(navLoading || allInterviewReports.length > 0) && (
                          <div className="mx-2 my-1 h-px shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
                        )}

                        {/* Loading skeleton */}
                        {navLoading ? (
                          <div className="flex flex-col gap-1.5 px-1 py-1 flex-1 min-h-0 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl shrink-0"
                                style={{
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                }}
                              >
                                <div
                                  className="w-3.5 h-3.5 rounded shrink-0 animate-pulse"
                                  style={{ background: "rgba(255,255,255,0.08)", animationDelay: `${i * 100}ms` }}
                                />
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                  <div
                                    className="h-2 rounded-full animate-pulse"
                                    style={{ background: "rgba(255,255,255,0.08)", width: `${55 + (i % 4) * 11}%`, animationDelay: `${i * 100}ms` }}
                                  />
                                  <div
                                    className="h-1.5 rounded-full animate-pulse"
                                    style={{ background: "rgba(255,255,255,0.04)", width: "38%", animationDelay: `${i * 100 + 50}ms` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                        ) : allInterviewReports.length === 0 ? (
                          /* Empty state */
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl shrink-0">
                            <FiClock className="text-white/20 text-sm shrink-0" />
                            <span className="text-white/25 text-xs">No reports yet</span>
                          </div>

                        ) : (
                          /* Scrollable reports list */
                          <div
                            className="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0 pr-1"
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "rgba(168,85,247,0.3) transparent",
                            }}
                          >
                            {allInterviewReports.map((report) => (
                              <NavLink
                                key={report._id}
                                to={`/interview/${report._id}`}
                                replace
                                onClick={() => setDrawerOpen(false)}
                                className={({ isActive }) =>
                                  `group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                                    isActive ? "text-white bg-white/6" : "text-white/40 hover:text-white/75 hover:bg-white/4"
                                  }`
                                }
                              >
                                <FiClock className="text-sm shrink-0 opacity-50" />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate leading-tight">{report.title}</p>
                                  {report.date && (
                                    <p className="text-white/25 text-[10px] mt-0.5">{report.date}</p>
                                  )}
                                </div>

                                {/* Delete button — visible on hover, spinner while deleting */}
                                <button
                                  onClick={(e) => handleDeleteReport(e, report._id)}
                                  disabled={deletingId === report._id}
                                  className="shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 hover:scale-110"
                                  style={{
                                    background: "rgba(239,68,68,0.12)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(239,68,68,0.25)";
                                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                                  }}
                                >
                                  {deletingId === report._id ? (
                                    <svg
                                      className="animate-spin"
                                      width={9} height={9}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <circle cx="12" cy="12" r="10" stroke="rgba(248,113,113,0.3)" strokeWidth="3" />
                                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                  ) : (
                                    <FiTrash2 className="text-red-400" size={9} />
                                  )}
                                </button>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </nav>

            {/* ── Bottom actions ── */}
            {user && onLogout && (
              <div className="px-3 pb-10 flex flex-col gap-2 shrink-0">
                <div className="h-px mb-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                <NavLink
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/4 transition-all duration-200"
                >
                  <FiUser className="text-lg" />
                  My Profile
                </NavLink>
                <button
                  onClick={() => { setDrawerOpen(false); onLogout(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
