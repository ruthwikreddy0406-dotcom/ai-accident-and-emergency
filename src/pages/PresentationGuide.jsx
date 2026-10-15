import React from 'react';
import { Link } from 'react-router-dom';
import {
  Presentation, CheckCircle2, ShieldCheck, PlayCircle,
  Activity, ArrowRight, Eye, Server, MapPin, Ambulance, AlertTriangle
} from 'lucide-react';

export default function PresentationGuide() {
  const steps = [
    {
      num: '1',
      title: 'Executive Overview & Live KPI Command Center',
      desc: 'Inspect real-time incident counters, false positive rate on reviewed sample, and active camera network health.',
      link: '/',
      linkText: 'Go to Dashboard',
    },
    {
      num: '2',
      title: 'Ingestion Studio: Upload & Temporal Computer Vision',
      desc: 'Demonstrate upload of road video or click the fast-track synthetic stream accelerator. Observe frame extraction, object detection (cars/trucks/pedestrians), multi-object trajectory tracking, and temporal contact collision scoring.',
      link: '/video-analysis',
      linkText: 'Open Video Studio',
    },
    {
      num: '3',
      title: 'Inspect Detected Collision Dossier & Visual HUD Overlays',
      desc: 'Review annotated evidence snapshot, bounding boxes, velocity vectors, explainable signal breakdown (IoU overlap, acute deceleration spike, post-impact immobilization), and missing signal transparency.',
      link: '/incidents/INC-A94F81B2',
      linkText: 'Inspect Sample Dossier',
    },
    {
      num: '4',
      title: 'Human-in-the-Loop Triage & Verification',
      desc: 'Showcase that AI provides probabilistic candidate predictions, never unquestioned proof. Confirm the crash or mark a false positive with mandatory justification note in the immutable audit log.',
      link: '/incidents',
      linkText: 'View Incident Registry',
    },
    {
      num: '5',
      title: 'Simulated Emergency Dispatch Coordination',
      desc: 'Demonstrate simulated multi-agency response dispatch (EMS ambulance, police highway patrol, towing/clearance). Highlight our strict safety sandbox: no real 911 calls are placed without verified manual authorization.',
      link: '/response',
      linkText: 'Open Response Coordination',
    },
    {
      num: '6',
      title: 'Empirical Model Evaluation & Precision/Recall Metrics',
      desc: 'Inspect ground truth confusion matrix, F1 score, and CSV data export generated from verified database records.',
      link: '/analytics',
      linkText: 'Open Analytics & Evaluation',
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
            <Presentation className="w-3.5 h-3.5" />
            Hackathon Judge Walkthrough Guide
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            RoadGuard AI Presentation Mode
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            A 5-minute guided itinerary demonstrating end-to-end accident candidate detection, temporal multi-signal heuristics, human verification workflows, and safe simulated emergency dispatch.
          </p>
        </div>
      </div>

      {/* 5-Minute Demonstration Steps */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-rose-500" />
          5-Minute Live Demonstration Itinerary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 font-mono font-black text-sm flex items-center justify-center mb-3 border border-rose-500/30">
                  {st.num}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{st.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{st.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <Link
                  to={st.link}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1.5"
                >
                  {st.linkText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Diagram (Section 4 & 24 Requirement) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          End-to-End System Pipeline Architecture
        </h2>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">INGESTION</span>
              <span className="font-bold text-rose-400">Road Video / CCTV</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">DETECTION & TRACK</span>
              <span className="font-bold text-indigo-400">Centroid Trajectories</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">TEMPORAL HEURISTICS</span>
              <span className="font-bold text-amber-400">Multi-Signal Score</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">DISPATCH WORKFLOW</span>
              <span className="font-bold text-emerald-400">Verified SOP Coordination</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Ethics Principles (Section 2 & 7 Requirement) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Trustworthy AI & Safety Guarantees
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white">Probabilistic Predictions</h4>
            <p className="text-slate-400">
              The platform communicates uncertainty through confidence scores and missing signal breakdowns rather than claiming absolute certainty.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white">No Fabricated Telemetry</h4>
            <p className="text-slate-400">
              If GPS or location is absent from camera metadata, the system explicitly shows "Location unavailable". Coordinates are never randomly hallucinated.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white">Simulated Emergency Dispatch</h4>
            <p className="text-slate-400">
              Emergency assistance actions operate in a simulated testbed by default to protect public 911 infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
