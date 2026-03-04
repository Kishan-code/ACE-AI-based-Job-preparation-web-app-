import React, { useState } from "react";
import logo from "../assets/logo1.png";
import { motion, AnimatePresence } from "motion/react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiChevronDown,
  FiLogOut,
  FiClock,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteInterviewReportThunk } from "../store/features/interview/interview.thunk";


const DesktopSidebar = ({
  Avatar,
  user = { name: "John Doe", username: "johndoe", avatar: null },
  onLogout,
}) => {
  const dispatch = useDispatch();
  const allInterviewReports = useSelector(
    (state) => state.interview.allInterviewReports,
  );
  const navLoading = useSelector((state) => state.interview.navLoading);

  const navigate = useNavigate();

  const [reportsOpen, setReportsOpen] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const topLinks = [{ label: "Home", to: "/", icon: FiHome }];

  const handleDeleteReport = async (e, reportId) => {
    e.preventDefault();   // prevent NavLink navigation
    e.stopPropagation();  // prevent event bubbling to NavLink
    if (deletingId === reportId) return;
    setDeletingId(reportId);
    try {
      await dispatch(deleteInterviewReportThunk(reportId)).unwrap();
      return navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to delete report:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.aside
      animate={{ width: "250px", opacity: 1 }}
      initial={{ width: "100px", opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-4 bottom-4 z-50 hidden md:flex flex-col rounded-2xl backdrop-blur-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow:
          "0 8px 32px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)",
        }}
      />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 overflow-hidden">
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center">
          <span className="text-white text-sm font-black">
            <img src={logo} alt="ACE Logo" />
          </span>
        </div>
        <span className="text-white font-semibold text-base tracking-widest whitespace-nowrap">
          ACE
        </span>
      </div>

      <div
        className="mx-3 h-px mb-3"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-2 flex-1 overflow-hidden min-h-0">
        {/* Home */}
        {topLinks.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                isActive ? "text-white" : "text-white/40 hover:text-white/80"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <>
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{
                        background: "linear-gradient(180deg,#7c3aed,#ec4899)",
                        boxShadow: "0 0 8px rgba(168,85,247,0.7)",
                      }}
                    />
                  </>
                )}
                <Icon className="text-lg shrink-0 relative z-10" />
                <span className="relative z-10 whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* ── Interview Reports dropdown ── */}
        <div className="flex flex-col flex-1 min-h-0">
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            className="group w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-white/40 hover:text-white/80 shrink-0"
          >
            <FiFileText className="text-lg shrink-0" />
            <span className="flex-1 text-left whitespace-nowrap">
              Interview Reports
            </span>
            <motion.div
              animate={{ rotate: reportsOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
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
                  {/* New Report shortcut */}
                  <NavLink
                    to="/"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/35 hover:text-white/70 hover:bg-white/4 transition-all duration-200 shrink-0"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        border: "1px solid rgba(168,85,247,0.3)",
                      }}
                    >
                      <FiPlus
                        className="text-violet-400"
                        style={{ fontSize: "10px" }}
                      />
                    </div>
                    <span>New Report</span>
                  </NavLink>

                  {/* Divider */}
                  {!navLoading && allInterviewReports.length > 0 && (
                    <div
                      className="mx-2 my-1 h-px shrink-0"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  )}
                  {navLoading && (
                    <div
                      className="mx-2 my-1 h-px shrink-0"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
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
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              animationDelay: `${i * 100}ms`,
                            }}
                          />
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <div
                              className="h-2 rounded-full animate-pulse"
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                width: `${55 + (i % 4) * 11}%`,
                                animationDelay: `${i * 100}ms`,
                              }}
                            />
                            <div
                              className="h-1.5 rounded-full animate-pulse"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                width: "38%",
                                animationDelay: `${i * 100 + 50}ms`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : allInterviewReports.length === 0 ? (
                    /* Empty state */
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl shrink-0">
                      <FiClock className="text-white/20 text-sm shrink-0" />
                      <span className="text-white/25 text-xs">
                        No reports yet
                      </span>
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
                          className={({ isActive }) =>
                            `group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                              isActive
                                ? "text-white bg-white/6"
                                : "text-white/40 hover:text-white/75 hover:bg-white/4"
                            }`
                          }
                        >
                          <FiClock className="text-sm shrink-0 opacity-50" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate leading-tight">
                              {report.title}
                            </p>
                            {report.date && (
                              <p className="text-white/25 text-[10px] mt-0.5">
                                {report.date}
                              </p>
                            )}
                          </div>

                          {/* Delete button — appears on hover, spinner while deleting */}
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
                                width={9}
                                height={9}
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12" cy="12" r="10"
                                  stroke="rgba(248,113,113,0.3)"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M12 2a10 10 0 0 1 10 10"
                                  stroke="#f87171"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
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

      {/* Bottom section */}
      {user && onLogout && (
        <div className="px-2 pb-4 flex flex-col gap-1">
          <div
            className="mx-1 h-px mb-2"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 overflow-hidden ${
                isActive
                  ? "text-white bg-white/6"
                  : "text-white/40 hover:text-white/75 hover:bg-white/4"
              }`
            }
          >
            <Avatar />
            <div className="flex flex-col min-w-0">
              <span className="text-white/80 text-sm font-medium truncate leading-tight">
                {user?.username || user?.name}
              </span>
              <span className="text-white/25 text-xs">View profile</span>
            </div>
          </NavLink>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogout}
            className="group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden"
            style={{ color: "rgba(248,113,113,0.7)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.background = "rgba(239,68,68,0.09)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(248,113,113,0.7)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FiLogOut className="text-lg shrink-0" />
            <span className="whitespace-nowrap">Logout</span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
};

export default DesktopSidebar;
