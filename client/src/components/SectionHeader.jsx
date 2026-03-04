import React, { useState } from "react";

const SectionHeader = ({ icon: Icon, color, title, count }) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30` }}
    >
      <Icon style={{ color }} className="text-base" />
    </div>
    <h2 className="text-white font-semibold text-base tracking-tight">
      {title}
    </h2>
    {count !== undefined && (
      <span
        className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
        style={{
          background: `${color}15`,
          color,
          border: `1px solid ${color}25`,
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default SectionHeader;
