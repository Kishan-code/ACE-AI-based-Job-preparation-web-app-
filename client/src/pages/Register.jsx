import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

import { MdOutlineMail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../store/features/user/user.thunk";

const Register = () => {
;

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);

  const [showPassword, setShowPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    email:"",
    username:"",
    password:"",
  });

const registerHandler = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const passwordRegex = /^.{8,}$/;

  if (!registerData.email || !registerData.username || !registerData.password) {
    return toast.error("All fields are required");
  }

  if (!emailRegex.test(registerData.email)) {
    return toast.error("Email should be in correct format");
  }

  if (!usernameRegex.test(registerData.username)) {
    return toast.error(
      "Username should be 3-20 characters and only contain letters, numbers, and underscore"
    );
  }

  if (!passwordRegex.test(registerData.password)) {
    return toast.error(
      "Password must be at least 8 characters long"
    );
  }

  try {
    const res = await dispatch(registerUserThunk(registerData)).unwrap();

    if (res.success) {
      setRegisterData({
        email: "",
        username: "",
        password: "",
      });
    }

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18]">

      {/* Soft ambient glow behind card */}
      <div className="absolute w-80 h-80 rounded-full bg-purple-700/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="w-96 rounded-2xl p-8 shadow-2xl shadow-purple-900/40 backdrop-blur-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
        }}
      >
        {/* Title */}
        <h1 className="text-white text-3xl font-bold text-center mb-1 tracking-tight">
          Create Account
        </h1>
        <p className="text-white/40 text-sm text-center mb-8">
          Join us today, it's free
        </p>

        {/* Email Field */}
        <div className="mb-4">
          <label className="text-white/50 text-xs uppercase tracking-widest block mb-1.5">
            Email
          </label>
          <div
            className="group w-full h-11 flex gap-2.5 items-center rounded-xl transition-all duration-200 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.6)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <MdOutlineMail className="text-white/30 ml-3 group-focus-within:text-violet-400 text-lg shrink-0 transition-colors duration-200" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-full px-1 outline-none bg-transparent text-white/80 placeholder:text-white/20 text-sm"

              name="email"
              value={registerData.email}
              onChange={(e)=>(setRegisterData({...registerData,[e.target.name]:e.target.value}))}
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="text-white/50 text-xs uppercase tracking-widest block mb-1.5">
            Username
          </label>
          <div
            className="group w-full h-11 flex gap-2.5 items-center rounded-xl transition-all duration-200 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.6)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <FiUser className="text-white/30 ml-3 group-focus-within:text-violet-400 text-lg shrink-0 transition-colors duration-200" />
            <input
              type="text"
              placeholder="your username"
              className="w-full h-full px-1 outline-none bg-transparent text-white/80 placeholder:text-white/20 text-sm"

              name="username"
              value={registerData.username}
              onChange={(e)=>(setRegisterData({...registerData,[e.target.name]:e.target.value}))}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-7">
          <label className="text-white/50 text-xs uppercase tracking-widest block mb-1.5">
            Password
          </label>
          <div
            className="group w-full h-11 px-3 flex gap-2.5 items-center rounded-xl transition-all duration-200 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.6)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <IoLockClosedOutline className="text-white/30 group-focus-within:text-violet-400 text-lg shrink-0 transition-colors duration-200" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="create a password"
              className="w-full h-full px-1 outline-none bg-transparent text-white/80 placeholder:text-white/20 text-sm"

              name="password"
              value={registerData.password}
              onChange={(e)=>(setRegisterData({...registerData,[e.target.name]:e.target.value}))}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/30 hover:text-white/60 transition-colors duration-200 shrink-0 cursor-pointer"
            >
              {showPassword
                ? <BiShow className="text-xl group-focus-within:text-violet-400" />
                : <BiHide className="text-xl group-focus-within:text-violet-400" />
              }
            </button>
          </div>
        </div>

        {/* Register Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full h-11 rounded-xl font-semibold text-white text-sm tracking-wide mb-6 ${loading? "opacity-50 pointer-events-none":"cursor-pointer"}`}
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
            boxShadow: "0 4px 24px -4px rgba(168, 85, 247, 0.5)",
          }}

          onClick={registerHandler}

        >
          {loading? "Loading..." : "Create Account"}
        </motion.button>

        {/* Divider */}
        <div className="relative flex items-center mb-5">
          <div className="flex-1 h-px bg-white/8" />
          <span className="px-3 text-white/20 text-xs tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Footer */}
        <p className="text-white/40 text-sm text-center">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium"
          >
            Login
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
