import { useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

const EditableField = ({
  label,
  value,
  icon: Icon,
  iconColor,
  type = "text",
  onChange,
  disabled = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  /* sync if parent value changes (e.g. reset) */
  if (!editing && val !== value) setVal(value);

  const handleSave = () => {
    onChange?.(val);
    setEditing(false);
  };
  const handleCancel = () => {
    setVal(value);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/25 text-[10px] uppercase tracking-[0.15em] font-bold pl-1">
        {label}
      </label>
      <div
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: editing
            ? "rgba(168,85,247,0.07)"
            : "rgba(255,255,255,0.03)",
          border: `1px solid ${editing ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.07)"}`,
          boxShadow: editing ? "0 0 0 3px rgba(168,85,247,0.08)" : "none",
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `${iconColor}12`,
            border: `1px solid ${iconColor}22`,
          }}
        >
          <Icon style={{ color: iconColor }} className="text-xs" />
        </div>

        {editing ? (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              autoFocus
              type={type}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white/85 text-sm min-w-0"
              style={{ caretColor: "#a855f7" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handleSave}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                <FiCheck className="text-green-400" size={12} />
              </button>
              <button
                onClick={handleCancel}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{
                  background: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.25)",
                }}
              >
                <FiX className="text-red-400" size={12} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="flex-1 text-white/60 text-sm truncate">
              {val || <span className="text-white/20 italic">Not set</span>}
            </span>
            {!disabled && (
              <button
                onClick={() => setEditing(true)}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <FiEdit2 className="text-white/40" size={11} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableField;
