import { create } from "zustand";

interface FeatureFlags {
  enableNewHomepage: boolean;
  enableNewStylist: boolean;
  enableMotionEngine: boolean;
  enableSceneRenderer: boolean;
  enableAdvancedViewer: boolean;
}

interface FeatureStore {
  flags: FeatureFlags;
  toggleFlag: (flag: keyof FeatureFlags) => void;
  enableAll: () => void;
  disableAll: () => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  flags: {
    enableNewHomepage: false,
    enableNewStylist: true,
    enableMotionEngine: true,
    enableSceneRenderer: true,
    enableAdvancedViewer: true,
  },

  toggleFlag: (flag) => set((state) => ({
    flags: { ...state.flags, [flag]: !state.flags[flag] }
  })),

  enableAll: () => set({
    flags: {
      enableNewHomepage: true,
      enableNewStylist: true,
      enableMotionEngine: true,
      enableSceneRenderer: true,
      enableAdvancedViewer: true,
    }
  }),

  disableAll: () => set({
    flags: {
      enableNewHomepage: false,
      enableNewStylist: false,
      enableMotionEngine: false,
      enableSceneRenderer: false,
      enableAdvancedViewer: false,
    }
  })
}));
