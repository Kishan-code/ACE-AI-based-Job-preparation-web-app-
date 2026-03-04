import React from "react";
import { motion } from "motion/react";
import logo from "../assets/logo1.png";


const Loader = () => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-linear-to-br from-[#0f0c1a] via-[#14101f] to-[#0c0c18]">

      {/* Ambient blobs */}
      <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(124,58,237,0.12)" }} />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(236,72,153,0.1)" }} />

      {/* Spinner */}
      <div className="relative flex items-center justify-center w-20 h-20">

        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 65%, #a855f7, #ec4899)",
            padding: "2.5px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Inner counter-spin ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full"
          style={{
            background: "conic-gradient(from 90deg, transparent 70%, rgba(124,58,237,0.7))",
            padding: "1.5px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Center logo badge */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
        >
          <img src={logo} alt="ACE Logo" className="w-full h-full object-contain object-center" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
