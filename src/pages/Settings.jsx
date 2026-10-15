import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Shield, Database, Save, Check } from 'lucide-react';

export default function Settings() {
  const [detectionConfidence, setDetectionConfidence] = useState(0.40);
  const [iouThreshold, setIouThreshold] = useState(0.25);
  const [temporalWindow, setTemporalWindow] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-rose-500" />
          Settings & Inference Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure computer vision thresholds, temporal window sizes, and deployment parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          Collision Detection Engine Hyperparameters
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Object Detection Confidence Threshold</label>
              <span className="font-mono text-rose-400 font-bold">{Math.round(detectionConfidence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={detectionConfidence}
              onChange={(e) => setDetectionConfidence(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Minimum model probability for vehicles and pedestrians. Lower values capture distant objects at higher false-positive risk.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Collision Bounding-Box Contact (IoU) Threshold</label>
              <span className="font-mono text-rose-400 font-bold">{Math.round(iouThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={iouThreshold}
              onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Intersection over Union threshold required between two vehicle boxes to register a collision contact signal.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Temporal Analysis Window (Frames)</label>
              <span className="font-mono text-rose-400 font-bold">{temporalWindow} frames</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="5"
              value={temporalWindow}
              onChange={(e) => setTemporalWindow(parseInt(e.target.value, 10))}
              className="w-full accent-rose-500"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sliding frame window used to calculate deceleration slope and post-impact immobilization.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>SQLite Active / PostgreSQL Compatible Schema</span>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-rose-950/40"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Parameters Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
