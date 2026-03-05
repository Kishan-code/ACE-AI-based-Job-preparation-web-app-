import { useState, useRef, use, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useBlocker, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiFileText,
  FiTrash2,
  FiCamera,
  FiZap,
  FiAward,
  FiSave,
  FiX,
} from "react-icons/fi";
import SectionHeader from "../components/SectionHeader";
import EditableField from "../components/EditableField";
import DeleteModal from "../components/DeleteModal";
import { deleteUserThunk, updateProfileThunk } from "../store/features/user/user.thunk";
import { toast } from "react-toastify";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── score color ── */
const scoreColor = (s) =>
  s >= 70
    ? {
        bg: "rgba(34,197,94,0.12)",
        text: "#4ade80",
        border: "rgba(34,197,94,0.3)",
      }
    : s >= 50
      ? {
          bg: "rgba(168,85,247,0.12)",
          text: "#c084fc",
          border: "rgba(168,85,247,0.3)",
        }
      : {
          bg: "rgba(234,179,8,0.12)",
          text: "#facc15",
          border: "rgba(234,179,8,0.3)",
        };

/* ── GlassCard ── */
const GlassCard = ({ children, className = "", style = {} }) => (
  <div
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow:
        "0 4px 24px -4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── TopGlow ── */
const TopGlow = ({ color = "rgba(168,85,247,0.6)" }) => (
  <div
    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
    style={{
      background: `linear-gradient(90deg,transparent 5%,${color} 50%,transparent 95%)`,
    }}
  />
);

/* ── Stat Pill ── */
const StatPill = ({ icon: Icon, value, label, color }) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
    style={{ background: `${color}10`, border: `1px solid ${color}25` }}
  >
    <Icon style={{ color }} size={11} />
    <span className="text-white font-bold text-xs">{value}</span>
    <span className="text-white/35 text-xs">{label}</span>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const allInterviewReports = useSelector(
    (state) => state.interview.allInterviewReports,
  );
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); 
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  /* ── profile state ── */
  const [profile, setProfile] = useState({
    name: user?.fullname,
    username: user?.username,
    email: user?.email,
  });

  /* ── avatar state ── */
  const [avatarFile, setAvatarFile] = useState(null); // File object
  const [avatarPreview, setAvatarPreview] = useState(
    user.profilePicture || null,
  ); // data-URL for preview
  const fileInputRef = useRef(null);

  /* ── dirty tracking: true when anything changed ── */
  const [savedProfile, setSavedProfile] = useState({ ...profile });
  const [savedAvatar, setSavedAvatar] = useState(user.profilePicture || null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isProfileDirty =
    profile.name !== savedProfile.name ||
    profile.username !== savedProfile.username ||
    profile.email !== savedProfile.email ||
    avatarPreview !== savedAvatar ||
    avatarRemoved;

  /* ── handlers ── */
  const handleFieldChange = (key) => (val) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) return toast.error("file must be less than 3MB");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const formData = new FormData();
    if (profile.name !== savedProfile.name)
      formData.append("fullname", profile.name);
    if (profile.username !== savedProfile.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(profile.username)){
        setIsSaving(false);
        return toast.error(
          "username should contain 3-20 characters and do not contain any special character other than underscore( _ )",
        );
      }
      formData.append("username", profile.username);
    }
    if (avatarPreview !== savedAvatar)
      formData.append("profilePicture", avatarFile);
    try {
      await dispatch(updateProfileThunk(formData)).unwrap();
      setSavedProfile({ ...profile });
      setSavedAvatar(avatarPreview);
      setAvatarRemoved(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfile({ ...savedProfile });
    setAvatarPreview(savedAvatar);
    setAvatarFile(null);
    setAvatarRemoved(false);
  };

  /* ── derived ── */
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ── navigation guard: block if unsaved changes ── */
  const blocker = useBlocker(isProfileDirty);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const initials = (profile.name || profile.username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const topScore = allInterviewReports.length
    ? Math.max(...allInterviewReports.map((r) => r.matchScore ?? 0))
    : null;

  const currentAvatar = avatarRemoved ? null : avatarPreview || savedAvatar; 


  const deleteAccount = async (password) => {
    try {
      await dispatch(deleteUserThunk( password )).unwrap();
    } catch (error) {
      console.error("Error deleting account:", efrror);
    }
  };


  useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login", { replace: true });
  }
}, [isAuthenticated]);

  return (
    <>
      <div
        className="md:ml-66.5 min-h-dvh overflow-x-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0f0c1a 0%,#14101f 55%,#0c0c18 100%)",
        }}
      >
        {/* ambient glows */}
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute -top-32 right-0 w-130 h-130 rounded-full"
            style={{
              background: "rgba(124,58,237,0.08)",
              filter: "blur(120px)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-100 h-100 rounded-full"
            style={{
              background: "rgba(236,72,153,0.05)",
              filter: "blur(140px)",
            }}
          />
          <div
            className="absolute bottom-0 -left-10 w-115 h-115 rounded-full"
            style={{
              background: "rgba(59,130,246,0.05)",
              filter: "blur(130px)",
            }}
          />
        </div>

        <div className="relative z-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-14">
          {/* ── Page heading ── */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-violet-300/90 mb-4"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              My Account
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              Profile
            </h1>
            <p className="text-white/30 text-sm mt-2">
              Manage your account details and preferences.
            </p>
          </motion.div>

          <div className="flex flex-col gap-5">
            {/* ════ HERO CARD ════ */}
            <motion.div {...fadeUp(0.06)}>
              <GlassCard>
                <TopGlow color="rgba(168,85,247,0.7)" />

                {/* gradient banner */}
                <div
                  className="h-24 w-full relative"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(109,40,217,0.5) 0%,rgba(168,85,247,0.25) 40%,rgba(236,72,153,0.2) 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div
                    className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle,rgba(168,85,247,0.8),transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute top-2 right-28 w-16 h-16 rounded-full opacity-15"
                    style={{
                      background:
                        "radial-gradient(circle,rgba(236,72,153,0.8),transparent 70%)",
                    }}
                  />
                </div>

                <div className="px-6 pb-6">
                  {/* avatar row */}
                  <div className="flex items-end justify-between -mt-10 mb-4">
                    <div className="relative">
                      {/* hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white select-none overflow-hidden"
                        style={{
                          background: currentAvatar
                            ? "transparent"
                            : "linear-gradient(135deg,#7c3aed,#ec4899)",
                          border: "3px solid #0f0c1a",
                          boxShadow:
                            "0 8px 32px -4px rgba(168,85,247,0.6), 0 0 0 1px rgba(168,85,247,0.2)",
                        }}
                      >
                        {currentAvatar ? (
                          <img
                            src={currentAvatar}
                            alt="avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      {/* camera btn */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:brightness-110 cursor-pointer"
                        style={{
                          background: "rgba(168,85,247,0.25)",
                          border: "1px solid rgba(168,85,247,0.45)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <FiCamera className="text-violet-300" size={11} />
                      </button>

                      {/* remove avatar btn — only shown when avatar is set */}
                      {currentAvatar && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                          style={{
                            background: "rgba(239,68,68,0.25)",
                            border: "1px solid rgba(239,68,68,0.45)",
                            backdropFilter: "blur(8px)",
                          }}
                          title="Remove photo"
                        >
                          <FiX className="text-red-300" size={10} />
                        </button>
                      )}
                    </div>

                    {/* top score badge */}
                    {topScore !== null && (
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-1"
                        style={{
                          background: "rgba(168,85,247,0.1)",
                          border: "1px solid rgba(168,85,247,0.22)",
                        }}
                      >
                        <FiAward className="text-violet-400" size={13} />
                        <span className="text-violet-300 text-xs font-bold">
                          {topScore}% top match
                        </span>
                      </div>
                    )}
                  </div>

                  {/* name */}
                  <h2 className="text-white font-black text-xl leading-none tracking-tight">
                    {profile.name || profile.username}
                  </h2>
                  <p className="text-white/35 text-sm mt-1">
                    @{profile.username}
                  </p>

                  {/* stat pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <StatPill
                      icon={FiFileText}
                      value={allInterviewReports.length}
                      label={`report${allInterviewReports.length !== 1 ? "s" : ""}`}
                      color="#a855f7"
                    />
                    <StatPill
                      icon={FiCalendar}
                      value={joinDate}
                      label="joined"
                      color="#3b82f6"
                    />
                    <StatPill
                      icon={FiZap}
                      value="Active"
                      label="session"
                      color="#4ade80"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* ════ ACCOUNT DETAILS ════ */}
            <motion.div {...fadeUp(0.12)}>
              <GlassCard className="p-5">
                <TopGlow color="rgba(168,85,247,0.55)" />
                <SectionHeader
                  icon={FiUser}
                  color="#a855f7"
                  title="Account Details"
                />
                <div className="flex flex-col gap-3.5">
                  <EditableField
                    label="Full Name"
                    value={profile.name}
                    icon={FiUser}
                    iconColor="#a855f7"
                    onChange={handleFieldChange("name")}
                  />
                  <EditableField
                    label="Username"
                    value={profile.username}
                    icon={FiUser}
                    iconColor="#ec4899"
                    onChange={handleFieldChange("username")}
                  />
                  <EditableField
                    label="Email Address"
                    value={profile.email}
                    icon={FiMail}
                    iconColor="#3b82f6"
                    type="email"
                    disabled
                  />
                </div>
              </GlassCard>
            </motion.div>

            {/* ════ UPDATE PROFILE BANNER (visible only when dirty) ════ */}
            <AnimatePresence>
              {isProfileDirty && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl flex-wrap"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(168,85,247,0.1))",
                      border: "1px solid rgba(168,85,247,0.35)",
                      boxShadow:
                        "0 0 30px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(168,85,247,0.2)",
                          border: "1px solid rgba(168,85,247,0.4)",
                        }}
                      >
                        <FiSave className="text-violet-300" size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/90 text-sm font-bold leading-none">
                          Unsaved changes
                        </p>
                        <p className="text-white/35 text-xs mt-1">
                          Your profile has been modified but not saved yet.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDiscardChanges}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        Discard
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: isSaving ? 1 : 1.03 }}
                        whileTap={{ scale: isSaving ? 1 : 0.97 }}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg,rgba(124,58,237,0.5),rgba(168,85,247,0.35))",
                          border: "1px solid rgba(168,85,247,0.55)",
                          color: isSaving ? "rgba(233,213,255,0.5)" : "#e9d5ff",
                          boxShadow: "0 0 20px rgba(168,85,247,0.25)",
                          cursor: isSaving ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin shrink-0"
                              width={13}
                              height={13}
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="rgba(233,213,255,0.25)"
                                strokeWidth="3"
                              />
                              <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="#e9d5ff"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span>Saving…</span>
                          </>
                        ) : (
                          <>
                            <FiSave size={13} />
                            <span>Update Profile</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ════ RECENT REPORTS ════ */}
            <motion.div {...fadeUp(0.2)}>
              <GlassCard className="p-5">
                <TopGlow color="rgba(249,115,22,0.55)" />
                <div className="flex items-center justify-between mb-5">
                  <SectionHeader
                    icon={FiFileText}
                    color="#f97316"
                    title="Recent Reports"
                  />
                  {allInterviewReports.length > 0 && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full -mt-5"
                      style={{
                        background: "rgba(249,115,22,0.12)",
                        color: "#f97316",
                        border: "1px solid rgba(249,115,22,0.28)",
                      }}
                    >
                      {allInterviewReports.length} total
                    </span>
                  )}
                </div>

                {allInterviewReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <FiFileText className="text-white/15" size={22} />
                    </div>
                    <p className="text-white/20 text-sm">
                      No reports generated yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {allInterviewReports.slice(0, 4).map((report, i) => {
                      const sc = scoreColor(report.matchScore ?? 0);
                      return (
                        <NavLink
                          key={report._id || i}
                          to={`/interview/${report._id}`}
                          className="group flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200"
                          style={{
                            border: "1px solid rgba(255,255,255,0.06)",
                            background: "rgba(255,255,255,0.01)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.01)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.06)";
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(249,115,22,0.1)",
                              border: "1px solid rgba(249,115,22,0.22)",
                            }}
                          >
                            <FiFileText className="text-orange-400" size={13} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/65 text-sm font-medium truncate leading-tight group-hover:text-white/90 transition-colors">
                              {report.title || "Untitled Report"}
                            </p>
                            {report.createdAt && (
                              <p className="text-white/22 text-[10px] mt-0.5">
                                {new Date(report.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            )}
                          </div>
                          {report.matchScore != null && (
                            <div
                              className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                background: sc.bg,
                                color: sc.text,
                                border: `1px solid ${sc.border}`,
                              }}
                            >
                              {report.matchScore}%
                            </div>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}

                {allInterviewReports.length > 4 && (
                  <p className="text-white/20 text-xs text-center mt-3">
                    +{allInterviewReports.length - 4} more in history
                  </p>
                )}
              </GlassCard>
            </motion.div>

            {/* ════ ACTIONS ════ */}
            <motion.div {...fadeUp(0.24)}>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.975 }}
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                style={{
                  color: "rgba(248,113,113,0.4)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f87171";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.28)";
                  e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(248,113,113,0.4)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <FiTrash2 size={15} /> Delete account
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={(password) => {
              setShowDeleteModal(false);
              deleteAccount(password);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Navigation guard popup ── */}
      <AnimatePresence>
        {blocker.state === "blocked" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-7 w-full max-w-md"
              style={{
                background:
                  "linear-gradient(160deg,rgba(20,16,35,0.99),rgba(15,12,26,0.99))",
                border: "1px solid rgba(234,179,8,0.25)",
                boxShadow:
                  "0 32px 80px -8px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(234,179,8,0.5),transparent)",
                }}
              />
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(234,179,8,0.1)",
                  border: "1px solid rgba(234,179,8,0.25)",
                  boxShadow: "0 0 20px rgba(234,179,8,0.15)",
                }}
              >
                <FiSave className="text-yellow-400" size={20} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1.5">
                Unsaved changes
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                You have unsaved profile changes. If you leave now they will be
                lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => blocker.reset()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    setProfile({ ...savedProfile });
                    setAvatarPreview(savedAvatar);
                    setAvatarFile(null);
                    setAvatarRemoved(false);
                    blocker.proceed();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "rgba(234,179,8,0.15)",
                    border: "1px solid rgba(234,179,8,0.4)",
                    color: "#fbbf24",
                    boxShadow: "0 0 20px rgba(234,179,8,0.12)",
                  }}
                >
                  Leave anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
