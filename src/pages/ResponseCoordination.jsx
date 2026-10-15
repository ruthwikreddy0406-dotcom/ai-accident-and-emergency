import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ambulance, ShieldAlert, Send, CheckCircle2, Clock,
  ArrowRight, ShieldCheck, AlertTriangle, RefreshCw, FileText
} from 'lucide-react';
import { api } from '../api/client';
import SeverityBadge from '../components/common/SeverityBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function ResponseCoordination() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dispatchType, setDispatchType] = useState('DISPATCH_EMS');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents({ limit: 50 });
      // Prioritize incidents in response-eligible states
      setIncidents(data || []);
      if (data && data.length > 0 && !selectedIncident) {
        const priority = data.find((i) => i.workflow_status === 'RESPONSE_REQUESTED' || i.verification_state === 'VERIFIED') || data[0];
        setSelectedIncident(priority);
      }
    } catch (err) {
      console.error('Error fetching coordination incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleExecuteDispatch = async () => {
    if (!selectedIncident) return;
    setActionLoading(true);
    try {
      await api.logResponseAction(
        selectedIncident.id,
        dispatchType,
        dispatchNotes || 'Coordinated emergency assistance dispatch request',
        true
      );
      setConfirmModal(false);
      setDispatchNotes('');
      // Reload selected incident
      const updated = await api.getIncidentById(selectedIncident.id);
      setSelectedIncident(updated);
      fetchIncidents();
    } catch (err) {
      alert(`Dispatch execution failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusTransition = async (status) => {
    if (!selectedIncident) return;
    setActionLoading(true);
    try {
      await api.updateIncidentStatus(selectedIncident.id, status, `Response workflow transition to ${status}`);
      const updated = await api.getIncidentById(selectedIncident.id);
      setSelectedIncident(updated);
      fetchIncidents();
    } catch (err) {
      alert(`Status transition failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-rose-500" />
            Emergency Response Coordination Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard Operating Procedure (SOP) dispatch console with multi-agency simulation protocols.
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Mandatory Safety Policy Banner (Section 7 Safety Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong>Safety Protocol Active:</strong> To prevent false dispatches and accidental 911 dialing, all response coordination actions execute in simulated testbed mode. Integrations generate verified mock telemetry references and log non-repudiation audit trails.
        </div>
      </div>

      {/* Main Grid: Active Queue on Left, Coordination Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Incident Queue */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Response Action Queue ({incidents.length})
            </h2>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1 flex-1">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-rose-500/80 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-white">{inc.id}</span>
                    <SeverityBadge severity={inc.severity} />
                  </div>
                  <p className="text-slate-300 line-clamp-1">{inc.description}</p>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                    <StatusBadge status={inc.workflow_status} />
                    <span className="text-slate-500 font-mono">
                      {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Selected Incident Dispatch & Workflow Controls */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <>
              {/* Selected Dossier Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-white font-mono">
                      {selectedIncident.id}
                    </span>
                    <SeverityBadge severity={selectedIncident.severity} />
                    <StatusBadge status={selectedIncident.workflow_status} />
                  </div>

                  <Link
                    to={`/incidents/${selectedIncident.id}`}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open Full Evidence Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIncident.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Location</span>
                    <span className="text-slate-200">
                      {selectedIncident.location_description || 'Location unavailable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Vehicles Involved</span>
                    <span className="text-slate-200 capitalize">
                      {selectedIncident.vehicle_types?.join(', ') || 'Vehicle'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Verification State</span>
                    <span className={`font-bold ${
                      selectedIncident.verification_state === 'VERIFIED'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {selectedIncident.verification_state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Coordination Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-rose-400" />
                  Initiate Simulated Emergency Dispatch
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDispatchType('DISPATCH_EMS')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dispatchType === 'DISPATCH_EMS'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Ambulance className="w-5 h-5 mb-1.5 text-rose-400" />
                    <div className="font-bold text-xs">Medical (EMS)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ambulance & Paramedic Unit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispatchType('NOTIFY_POLICE')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dispatchType === 'NOTIFY_POLICE'
                        ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5 mb-1.5 text-blue-400" />
                    <div className="font-bold text-xs">Police / Highway Patrol</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Traffic control & perimeter</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispatchType('ROAD_CLEARANCE')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dispatchType === 'ROAD_CLEARANCE'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Send className="w-5 h-5 mb-1.5 text-amber-400" />
                    <div className="font-bold text-xs">Road Clearance & Tow</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Heavy tow & hazard removal</div>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Dispatch Transmission Notes
                  </label>
                  <textarea
                    rows="3"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="Enter dispatch notes, lane status, or hazards (e.g. Vehicle blocking left 2 lanes, debris detected)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmModal(true)}
                  disabled={actionLoading}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Emergency Assistance Request
                </button>
              </div>

              {/* Workflow State Lifecycle Control */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Lifecycle State Progression
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusTransition('RESPONSE_ACKNOWLEDGED')}
                    disabled={actionLoading}
                    className="px-3.5 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Mark Response Acknowledged
                  </button>
                  <button
                    onClick={() => handleStatusTransition('RESOLVED')}
                    disabled={actionLoading}
                    className="px-3.5 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Mark Scene Resolved
                  </button>
                  <button
                    onClick={() => handleStatusTransition('CLOSED')}
                    disabled={actionLoading}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Close Incident
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/60 rounded-2xl border border-slate-800">
              Select an incident from the queue to coordinate response actions.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal (Section 7 Requirement) */}
      {confirmModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm Simulated Dispatch</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are authorizing a simulated emergency response dispatch for incident{' '}
              <strong className="text-white font-mono">{selectedIncident.id}</strong>.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
              <div>Type: <span className="text-rose-400 font-bold">{dispatchType}</span></div>
              <div>Location: <span className="text-slate-300">{selectedIncident.location_description || 'Coordinates Unavailable'}</span></div>
              <div>Notes: <span className="text-slate-400">{dispatchNotes || 'Standard Dispatch'}</span></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDispatch}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
