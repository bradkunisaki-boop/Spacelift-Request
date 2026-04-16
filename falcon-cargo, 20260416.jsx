import { useState, useRef } from "react";
import * as XLSX from "xlsx";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');`;

/* ─── CHEWBACCA SVG LOGO ─── */
const ChewieLogo = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="26" cy="27" rx="19" ry="20" fill="#6B3A1F"/>
    <ellipse cx="9"  cy="20" rx="5" ry="6" fill="#5A2E14"/>
    <ellipse cx="43" cy="20" rx="5" ry="6" fill="#5A2E14"/>
    <ellipse cx="26" cy="28" rx="14" ry="15" fill="#7D4422"/>
    <path d="M18 16 Q20 12 22 15" stroke="#5A2E14" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M22 14 Q26 10 30 14" stroke="#5A2E14" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M30 15 Q32 12 34 16" stroke="#5A2E14" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M14 24 Q20 20 26 21 Q32 20 38 24" stroke="#3D1F08" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <ellipse cx="19" cy="28" rx="4.5" ry="4" fill="#1A0A00"/>
    <ellipse cx="33" cy="28" rx="4.5" ry="4" fill="#1A0A00"/>
    <circle cx="20.5" cy="26.5" r="1.4" fill="#FF9900" opacity="0.9"/>
    <circle cx="34.5" cy="26.5" r="1.4" fill="#FF9900" opacity="0.9"/>
    <circle cx="21.2" cy="26" r="0.5" fill="white" opacity="0.8"/>
    <circle cx="35.2" cy="26" r="0.5" fill="white" opacity="0.8"/>
    <ellipse cx="26" cy="34" rx="5" ry="3.5" fill="#2D1005"/>
    <ellipse cx="24" cy="33.5" rx="1.8" ry="1.4" fill="#1A0A00"/>
    <ellipse cx="28" cy="33.5" rx="1.8" ry="1.4" fill="#1A0A00"/>
    <path d="M20 39 Q26 43 32 39" stroke="#2D1005" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="24" y="39" width="4" height="2.5" rx="0.5" fill="#E8D8B0" opacity="0.8"/>
    <path d="M8 44 Q26 52 44 44" stroke="#C8A020" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
    <circle cx="17" cy="49" r="2" fill="#C8A020"/>
    <circle cx="26" cy="51" r="2" fill="#C8A020"/>
    <circle cx="35" cy="49" r="2" fill="#C8A020"/>
    <circle cx="17" cy="49" r="1" fill="#8B6010"/>
    <circle cx="26" cy="51" r="1" fill="#8B6010"/>
    <circle cx="35" cy="49" r="1" fill="#8B6010"/>
    <path d="M20 42 Q18 46 17 48" stroke="#5A2E14" strokeWidth="1" strokeLinecap="round" fill="none"/>
    <path d="M26 44 Q26 47 26 49" stroke="#5A2E14" strokeWidth="1" strokeLinecap="round" fill="none"/>
    <path d="M32 42 Q34 46 35 48" stroke="#5A2E14" strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>
);

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080a0d; }

  .app {
    min-height: 100vh;
    background: #0c0e12;
    color: #f0dfa0;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(255,180,0,0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(255,120,0,0.04) 0%, transparent 50%),
      repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,180,0,0.01) 3px, rgba(255,180,0,0.01) 4px);
  }

  .scanline {
    pointer-events: none;
    position: fixed; inset: 0; z-index: 9999;
    background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px);
  }

  .header {
    padding: 16px 32px;
    border-bottom: 1px solid rgba(255,190,50,0.3);
    display: flex; align-items: center; gap: 16px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(10px);
    position: sticky; top: 0; z-index: 100;
  }
  .header-titles { display: flex; flex-direction: column; gap: 3px; }
  .header-title {
    font-family: 'Orbitron', monospace;
    font-size: 17px; font-weight: 900;
    color: #ffd050;
    text-shadow: 0 0 18px rgba(255,208,80,0.7), 0 0 40px rgba(255,179,0,0.3);
    letter-spacing: 3px;
  }
  .header-sub { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #b89a50; letter-spacing: 2px; }
  .header-badge {
    margin-left: auto;
    background: rgba(255,200,50,0.1); border: 1px solid rgba(255,200,50,0.35);
    padding: 5px 16px; border-radius: 2px;
    font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #d4a840; letter-spacing: 1px;
  }

  .tabs { display: flex; border-bottom: 1px solid rgba(255,190,50,0.15); background: rgba(0,0,0,0.5); }
  .tab {
    padding: 13px 22px;
    font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 600; letter-spacing: 2px;
    color: #8a7040; cursor: pointer; border: none; background: none;
    border-bottom: 2px solid transparent; transition: all 0.2s; text-transform: uppercase;
  }
  .tab:hover { color: #d4b060; }
  .tab.active { color: #ffd050; border-bottom-color: #ffd050; background: rgba(255,210,80,0.06); text-shadow: 0 0 10px rgba(255,210,80,0.5); }
  .tab-badge { margin-left: 7px; background: rgba(255,200,50,0.2); border-radius: 10px; padding: 1px 7px; font-size: 9px; color: #ffd050; }

  .content { padding: 28px 32px; max-width: 1400px; margin: 0 auto; }

  .section { margin-bottom: 32px; }
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .section-label { font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 3px; color: #a08040; text-transform: uppercase; white-space: nowrap; }
  .section-line { flex: 1; height: 1px; background: linear-gradient(to right, rgba(255,200,50,0.35), transparent); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 18px; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #a08040; letter-spacing: 2px; text-transform: uppercase; }
  .field input, .field select, .field textarea {
    background: rgba(255,200,50,0.06); border: 1px solid rgba(255,200,50,0.25); border-radius: 2px;
    color: #f5e6b0; font-family: 'Share Tech Mono', monospace; font-size: 13px;
    padding: 9px 12px; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; width: 100%;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: rgba(255,210,80,0.7); background: rgba(255,200,50,0.1);
    box-shadow: 0 0 0 2px rgba(255,200,50,0.1), 0 0 12px rgba(255,200,50,0.12);
  }
  .field input::placeholder { color: #5a4820; }
  .field select option { background: #1a1500; color: #f0dfa0; }

  .pill-group { display: flex; gap: 8px; }
  .pill {
    flex: 1; padding: 9px 12px; text-align: center;
    border: 1px solid rgba(255,200,50,0.2); border-radius: 2px;
    font-family: 'Share Tech Mono', monospace; font-size: 11px;
    cursor: pointer; background: rgba(255,200,50,0.03); color: #7a6030;
    transition: all 0.15s; letter-spacing: 1px;
  }
  .pill:hover { border-color: rgba(255,200,50,0.45); color: #d4b060; }
  .pill.p-low.active  { background: rgba(80,200,100,0.15); border-color: #50c864; color: #70e080; box-shadow: 0 0 10px rgba(80,200,100,0.2); }
  .pill.p-med.active  { background: rgba(255,200,50,0.15); border-color: #ffd050; color: #ffd050; box-shadow: 0 0 10px rgba(255,210,80,0.25); }
  .pill.p-high.active { background: rgba(255,130,30,0.15); border-color: #ff8820; color: #ffa040; box-shadow: 0 0 10px rgba(255,130,30,0.25); }
  .pill.p-crit.active { background: rgba(230,60,60,0.18); border-color: #e84040; color: #ff6060; box-shadow: 0 0 12px rgba(230,60,60,0.3); }
  .pill.s-open.active { background: rgba(80,200,100,0.12); border-color: #50c864; color: #70e080; }
  .pill.s-rest.active { background: rgba(255,200,50,0.12); border-color: #ffd050; color: #ffd050; }
  .pill.s-conf.active { background: rgba(255,130,30,0.12); border-color: #ff8820; color: #ffa040; }
  .pill.s-clas.active { background: rgba(230,60,60,0.18); border-color: #e84040; color: #ff6060; }

  .btn {
    font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 10px 20px; cursor: pointer; border-radius: 2px;
    transition: all 0.15s; border: 1px solid;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary { background: rgba(255,210,80,0.15); border-color: rgba(255,210,80,0.7); color: #ffd050; }
  .btn-primary:hover { background: rgba(255,210,80,0.25); box-shadow: 0 0 14px rgba(255,210,80,0.3); }
  .btn-secondary { background: rgba(100,180,255,0.1); border-color: rgba(100,180,255,0.5); color: #80c8ff; }
  .btn-secondary:hover { background: rgba(100,180,255,0.2); box-shadow: 0 0 14px rgba(100,180,255,0.25); }
  .btn-ghost { background: transparent; border-color: rgba(240,220,160,0.2); color: #8a7040; }
  .btn-ghost:hover { border-color: rgba(240,220,160,0.45); color: #d4b060; }
  .btn-danger { background: rgba(230,60,60,0.1); border-color: rgba(230,60,60,0.35); color: #e06060; }
  .btn-danger:hover { background: rgba(230,60,60,0.22); border-color: rgba(230,60,60,0.8); color: #ff6060; }
  .btn-sm { padding: 7px 14px; font-size: 9px; }
  .btn-xs { padding: 4px 9px; font-size: 8px; }

  .table-wrap { overflow-x: auto; border: 1px solid rgba(255,200,50,0.15); border-radius: 3px; }
  table { width: 100%; border-collapse: collapse; min-width: 900px; }
  thead tr { border-bottom: 1px solid rgba(255,200,50,0.25); }
  th {
    font-family: 'Share Tech Mono', monospace; font-size: 9px;
    color: #a08040; letter-spacing: 2px; text-transform: uppercase;
    padding: 10px 10px; text-align: left; white-space: nowrap;
    background: rgba(255,200,50,0.05);
  }
  tbody tr { border-bottom: 1px solid rgba(255,200,50,0.08); transition: background 0.12s; }
  tbody tr:hover { background: rgba(255,200,50,0.05); }
  td { padding: 7px 10px; vertical-align: middle; }
  td input, td select {
    background: transparent; border: none; border-bottom: 1px solid rgba(255,200,50,0.18);
    color: #f0dfa0; font-family: 'Share Tech Mono', monospace; font-size: 12px;
    padding: 3px 4px; width: 100%; outline: none; transition: border-color 0.2s;
  }
  td input:focus, td select:focus { border-bottom-color: rgba(255,210,80,0.7); }
  td input::placeholder { color: #4a3818; }
  td select option { background: #1a1500; color: #f0dfa0; }
  .uid { color: #806030; font-size: 10px; letter-spacing: 1px; font-family: 'Share Tech Mono', monospace; }

  .hazard-badge { padding: 2px 8px; border-radius: 2px; font-size: 10px; font-family: 'Share Tech Mono', monospace; letter-spacing: 1px; white-space: nowrap; }
  .hz-none  { background: rgba(80,200,100,0.12); color: #70e080; border: 1px solid rgba(80,200,100,0.35); }
  .hz-frag  { background: rgba(255,200,50,0.12); color: #ffd050; border: 1px solid rgba(255,200,50,0.35); }
  .hz-haz   { background: rgba(255,130,30,0.12); color: #ffa040; border: 1px solid rgba(255,130,30,0.35); }
  .hz-weap  { background: rgba(230,60,60,0.15); color: #ff6060; border: 1px solid rgba(230,60,60,0.4); }
  .hz-live  { background: rgba(160,80,230,0.15); color: #c090f8; border: 1px solid rgba(160,80,230,0.4); }

  .panel {
    background: rgba(255,200,50,0.04); border: 1px solid rgba(255,200,50,0.18);
    border-radius: 3px; padding: 20px; position: relative; overflow: hidden;
  }
  .panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,210,80,0.5), transparent);
  }

  /* ── IMPORT ── */
  .import-panel {
    background: rgba(80,160,255,0.04); border: 1px solid rgba(80,160,255,0.2);
    border-radius: 3px; padding: 20px; margin-bottom: 24px; position: relative;
  }
  .import-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(80,160,255,0.4), transparent);
  }
  .import-title { font-family: 'Orbitron', monospace; font-size: 11px; letter-spacing: 2px; color: #80c8ff; margin-bottom: 14px; }
  .import-dropzone {
    border: 2px dashed rgba(80,160,255,0.3); border-radius: 3px;
    padding: 28px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: rgba(80,160,255,0.03); margin-bottom: 16px;
  }
  .import-dropzone:hover, .import-dropzone.drag-over { border-color: rgba(80,160,255,0.7); background: rgba(80,160,255,0.08); }
  .import-icon { font-size: 28px; margin-bottom: 8px; }
  .import-hint { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: #6090b8; margin-bottom: 4px; }
  .import-sub { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #3a5878; }
  .import-instructions { background: rgba(0,0,0,0.4); border: 1px solid rgba(80,160,255,0.15); border-radius: 2px; padding: 14px 16px; }
  .instr-title { font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 2px; color: #6090b8; margin-bottom: 10px; }
  .instr-table { width: 100%; border-collapse: collapse; }
  .instr-table th { font-family: 'Share Tech Mono', monospace; font-size: 9px; color: #6090b8; letter-spacing: 1px; padding: 4px 8px; text-align: left; border-bottom: 1px solid rgba(80,160,255,0.15); background: transparent; }
  .instr-table td { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #90b8d8; padding: 4px 8px; border-bottom: 1px solid rgba(80,160,255,0.07); }
  .instr-table tr:last-child td { border-bottom: none; }
  .instr-note { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #507090; margin-top: 10px; line-height: 1.7; }
  .import-error { color: #ff7070; font-family: 'Share Tech Mono', monospace; font-size: 11px; margin-top: 10px; }
  .import-success { color: #70e080; font-family: 'Share Tech Mono', monospace; font-size: 11px; margin-top: 10px; }

  /* ── GROUPS ── */
  .group-card { border: 1px solid rgba(255,200,50,0.18); border-radius: 3px; margin-bottom: 14px; background: rgba(0,0,0,0.3); overflow: hidden; }
  .group-header { display: flex; align-items: center; gap: 12px; padding: 11px 16px; background: rgba(255,200,50,0.05); border-bottom: 1px solid rgba(255,200,50,0.12); }
  .group-type-badge { font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 2px 10px; border-radius: 2px; letter-spacing: 1px; }
  .gt-pallet    { background: rgba(255,200,50,0.12); color: #ffd050; border: 1px solid rgba(255,200,50,0.35); }
  .gt-container { background: rgba(80,180,255,0.1);  color: #70bfff; border: 1px solid rgba(80,180,255,0.35); }
  .gt-crate     { background: rgba(180,120,60,0.15); color: #c87840; border: 1px solid rgba(180,120,60,0.35); }
  .gt-bundle    { background: rgba(80,200,100,0.1);  color: #70d880; border: 1px solid rgba(80,200,100,0.35); }
  .gt-vault     { background: rgba(230,60,60,0.12);  color: #ff6060; border: 1px solid rgba(230,60,60,0.35); }
  .group-name { font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 600; color: #f0dfa0; }
  .group-items-list { padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 8px; }
  .group-item-chip { background: rgba(255,200,50,0.07); border: 1px solid rgba(255,200,50,0.2); border-radius: 2px; padding: 4px 10px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #c8a860; display: flex; align-items: center; gap: 6px; }
  .group-empty { padding: 16px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #5a4820; text-align: center; }

  .item-selector { border: 1px solid rgba(255,200,50,0.15); border-radius: 2px; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.4); }
  .item-selector-row { padding: 8px 12px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,200,50,0.07); cursor: pointer; transition: background 0.12s; }
  .item-selector-row:hover { background: rgba(255,200,50,0.07); }
  .item-selector-row.selected { background: rgba(255,200,50,0.12); }
  .item-selector-row input[type=checkbox] { accent-color: #ffd050; }

  .summary-stat { text-align: center; padding: 20px; background: rgba(255,200,50,0.04); border: 1px solid rgba(255,200,50,0.18); border-radius: 3px; }
  .stat-value { font-family: 'Orbitron', monospace; font-size: 26px; font-weight: 700; color: #ffd050; text-shadow: 0 0 14px rgba(255,210,80,0.5); }
  .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #a08040; letter-spacing: 2px; margin-top: 6px; }

  .route-display { display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255,200,50,0.04); border: 1px solid rgba(255,200,50,0.18); border-radius: 3px; margin-bottom: 20px; }
  .route-loc { flex: 1; }
  .route-loc-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #a08040; letter-spacing: 2px; }
  .route-loc-name { font-family: 'Orbitron', monospace; font-size: 14px; color: #ffd050; margin-top: 4px; }
  .route-loc-time { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #c8a860; margin-top: 3px; }
  .route-arrow { font-size: 22px; color: #5a4820; }

  .manifest-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 9px 14px; background: rgba(255,200,50,0.03); border: 1px solid rgba(255,200,50,0.1); border-radius: 2px; }
  .manifest-id { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #806030; min-width: 90px; }
  .manifest-desc { flex: 1; font-size: 14px; color: #f0dfa0; font-weight: 500; }
  .manifest-dims { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #c8a860; }

  .no-items { text-align: center; padding: 40px 20px; font-family: 'Share Tech Mono', monospace; font-size: 12px; color: #4a3818; border: 1px dashed rgba(255,200,50,0.1); border-radius: 3px; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
  ::-webkit-scrollbar-thumb { background: rgba(255,200,50,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,200,50,0.5); }
`;

const HAZARD_CLASSES = ["NONE","FRAGILE","HAZARDOUS","WEAPONS","LIFEFORMS"];
const GROUP_TYPES    = ["PALLET","CONTAINER","CRATE","BUNDLE","VAULT"];

let uidCounter = 1000;
const genUID = (prefix="CRG") => `${prefix}-${(++uidCounter).toString().padStart(5,"0")}`;

const defaultItem = () => ({
  uid: genUID("CRG"), description:"", modelNumber:"", quantity:1,
  length:"", width:"", height:"", weight:"",
  hazardClass:"NONE", declaredValue:"", tempMin:"", tempMax:"", specialHandling:"",
});
const defaultGroup = () => ({ uid:genUID("GRP"), name:"", type:"PALLET", itemIds:[], notes:"" });

const EXCEL_COLUMNS = [
  { header:"description",     field:"description",     label:"Description",      required:true,  example:"Blaster Rifle DL-44" },
  { header:"modelNumber",     field:"modelNumber",     label:"Model Number",     required:false, example:"DL-44" },
  { header:"quantity",        field:"quantity",        label:"Quantity",         required:false, example:"12" },
  { header:"length",          field:"length",          label:"Length (cm)",      required:false, example:"45.5" },
  { header:"width",           field:"width",           label:"Width (cm)",       required:false, example:"12.0" },
  { header:"height",          field:"height",          label:"Height (cm)",      required:false, example:"8.0" },
  { header:"weight",          field:"weight",          label:"Weight (kg)",      required:false, example:"1.4" },
  { header:"hazardClass",     field:"hazardClass",     label:"Hazard Class",     required:false, example:"WEAPONS" },
  { header:"declaredValue",   field:"declaredValue",   label:"Declared Value",   required:false, example:"5000" },
  { header:"tempMin",         field:"tempMin",         label:"Temp Min (C)",     required:false, example:"-20" },
  { header:"tempMax",         field:"tempMax",         label:"Temp Max (C)",     required:false, example:"40" },
  { header:"specialHandling", field:"specialHandling", label:"Special Handling", required:false, example:"Keep upright" },
];

export default function FalconCargo() {
  const [tab, setTab]           = useState("mission");
  const [movement, setMovement] = useState({
    departDate:"", departTime:"", departLocation:"",
    arrivalDate:"", arrivalTime:"", arrivalLocation:"",
    contactName:"", contactFreq:"",
    priority:"MED", sensitivity:"RESTRICTED", specialInstructions:"",
  });
  const [items,         setItems]         = useState([defaultItem()]);
  const [groups,        setGroups]        = useState([]);
  const [newGroup,      setNewGroup]      = useState(defaultGroup());
  const [showAddGroup,  setShowAddGroup]  = useState(false);
  const [showImport,    setShowImport]    = useState(false);
  const [importMsg,     setImportMsg]     = useState(null);
  const [dragOver,      setDragOver]      = useState(false);
  const fileInputRef = useRef(null);

  const setMov = (k,v) => setMovement(p=>({...p,[k]:v}));
  const addItem    = ()        => setItems(p=>[...p, defaultItem()]);
  const removeItem = (uid)     => setItems(p=>p.filter(i=>i.uid!==uid));
  const updateItem = (uid,k,v) => setItems(p=>p.map(i=>i.uid===uid?{...i,[k]:v}:i));

  const hazardBadge = (hz) => {
    const cls={NONE:"hz-none",FRAGILE:"hz-frag",HAZARDOUS:"hz-haz",WEAPONS:"hz-weap",LIFEFORMS:"hz-live"};
    return <span className={`hazard-badge ${cls[hz]||"hz-none"}`}>{hz||"NONE"}</span>;
  };
  const groupTypeCls = (t) => `gt-${(t||"pallet").toLowerCase()}`;

  const totalWeight = items.reduce((s,i)=>s+(parseFloat(i.weight)||0)*(parseInt(i.quantity)||1),0);
  const totalVolume = items.reduce((s,i)=>
    s+(parseFloat(i.length)||0)*(parseFloat(i.width)||0)*(parseFloat(i.height)||0)*(parseInt(i.quantity)||1),0);

  /* ── EXCEL IMPORT ── */
  const normalize = (s) => String(s).toLowerCase().replace(/[\s_\-()/°]/g,"");
  const colMap = {};
  EXCEL_COLUMNS.forEach(c=>{ colMap[normalize(c.header)]=c.field; colMap[normalize(c.label)]=c.field; });
  Object.assign(colMap,{
    desc:"description", model:"modelNumber", modelnumber:"modelNumber", modelno:"modelNumber",
    qty:"quantity", len:"length", wt:"weight", wgt:"weight",
    hazard:"hazardClass", hazardclass:"hazardClass", class:"hazardClass",
    value:"declaredValue", tempminc:"tempMin", tempmaxc:"tempMax",
    handling:"specialHandling", notes:"specialHandling",
  });

  const processExcelFile = (file) => {
    setImportMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb   = XLSX.read(e.target.result, { type:"array" });
        const sheet= wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval:"" });
        if (!rows.length) { setImportMsg({type:"error",text:"Spreadsheet appears to be empty."}); return; }

        const imported = rows.map(row=>{
          const item = defaultItem();
          Object.entries(row).forEach(([k,v])=>{
            const field = colMap[normalize(k)];
            if (field) {
              let val = String(v).trim();
              if (field==="hazardClass") {
                const up = val.toUpperCase();
                val = HAZARD_CLASSES.includes(up) ? up : "NONE";
              }
              item[field] = val;
            }
          });
          return item;
        }).filter(it=>it.description||it.modelNumber);

        if (!imported.length) {
          setImportMsg({type:"error",text:"No valid rows found. Ensure a 'description' or 'modelNumber' column exists."}); return;
        }
        setItems(p=>[...p.filter(i=>i.description||i.modelNumber), ...imported]);
        setImportMsg({type:"success",text:`✓ ${imported.length} item${imported.length!==1?"s":""} imported successfully.`});
        setTimeout(()=>setShowImport(false), 1500);
      } catch(err) {
        setImportMsg({type:"error",text:`Parse error: ${err.message}`});
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) processExcelFile(e.dataTransfer.files[0]);
  };

  /* ── DOWNLOAD BLANK TEMPLATE ── */
  const downloadTemplate = () => {
    const headers    = EXCEL_COLUMNS.map(c=>c.header);
    const exampleRow = EXCEL_COLUMNS.map(c=>c.example);
    const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
    // column widths
    ws["!cols"] = headers.map(()=>({wch:20}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cargo");
    XLSX.writeFile(wb, "falcon-cargo-template.xlsx");
  };

  /* ── DOWNLOAD MANIFEST (TXT) ── */
  const downloadManifest = () => {
    const pad  = (s,n)=>String(s).padEnd(n).slice(0,n);
    const hr60 = "═".repeat(60);
    const hr100= "─".repeat(100);
    const lines = [
      "MILLENNIUM FALCON CARGO MANIFEST",
      "YT-1300F LIGHT FREIGHTER  ·  CHARTER MANIFEST SYSTEM",
      hr60,"",
      "MISSION PARAMETERS",
      "─".repeat(40),
      `ORIGIN       :  ${movement.departLocation||"—"}`,
      `DEPART       :  ${movement.departDate||"—"}  ${movement.departTime||""}`,
      `DESTINATION  :  ${movement.arrivalLocation||"—"}`,
      `ARRIVE       :  ${movement.arrivalDate||"—"}  ${movement.arrivalTime||""}`,
      `CONTACT      :  ${movement.contactName||"—"}    FREQ: ${movement.contactFreq||"—"}`,
      `PRIORITY     :  ${movement.priority}`,
      `SENSITIVITY  :  ${movement.sensitivity}`,
    ];
    if (movement.specialInstructions) {
      lines.push("","SPECIAL INSTRUCTIONS:",movement.specialInstructions);
    }
    lines.push("","CARGO MANIFEST","─".repeat(40),
      `TOTAL ITEMS  :  ${items.length}`,
      `TOTAL MASS   :  ${totalWeight.toFixed(1)} kg`,
      `TOTAL VOLUME :  ${(totalVolume/1e6).toFixed(3)} m³`,"",
      pad("UID",12)+pad("DESCRIPTION",28)+pad("MODEL",14)+pad("QTY",5)+pad("L×W×H (cm)",20)+pad("WT(kg)",8)+"HAZARD",
      hr100,
    );
    items.forEach(it=>{
      const dims=(it.length&&it.width&&it.height)?`${it.length}×${it.width}×${it.height}`:"—";
      lines.push(pad(it.uid,12)+pad(it.description||"(unnamed)",28)+pad(it.modelNumber||"—",14)+pad(it.quantity,5)+pad(dims,20)+pad(it.weight||"—",8)+(it.hazardClass||"NONE"));
    });
    if (groups.length) {
      lines.push("","CARGO GROUPS","─".repeat(40));
      groups.forEach(g=>{
        lines.push(`[${g.type}]  ${g.name}  (${g.uid})`);
        g.itemIds.forEach(iUid=>{
          const it=items.find(x=>x.uid===iUid);
          if(it) lines.push(`  └─  ${it.uid}  ${it.description||"(unnamed)"}  ×${it.quantity}`);
        });
      });
    }
    lines.push("",hr60,`MANIFEST GENERATED: ${new Date().toISOString()}`,"");

    const blob = new Blob([lines.join("\n")],{type:"text/plain"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="falcon-cargo-manifest.txt";
    a.click(); URL.revokeObjectURL(url);
  };

  const toggleItemInNewGroup = (uid) => setNewGroup(p=>({...p, itemIds:p.itemIds.includes(uid)?p.itemIds.filter(x=>x!==uid):[...p.itemIds,uid]}));
  const saveGroup   = ()    => { if(!newGroup.name.trim())return; setGroups(p=>[...p,{...newGroup,uid:genUID("GRP")}]); setNewGroup(defaultGroup()); setShowAddGroup(false); };
  const removeGroup = (uid) => setGroups(p=>p.filter(g=>g.uid!==uid));
  const removeItemFromGroup = (gUid,iUid) => setGroups(p=>p.map(g=>g.uid===gUid?{...g,itemIds:g.itemIds.filter(x=>x!==iUid)}:g));
  const getItem = (uid) => items.find(i=>i.uid===uid);

  return (
    <div className="app">
      <style>{css}</style>
      <div className="scanline"/>

      {/* HEADER */}
      <div className="header">
        <ChewieLogo/>
        <div className="header-titles">
          <div className="header-title">MILLENNIUM FALCON CARGO</div>
          <div className="header-sub">YT-1300F LIGHT FREIGHTER · CHARTER MANIFEST SYSTEM</div>
        </div>
        <div className="header-badge">CORELLIAN ENGINEERING CORP</div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {[{id:"mission",label:"Mission Parameters"},{id:"manifest",label:"Cargo Manifest",count:items.length},{id:"groups",label:"Cargo Groups",count:groups.length},{id:"summary",label:"Shipment Summary"}].map(t=>(
          <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
            {t.label}{t.count!==undefined&&<span className="tab-badge">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="content">

        {/* ══ MISSION ══ */}
        {tab==="mission"&&(
          <div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Departure</span><div className="section-line"/></div>
              <div className="grid-3">
                <div className="field"><label className="field-label">Departure Location</label><input placeholder="e.g. Mos Eisley Spaceport, Tatooine" value={movement.departLocation} onChange={e=>setMov("departLocation",e.target.value)}/></div>
                <div className="field"><label className="field-label">Departure Date</label><input type="date" value={movement.departDate} onChange={e=>setMov("departDate",e.target.value)}/></div>
                <div className="field"><label className="field-label">Departure Time (GST)</label><input type="time" value={movement.departTime} onChange={e=>setMov("departTime",e.target.value)}/></div>
              </div>
            </div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Arrival</span><div className="section-line"/></div>
              <div className="grid-3">
                <div className="field"><label className="field-label">Arrival Location</label><input placeholder="e.g. Cloud City, Bespin" value={movement.arrivalLocation} onChange={e=>setMov("arrivalLocation",e.target.value)}/></div>
                <div className="field"><label className="field-label">Arrival Date</label><input type="date" value={movement.arrivalDate} onChange={e=>setMov("arrivalDate",e.target.value)}/></div>
                <div className="field"><label className="field-label">Arrival Time (GST)</label><input type="time" value={movement.arrivalTime} onChange={e=>setMov("arrivalTime",e.target.value)}/></div>
              </div>
            </div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Contact &amp; Comms</span><div className="section-line"/></div>
              <div className="grid-2">
                <div className="field"><label className="field-label">Contact Name</label><input placeholder="e.g. Lando Calrissian" value={movement.contactName} onChange={e=>setMov("contactName",e.target.value)}/></div>
                <div className="field"><label className="field-label">Comm Frequency</label><input placeholder="e.g. 138.40 MHz" value={movement.contactFreq} onChange={e=>setMov("contactFreq",e.target.value)}/></div>
              </div>
            </div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Priority Level</span><div className="section-line"/></div>
              <div className="pill-group" style={{maxWidth:500}}>
                {[{v:"LOW",cls:"p-low",label:"LOW"},{v:"MED",cls:"p-med",label:"STANDARD"},{v:"HIGH",cls:"p-high",label:"HIGH"},{v:"CRITICAL",cls:"p-crit",label:"CRITICAL"}].map(p=>(
                  <div key={p.v} className={`pill ${p.cls} ${movement.priority===p.v?"active":""}`} onClick={()=>setMov("priority",p.v)}>{p.label}</div>
                ))}
              </div>
            </div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Cargo Sensitivity</span><div className="section-line"/></div>
              <div className="pill-group" style={{maxWidth:500}}>
                {[{v:"OPEN",cls:"s-open",label:"OPEN"},{v:"RESTRICTED",cls:"s-rest",label:"RESTRICTED"},{v:"CONFIDENTIAL",cls:"s-conf",label:"CONFIDENTIAL"},{v:"CLASSIFIED",cls:"s-clas",label:"CLASSIFIED"}].map(p=>(
                  <div key={p.v} className={`pill ${p.cls} ${movement.sensitivity===p.v?"active":""}`} onClick={()=>setMov("sensitivity",p.v)}>{p.label}</div>
                ))}
              </div>
            </div>
            <div className="section">
              <div className="section-header"><span className="section-label">▶ Special Instructions</span><div className="section-line"/></div>
              <div className="field">
                <label className="field-label">Notes for Crew</label>
                <textarea rows={4} placeholder="e.g. Do not discuss cargo with Imperial checkpoints. Avoid Kessel route if possible." value={movement.specialInstructions} onChange={e=>setMov("specialInstructions",e.target.value)} style={{resize:"vertical",fontFamily:"'Share Tech Mono', monospace",fontSize:13,color:"#f0dfa0"}}/>
              </div>
            </div>
          </div>
        )}

        {/* ══ MANIFEST ══ */}
        {tab==="manifest"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#a08040",letterSpacing:2}}>
                {items.length} ITEM{items.length!==1?"S":""} · {totalWeight.toFixed(1)} kg · {(totalVolume/1e6).toFixed(3)} m³
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-secondary btn-sm" onClick={()=>{setShowImport(v=>!v);setImportMsg(null);}}>⬆ IMPORT EXCEL</button>
                <button className="btn btn-primary btn-sm" onClick={addItem}>+ ADD ITEM</button>
              </div>
            </div>

            {showImport&&(
              <div className="import-panel">
                <div className="import-title">⬆ IMPORT CARGO FROM EXCEL / CSV</div>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processExcelFile(e.target.files[0]);e.target.value="";}}/>
                <div className={`import-dropzone ${dragOver?"drag-over":""}`}
                  onClick={()=>fileInputRef.current.click()}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleFileDrop}>
                  <div className="import-icon">📂</div>
                  <div className="import-hint">Drop .xlsx, .xls, or .csv file here — or click to browse</div>
                  <div className="import-sub">Imported rows are appended to the current manifest</div>
                </div>
                {importMsg&&<div className={importMsg.type==="success"?"import-success":"import-error"}>{importMsg.text}</div>}

                <div className="import-instructions">
                  <div className="instr-title">▶ REQUIRED SPREADSHEET FORMAT</div>
                  <p style={{fontFamily:"'Share Tech Mono', monospace",fontSize:10,color:"#6090b8",marginBottom:10,lineHeight:1.6}}>
                    Row 1 must be a <strong style={{color:"#80c8ff"}}>header row</strong>. Column names are case-insensitive and spaces/underscores are ignored.
                    Only <strong style={{color:"#80c8ff"}}>description</strong> is required — all other columns are optional.
                  </p>
                  <table className="instr-table">
                    <thead><tr><th>Column Header</th><th>Required?</th><th>Example Value</th></tr></thead>
                    <tbody>
                      {EXCEL_COLUMNS.map(c=>(
                        <tr key={c.field}>
                          <td style={{color:c.required?"#80c8ff":"#90b8d8"}}>{c.header}</td>
                          <td style={{color:c.required?"#70e080":"#5a7890"}}>{c.required?"YES":"no"}</td>
                          <td style={{color:"#708090"}}>{c.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="instr-note">
                    <strong style={{color:"#6090b8"}}>hazardClass</strong> must be one of: NONE · FRAGILE · HAZARDOUS · WEAPONS · LIFEFORMS (case-insensitive, invalid values default to NONE).<br/>
                    Dimensions in centimetres · weight in kilograms · temperature in °C · value in credits.<br/>
                    Rows missing both description and modelNumber are skipped.
                  </div>
                </div>

                <div style={{marginTop:14,display:"flex",gap:10}}>
                  <button className="btn btn-secondary btn-sm" onClick={downloadTemplate}>⬇ DOWNLOAD BLANK TEMPLATE</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{setShowImport(false);setImportMsg(null);}}>CLOSE</button>
                </div>
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UID</th><th>Description</th><th>Model #</th><th>Qty</th>
                    <th>L (cm)</th><th>W (cm)</th><th>H (cm)</th><th>Wt (kg)</th>
                    <th>Hazard</th><th>Value</th><th>Temp Min °C</th><th>Temp Max °C</th>
                    <th>Special Handling</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item=>(
                    <tr key={item.uid}>
                      <td><span className="uid">{item.uid}</span></td>
                      <td><input value={item.description} onChange={e=>updateItem(item.uid,"description",e.target.value)} placeholder="Cargo description" style={{minWidth:140}}/></td>
                      <td><input value={item.modelNumber}  onChange={e=>updateItem(item.uid,"modelNumber",e.target.value)}  placeholder="MDL-XXX" style={{minWidth:90}}/></td>
                      <td><input type="number" min="1" value={item.quantity} onChange={e=>updateItem(item.uid,"quantity",e.target.value)} style={{width:55}}/></td>
                      <td><input type="number" value={item.length} onChange={e=>updateItem(item.uid,"length",e.target.value)} placeholder="0" style={{width:58}}/></td>
                      <td><input type="number" value={item.width}  onChange={e=>updateItem(item.uid,"width",e.target.value)}  placeholder="0" style={{width:58}}/></td>
                      <td><input type="number" value={item.height} onChange={e=>updateItem(item.uid,"height",e.target.value)} placeholder="0" style={{width:58}}/></td>
                      <td><input type="number" value={item.weight} onChange={e=>updateItem(item.uid,"weight",e.target.value)} placeholder="0" style={{width:68}}/></td>
                      <td>
                        <select value={item.hazardClass} onChange={e=>updateItem(item.uid,"hazardClass",e.target.value)} style={{minWidth:100}}>
                          {HAZARD_CLASSES.map(h=><option key={h} value={h}>{h}</option>)}
                        </select>
                      </td>
                      <td><input type="number" value={item.declaredValue} onChange={e=>updateItem(item.uid,"declaredValue",e.target.value)} placeholder="0" style={{width:78}}/></td>
                      <td><input type="number" value={item.tempMin} onChange={e=>updateItem(item.uid,"tempMin",e.target.value)} placeholder="—" style={{width:62}}/></td>
                      <td><input type="number" value={item.tempMax} onChange={e=>updateItem(item.uid,"tempMax",e.target.value)} placeholder="—" style={{width:62}}/></td>
                      <td><input value={item.specialHandling} onChange={e=>updateItem(item.uid,"specialHandling",e.target.value)} placeholder="Notes..." style={{minWidth:120}}/></td>
                      <td><button className="btn btn-danger btn-xs" onClick={()=>removeItem(item.uid)} title="Remove">✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
              <button className="btn btn-primary btn-sm" onClick={addItem}>+ ADD ITEM</button>
            </div>
          </div>
        )}

        {/* ══ GROUPS ══ */}
        {tab==="groups"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#a08040",letterSpacing:2}}>
                {groups.length} GROUP{groups.length!==1?"S":""} · {groups.reduce((s,g)=>s+g.itemIds.length,0)} ASSIGNED ITEMS
              </div>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowAddGroup(true)}>+ NEW GROUP</button>
            </div>

            {showAddGroup&&(
              <div className="panel" style={{marginBottom:24}}>
                <div style={{fontFamily:"'Orbitron', monospace",fontSize:11,letterSpacing:2,color:"#ffd050",marginBottom:16}}>CREATE CARGO GROUP</div>
                <div className="grid-3" style={{marginBottom:16}}>
                  <div className="field"><label className="field-label">Group Name</label><input value={newGroup.name} onChange={e=>setNewGroup(p=>({...p,name:e.target.value}))} placeholder="e.g. Blaster Pallet Alpha"/></div>
                  <div className="field">
                    <label className="field-label">Group Type</label>
                    <select value={newGroup.type} onChange={e=>setNewGroup(p=>({...p,type:e.target.value}))}>
                      {GROUP_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field"><label className="field-label">Notes</label><input value={newGroup.notes} onChange={e=>setNewGroup(p=>({...p,notes:e.target.value}))} placeholder="e.g. Secure with durasteel straps"/></div>
                </div>
                <div style={{marginBottom:10,fontFamily:"'Share Tech Mono', monospace",fontSize:10,color:"#a08040",letterSpacing:2}}>SELECT ITEMS TO INCLUDE</div>
                <div className="item-selector" style={{marginBottom:16}}>
                  {items.length===0
                    ?<div style={{padding:12,fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#4a3818"}}>No cargo items defined yet.</div>
                    :items.map(item=>(
                      <div key={item.uid} className={`item-selector-row ${newGroup.itemIds.includes(item.uid)?"selected":""}`} onClick={()=>toggleItemInNewGroup(item.uid)}>
                        <input type="checkbox" readOnly checked={newGroup.itemIds.includes(item.uid)}/>
                        <span style={{fontFamily:"'Share Tech Mono', monospace",fontSize:10,color:"#806030",minWidth:90}}>{item.uid}</span>
                        <span style={{flex:1,color:"#f0dfa0",fontSize:13}}>{item.description||"(unnamed)"}</span>
                        <span style={{fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#a08040"}}>Qty: {item.quantity}</span>
                        {hazardBadge(item.hazardClass)}
                      </div>
                    ))
                  }
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-primary btn-sm" onClick={saveGroup}>SAVE GROUP</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{setShowAddGroup(false);setNewGroup(defaultGroup());}}>CANCEL</button>
                </div>
              </div>
            )}

            {groups.length===0&&!showAddGroup&&(
              <div className="no-items">
                ◈ NO CARGO GROUPS DEFINED<br/>
                <span style={{fontSize:10,marginTop:6,display:"block"}}>Create groups to palletize, containerize, or bundle related cargo items</span>
              </div>
            )}

            {groups.map(group=>(
              <div key={group.uid} className="group-card">
                <div className="group-header">
                  <span className={`group-type-badge ${groupTypeCls(group.type)}`}>{group.type}</span>
                  <span className="group-name">{group.name}</span>
                  <span className="uid" style={{marginLeft:4}}>{group.uid}</span>
                  {group.notes&&<span style={{fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#a08040",fontStyle:"italic",marginLeft:4}}>— {group.notes}</span>}
                  <span style={{marginLeft:"auto",fontFamily:"'Share Tech Mono', monospace",fontSize:10,color:"#806030"}}>{group.itemIds.length} ITEM{group.itemIds.length!==1?"S":""}</span>
                  <button className="btn btn-danger btn-xs" onClick={()=>removeGroup(group.uid)}>✕ REMOVE</button>
                </div>
                {group.itemIds.length===0
                  ?<div className="group-empty">No items assigned to this group</div>
                  :<div className="group-items-list">
                    {group.itemIds.map(iUid=>{
                      const it=getItem(iUid); if(!it)return null;
                      return(
                        <div key={iUid} className="group-item-chip">
                          <span style={{color:"#806030",fontSize:10}}>{it.uid}</span>
                          <span>{it.description||"(unnamed)"}</span>
                          <span style={{color:"#806030",fontSize:10}}>×{it.quantity}</span>
                          <span style={{cursor:"pointer",color:"rgba(220,80,80,0.6)",fontSize:12}} onClick={()=>removeItemFromGroup(group.uid,iUid)} title="Remove from group">✕</span>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            ))}
          </div>
        )}

        {/* ══ SUMMARY ══ */}
        {tab==="summary"&&(
          <div>
            <div className="route-display">
              <div className="route-loc">
                <div className="route-loc-label">◀ ORIGIN</div>
                <div className="route-loc-name">{movement.departLocation||"—"}</div>
                <div className="route-loc-time">{movement.departDate} {movement.departTime}</div>
              </div>
              <div className="route-arrow">→→→</div>
              <div className="route-loc" style={{textAlign:"right"}}>
                <div className="route-loc-label">DESTINATION ▶</div>
                <div className="route-loc-name">{movement.arrivalLocation||"—"}</div>
                <div className="route-loc-time">{movement.arrivalDate} {movement.arrivalTime}</div>
              </div>
            </div>

            <div className="grid-4" style={{marginBottom:28}}>
              <div className="summary-stat"><div className="stat-value">{items.length}</div><div className="stat-label">CARGO ITEMS</div></div>
              <div className="summary-stat"><div className="stat-value">{totalWeight.toFixed(0)}</div><div className="stat-label">TOTAL MASS (kg)</div></div>
              <div className="summary-stat"><div className="stat-value">{(totalVolume/1e6).toFixed(2)}</div><div className="stat-label">TOTAL VOLUME (m³)</div></div>
              <div className="summary-stat"><div className="stat-value">{groups.length}</div><div className="stat-label">CARGO GROUPS</div></div>
            </div>

            <div style={{display:"flex",gap:10,marginBottom:28,flexWrap:"wrap"}}>
              {[{label:"PRIORITY",val:movement.priority},{label:"SENSITIVITY",val:movement.sensitivity},{label:"CONTACT",val:movement.contactName||"UNASSIGNED"}].map(t=>(
                <div key={t.label} style={{background:"rgba(255,200,50,0.06)",border:"1px solid rgba(255,200,50,0.2)",padding:"8px 16px",borderRadius:2}}>
                  <div style={{fontFamily:"'Share Tech Mono', monospace",fontSize:9,color:"#a08040",letterSpacing:2}}>{t.label}</div>
                  <div style={{fontFamily:"'Orbitron', monospace",fontSize:12,color:"#ffd050",marginTop:4}}>{t.val}</div>
                </div>
              ))}
            </div>

            <div className="section">
              <div className="section-header"><span className="section-label">▶ Cargo Manifest</span><div className="section-line"/></div>
              {items.length===0
                ?<div className="no-items">No cargo items defined.</div>
                :items.map(item=>(
                  <div key={item.uid} className="manifest-row">
                    <span className="manifest-id">{item.uid}</span>
                    <span className="manifest-desc">{item.description||"(unnamed)"}</span>
                    <span className="manifest-dims">{item.length&&item.width&&item.height?`${item.length}×${item.width}×${item.height} cm`:""}</span>
                    <span className="manifest-dims" style={{minWidth:60}}>{item.weight?`${item.weight} kg`:""}</span>
                    <span className="manifest-dims" style={{minWidth:50}}>×{item.quantity}</span>
                    {hazardBadge(item.hazardClass)}
                  </div>
                ))
              }
            </div>

            {groups.length>0&&(
              <div className="section">
                <div className="section-header"><span className="section-label">▶ Group Assignments</span><div className="section-line"/></div>
                {groups.map(g=>(
                  <div key={g.uid} style={{marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                    <span className={`group-type-badge ${groupTypeCls(g.type)}`}>{g.type}</span>
                    <span style={{fontFamily:"'Orbitron', monospace",fontSize:12,color:"#f0dfa0"}}>{g.name}</span>
                    <span style={{fontFamily:"'Share Tech Mono', monospace",fontSize:11,color:"#a08040"}}>→ {g.itemIds.map(id=>getItem(id)?.description||id).join(", ")}</span>
                  </div>
                ))}
              </div>
            )}

            {movement.specialInstructions&&(
              <div className="section">
                <div className="section-header"><span className="section-label">▶ Special Instructions</span><div className="section-line"/></div>
                <div className="panel">
                  <div style={{fontFamily:"'Share Tech Mono', monospace",fontSize:12,color:"#c8a860",lineHeight:1.8}}>{movement.specialInstructions}</div>
                </div>
              </div>
            )}

            <div style={{marginTop:24,display:"flex",gap:12}}>
              <button className="btn btn-primary" onClick={()=>alert("Manifest transmitted to Millennium Falcon crew. May the Force be with your cargo.")}>
                ▶ TRANSMIT TO CREW
              </button>
              <button className="btn btn-secondary" onClick={downloadManifest}>
                ⬇ DOWNLOAD MANIFEST
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
