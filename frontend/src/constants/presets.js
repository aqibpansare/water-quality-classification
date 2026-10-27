export const WATER_PRESETS = [
  {
    id: "safe-tap-water",
    name: "Safe Tap Water",
    category: "Ground Truth Potability: 1",
    expected: "Safe",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Exact row extracted from training dataset with verified Potable label.",
    metrics: {
      pH: 9.45,
      Hardness: 145.81,
      Solids: 13168.53,
      Chloramines: 9.44,
      Sulfate: 310.58,
      Conductivity: 592.66,
      Organic_carbon: 8.61,
      Trihalomethanes: 77.58,
      Turbidity: 3.88
    }
  },
  {
    id: "contaminated-water",
    name: "Contaminated Water",
    category: "Ground Truth Potability: 0",
    expected: "Unsafe",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    description: "Exact row extracted from training dataset with verified Non-Potable label.",
    metrics: {
      pH: 7.04,
      Hardness: 204.89,
      Solids: 20791.32,
      Chloramines: 7.30,
      Sulfate: 368.52,
      Conductivity: 564.31,
      Organic_carbon: 10.38,
      Trihalomethanes: 86.99,
      Turbidity: 2.96
    }
  }
];
