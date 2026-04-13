import React, { useContext, useCallback, useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";

interface HistoryContextValue {
  undo: () => void;
  redo: () => void;
  snapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HistoryContext = React.createContext<HistoryContextValue | undefined>(
  undefined
);

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 800;

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const form: DocumentFormReturn = useFormContext();

  const pastRef = useRef<string[]>([]);
  const futureRef = useRef<string[]>([]);
  const lastSnapshotRef = useRef<string>("");
  const isRestoringRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize with current form values
  useEffect(() => {
    lastSnapshotRef.current = JSON.stringify(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Commit current state to history immediately (call before destructive actions)
  const snapshot = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const serialized = JSON.stringify(form.getValues());
    if (serialized === lastSnapshotRef.current) return;

    // There were un-committed debounced changes — flush them first
    pastRef.current.push(lastSnapshotRef.current);
    if (pastRef.current.length > MAX_HISTORY) {
      pastRef.current.shift();
    }
    futureRef.current = [];
    lastSnapshotRef.current = serialized;

    setCanUndo(true);
    setCanRedo(false);
  }, [form]);

  // Watch form changes and debounce snapshots
  useEffect(() => {
    const subscription = form.watch(() => {
      if (isRestoringRef.current) return;

      // Enable undo immediately — there's a pending change the user can undo
      // even before the debounce commits it to the history stack
      setCanUndo(true);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const serialized = JSON.stringify(form.getValues());
        if (serialized === lastSnapshotRef.current) {
          // Values didn't actually change — restore canUndo from stack
          setCanUndo(pastRef.current.length > 0);
          return;
        }

        if (lastSnapshotRef.current) {
          pastRef.current.push(lastSnapshotRef.current);
          if (pastRef.current.length > MAX_HISTORY) {
            pastRef.current.shift();
          }
        }
        futureRef.current = [];
        lastSnapshotRef.current = serialized;

        setCanUndo(pastRef.current.length > 0);
        setCanRedo(false);
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form]);

  const restoreState = useCallback(
    (serialized: string) => {
      const values = JSON.parse(serialized);
      isRestoringRef.current = true;
      // reset() may not re-sync nested useFieldArray hooks, so we also
      // explicitly setValue("slides", ...) to force them to update.
      form.reset(values);
      form.setValue("slides", values.slides);
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 200);
    },
    [form]
  );

  const undo = useCallback(() => {
    // Cancel pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const currentSerialized = JSON.stringify(form.getValues());

    // If there are uncommitted changes (debounce hasn't fired yet),
    // undo back to the last snapshot
    if (currentSerialized !== lastSnapshotRef.current) {
      futureRef.current.push(currentSerialized);
      restoreState(lastSnapshotRef.current);

      setCanUndo(pastRef.current.length > 0);
      setCanRedo(true);
      return;
    }

    // Normal undo from past stack
    if (pastRef.current.length === 0) {
      setCanUndo(false);
      return;
    }

    futureRef.current.push(currentSerialized);
    const previousState = pastRef.current.pop()!;
    lastSnapshotRef.current = previousState;

    restoreState(previousState);

    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
  }, [form, restoreState]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const currentSerialized = JSON.stringify(form.getValues());
    pastRef.current.push(currentSerialized);

    const nextState = futureRef.current.pop()!;
    lastSnapshotRef.current = nextState;

    restoreState(nextState);

    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }, [form, restoreState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== "z") return;

      // Don't intercept undo/redo inside text inputs — let the browser handle it
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === "textarea" ||
        tagName === "input" ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <HistoryContext.Provider value={{ undo, redo, snapshot, canUndo, canRedo }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error(
      "useHistoryContext must be used within a HistoryProvider"
    );
  }
  return context;
}
