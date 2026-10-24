import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getLatestBodyMeasurement,
  getLocalUserProfile,
  initializeLocalDatabase,
  normalizeDistanceUnit,
  normalizeHeightUnit,
  normalizeSpeedUnit,
  normalizeWeightUnit,
  saveLocalProfile,
  weightFromCanonical,
  weightToCanonical,
  type HeightUnit,
  type WeightUnit,
} from "@/db";
import {
  formatHeightInput,
  parseHeightToCanonical,
  validateProfileDraft,
  type ProfileDraft,
} from "./profile.viewmodel";

const emptyDraft: ProfileDraft = {
  birthDate: "",
  distanceUnit: "km",
  height: "",
  heightUnit: "cm",
  speedUnit: "kmh",
  username: "",
  weight: "",
  weightUnit: "kg",
};

export function useProfile() {
  const [draft, setDraft] = useState(emptyDraft);
  const [savedDraft, setSavedDraft] = useState<ProfileDraft | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const loaded = useRef(false);
  const dirty = useRef(false);
  const saving = useRef(false);
  const editVersion = useRef(0);
  const hasChanges =
    savedDraft !== null &&
    Object.keys(draft).some(
      (key) =>
        draft[key as keyof ProfileDraft] !==
        savedDraft[key as keyof ProfileDraft],
    );
  useEffect(() => {
    dirty.current = hasChanges;
  }, [hasChanges]);
  const [latestWeightKg, setLatestWeightKg] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const version = editVersion.current;
      async function load() {
        if (dirty.current || saving.current) return;
        setIsLoading(!loaded.current);
        setError(null);
        try {
          const db = await initializeLocalDatabase();
          const [user, measurement] = await Promise.all([
            getLocalUserProfile(db),
            getLatestBodyMeasurement(db),
          ]);
          if (!active || version !== editVersion.current) return;
          const heightUnit = normalizeHeightUnit(user.height_unit);
          const weightUnit = normalizeWeightUnit(user.weight_unit);
          setLatestWeightKg(measurement?.weight ?? null);
          const nextDraft: ProfileDraft = {
            birthDate: user.dob ?? "",
            distanceUnit: normalizeDistanceUnit(user.distance_unit),
            height:
              user.height === null
                ? ""
                : formatHeightInput(user.height, heightUnit),
            heightUnit,
            speedUnit: normalizeSpeedUnit(user.speed_unit),
            username: user.username,
            weight:
              measurement?.weight === null || measurement?.weight === undefined
                ? ""
                : editable(weightFromCanonical(measurement.weight, weightUnit)),
            weightUnit,
          };
          loaded.current = true;
          setDraft(nextDraft);
          setSavedDraft(nextDraft);
        } catch (loadError) {
          if (active && version === editVersion.current)
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Profile could not be loaded.",
            );
        } finally {
          if (active) setIsLoading(false);
        }
      }
      void load();
      return () => {
        active = false;
      };
      // Retry explicitly restarts the focused read.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]),
  );

  const setField = useCallback(
    <K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) => {
      if (!loaded.current || saving.current) return;
      editVersion.current += 1;
      setError(null);
      setSuccess(null);
      setDraft((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const changeHeightUnit = useCallback((unit: HeightUnit) => {
    if (!loaded.current || saving.current) return;
    editVersion.current += 1;
    setError(null);
    setSuccess(null);
    setDraft((current) => ({
      ...current,
      height: convertHeightInput(current.height, current.heightUnit, unit),
      heightUnit: unit,
    }));
  }, []);

  const changeWeightUnit = useCallback((unit: WeightUnit) => {
    if (!loaded.current || saving.current) return;
    editVersion.current += 1;
    setError(null);
    setSuccess(null);
    setDraft((current) => ({
      ...current,
      weight: convertWeightInput(current.weight, current.weightUnit, unit),
      weightUnit: unit,
    }));
  }, []);

  const save = useCallback(async () => {
    if (!loaded.current || saving.current || !hasChanges) return;
    const validated = validateProfileDraft(draft);
    if (!validated.values) {
      setError(validated.error);
      return;
    }
    saving.current = true;
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const nextWeight = validated.values.currentWeightKg;
      const weightChanged =
        nextWeight !== null &&
        (latestWeightKg === null ||
          Math.abs(nextWeight - latestWeightKg) > 0.005);
      const db = await initializeLocalDatabase();
      await saveLocalProfile(db, {
        ...validated.values,
        currentWeightKg: weightChanged ? nextWeight : undefined,
      });
      if (weightChanged) setLatestWeightKg(nextWeight);
      const nextDraft = {
        ...draft,
        username: validated.values.username,
        birthDate: validated.values.dob ?? "",
      };
      setDraft(nextDraft);
      setSavedDraft(nextDraft);
      setSuccess("Changes saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Profile could not be saved.",
      );
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }, [draft, hasChanges, latestWeightKg]);

  return {
    changeHeightUnit,
    changeWeightUnit,
    draft,
    error,
    hasChanges,
    hasLoaded: savedDraft !== null,
    isLoading,
    isSaving,
    retry: () => setReloadKey((key) => key + 1),
    save,
    setField,
    success,
  };
}

function editable(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function convertWeightInput(
  raw: string,
  from: WeightUnit,
  to: WeightUnit,
): string {
  const value = Number(raw.replace(",", "."));
  if (!Number.isFinite(value) || value <= 0 || from === to) return raw;
  return editable(weightFromCanonical(weightToCanonical(value, from), to));
}

function convertHeightInput(
  raw: string,
  from: HeightUnit,
  to: HeightUnit,
): string {
  if (from === to || !raw.trim()) return raw;
  const canonical = parseHeightToCanonical(raw, from);
  return canonical === null || canonical === undefined
    ? raw
    : formatHeightInput(canonical, to);
}
