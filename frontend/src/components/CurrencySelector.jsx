// CurrencySelector.jsx — reusable dropdown
// Place this file in: src/components/CurrencySelector.jsx
//
// Usage:
//   import CurrencySelector from "../../components/CurrencySelector";
//   <CurrencySelector value={currency} onChange={setCurrency} />

import { useState, useRef, useEffect } from "react";
import { CURRENCIES } from "../utils/currency";
import { ChevronDown } from "lucide-react";

export default function CurrencySelector({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (code) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');

        .cs-wrap { position: relative; display: inline-block; font-family: 'Outfit', sans-serif; }

        .cs-trigger {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 13px; border-radius: 100px;
          border: 1.5px solid #e4e4e0; background: #fff;
          cursor: pointer; font-family: 'Outfit', sans-serif;
          font-size: 13.5px; font-weight: 600; color: #222;
          transition: border-color 0.15s, box-shadow 0.15s;
          white-space: nowrap; user-select: none;
        }
        .cs-trigger:hover { border-color: #aaa; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
        .cs-trigger.open { border-color: #0d0d0d; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }

        .cs-flag { font-size: 16px; line-height: 1; }
        .cs-code { font-size: 13px; font-weight: 700; letter-spacing: 0.03em; }
        .cs-chevron { color: #888; transition: transform 0.2s; flex-shrink: 0; }
        .cs-chevron.open { transform: rotate(180deg); }

        .cs-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #fff; border: 1.5px solid #e4e4e0; border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          min-width: 210px; z-index: 9000; overflow: hidden;
          animation: csIn 0.18s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes csIn { from{opacity:0;transform:translateY(-6px) scale(0.97)} to{opacity:1;transform:none} }

        .cs-header {
          padding: 10px 14px 8px; font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: #bbb;
          border-bottom: 1px solid #f2f2ef;
        }

        .cs-option {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; cursor: pointer; transition: background 0.12s;
          border: none; background: none; width: 100%; text-align: left;
          font-family: 'Outfit', sans-serif;
        }
        .cs-option:hover { background: #f7f7f4; }
        .cs-option.active { background: #f0fdf4; }

        .cs-opt-flag { font-size: 18px; line-height: 1; flex-shrink: 0; }
        .cs-opt-info { flex: 1; }
        .cs-opt-code { font-size: 13px; font-weight: 700; color: #111; display: flex; align-items: center; gap: 6px; }
        .cs-opt-label { font-size: 11.5px; color: #999; font-weight: 400; margin-top: 1px; }
        .cs-opt-symbol { font-size: 11px; font-weight: 500; color: #aaa; background: #f0f0ec; padding: 2px 7px; border-radius: 5px; }
        .cs-check { color: #16a34a; font-size: 16px; flex-shrink: 0; }
      `}</style>

      <div className={`cs-wrap ${className}`} ref={ref}>
        <button className={`cs-trigger ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)} type="button">
          <span className="cs-flag">{current.flag}</span>
          <span className="cs-code">{current.code}</span>
          <ChevronDown size={13} strokeWidth={2.5} className={`cs-chevron ${open ? "open" : ""}`} />
        </button>

        {open && (
          <div className="cs-dropdown">
            <div className="cs-header">Select Currency</div>
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                className={`cs-option ${c.code === value ? "active" : ""}`}
                onClick={() => select(c.code)}
                type="button"
              >
                <span className="cs-opt-flag">{c.flag}</span>
                <span className="cs-opt-info">
                  <span className="cs-opt-code">
                    {c.code}
                    <span className="cs-opt-symbol">{c.symbol}</span>
                  </span>
                  <div className="cs-opt-label">{c.label}</div>
                </span>
                {c.code === value && <span className="cs-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
