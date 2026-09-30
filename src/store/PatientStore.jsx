import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PATIENT_REGISTRY } from '../data/mockMongoData';

/**
 * VitaSync shared patient store.
 *
 * Holds the full patient roster and the currently selected patient. State is
 * persisted to localStorage so added / deleted patients and the active
 * selection survive navigation and page refreshes. Both the Patients page and
 * the Dashboard read from this single source of truth.
 */

const STORAGE_KEY = 'vitasync.patients.v1';
const ACTIVE_KEY = 'vitasync.activePatientId.v1';

const PatientStoreContext = createContext(null);

function loadPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupt storage — fall back to seed data
  }
  return PATIENT_REGISTRY;
}

function loadActiveId(patients) {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id && patients.some(p => p._id === id)) return id;
  } catch {
    // ignore
  }
  return patients[0]?._id ?? null;
}

export function PatientStoreProvider({ children }) {
  const [patients, setPatients] = useState(loadPatients);
  const [activePatientId, setActivePatientId] = useState(() => loadActiveId(loadPatients()));

  // Persist roster
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch {
      // storage may be unavailable (private mode) — non-fatal
    }
  }, [patients]);

  // Persist active selection
  useEffect(() => {
    try {
      if (activePatientId) localStorage.setItem(ACTIVE_KEY, activePatientId);
    } catch {
      // non-fatal
    }
  }, [activePatientId]);

  const addPatient = useCallback((patient) => {
    setPatients(prev => [...prev, patient]);
    setActivePatientId(patient._id);
  }, []);

  const deletePatient = useCallback((id) => {
    setPatients(prev => {
      const next = prev.filter(p => p._id !== id);
      setActivePatientId(curr => {
        if (curr !== id) return curr;
        return next[0]?._id ?? null;
      });
      return next;
    });
  }, []);

  const selectPatient = useCallback((id) => {
    setActivePatientId(id);
  }, []);

  const resetToSeed = useCallback(() => {
    setPatients(PATIENT_REGISTRY);
    setActivePatientId(PATIENT_REGISTRY[0]._id);
  }, []);

  const activePatient =
    patients.find(p => p._id === activePatientId) ?? patients[0] ?? null;

  const value = {
    patients,
    activePatient,
    activePatientId,
    addPatient,
    deletePatient,
    selectPatient,
    resetToSeed
  };

  return (
    <PatientStoreContext.Provider value={value}>
      {children}
    </PatientStoreContext.Provider>
  );
}

export function usePatientStore() {
  const ctx = useContext(PatientStoreContext);
  if (!ctx) {
    throw new Error('usePatientStore must be used within a PatientStoreProvider');
  }
  return ctx;
}
