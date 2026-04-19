import { useState, useMemo, useCallback } from "react";

// ─── INDIAN FOOD DATABASE (per 1 serving) ───
// raw_serving & cooked_serving both provided; macros are per raw_serving
const FOOD_DB_INIT = [
  // GRAINS
  { id: "g1", name: "Brown Rice", raw: "50g", cooked: "150g", cal: 170, p: 4, c: 36, f: 1.5, fiber: 2, cat: "grain", veg: true },
  { id: "g2", name: "White Rice", raw: "50g", cooked: "150g", cal: 195, p: 3.5, c: 44, f: 0.4, fiber: 0.5, cat: "grain", veg: true },
  { id: "g3", name: "Roti (Whole Wheat)", raw: "40g atta", cooked: "1 roti", cal: 120, p: 3.5, c: 20, f: 3.5, fiber: 2, cat: "grain", veg: true },
  { id: "g4", name: "Multigrain Roti", raw: "40g atta", cooked: "1 roti", cal: 125, p: 4, c: 19, f: 3.8, fiber: 2.5, cat: "grain", veg: true },
  { id: "g5", name: "Jowar Roti", raw: "40g flour", cooked: "1 roti", cal: 118, p: 3.8, c: 22, f: 1.8, fiber: 2.8, cat: "grain", veg: true },
  { id: "g6", name: "Bajra Roti", raw: "40g flour", cooked: "1 roti", cal: 130, p: 3.5, c: 22, f: 2.2, fiber: 2.5, cat: "grain", veg: true },
  { id: "g7", name: "Oats", raw: "40g dry", cooked: "1 bowl (200g)", cal: 150, p: 5, c: 27, f: 2.5, fiber: 4, cat: "grain", veg: true },
  { id: "g8", name: "Poha", raw: "50g dry", cooked: "1 cup (150g)", cal: 180, p: 3.5, c: 35, f: 3, fiber: 1.5, cat: "grain", veg: true },
  { id: "g9", name: "Upma (Rava)", raw: "50g rava", cooked: "1 cup (200g)", cal: 210, p: 5, c: 32, f: 7, fiber: 2, cat: "grain", veg: true },
  { id: "g10", name: "Dalia (Broken Wheat)", raw: "50g dry", cooked: "1 cup (200g)", cal: 175, p: 6, c: 32, f: 2, fiber: 4.5, cat: "grain", veg: true },
  { id: "g11", name: "Idli", raw: "80g batter", cooked: "2 pcs", cal: 130, p: 4, c: 26, f: 0.5, fiber: 1, cat: "grain", veg: true },
  { id: "g12", name: "Dosa (Plain)", raw: "70g batter", cooked: "1 dosa", cal: 135, p: 3.5, c: 22, f: 3.5, fiber: 1, cat: "grain", veg: true },
  { id: "g13", name: "Quinoa", raw: "50g dry", cooked: "150g", cal: 180, p: 6.5, c: 30, f: 3, fiber: 3, cat: "grain", veg: true },
  { id: "g14", name: "Sweet Potato", raw: "150g", cooked: "150g boiled", cal: 135, p: 2, c: 31, f: 0.2, fiber: 4, cat: "grain", veg: true },
  { id: "g15", name: "Muesli (no sugar)", raw: "50g", cooked: "50g", cal: 190, p: 5, c: 33, f: 4.5, fiber: 3, cat: "grain", veg: true },
  { id: "g16", name: "Ragi Roti", raw: "40g flour", cooked: "1 roti", cal: 115, p: 3.2, c: 23, f: 1.5, fiber: 3.5, cat: "grain", veg: true },
  { id: "g17", name: "Rice Flakes (Chivda base)", raw: "30g", cooked: "30g", cal: 110, p: 2, c: 24, f: 0.5, fiber: 0.8, cat: "grain", veg: true },

  // PROTEIN VEG
  { id: "pv1", name: "Paneer (low fat)", raw: "100g", cooked: "100g", cal: 195, p: 18, c: 3, f: 12, fiber: 0, cat: "protein", veg: true },
  { id: "pv2", name: "Paneer (full fat)", raw: "100g", cooked: "100g", cal: 265, p: 18, c: 3, f: 20, fiber: 0, cat: "protein", veg: true },
  { id: "pv3", name: "Tofu", raw: "100g", cooked: "100g", cal: 76, p: 8, c: 2, f: 4.5, fiber: 0.5, cat: "protein", veg: true },
  { id: "pv4", name: "Chana (Chickpeas)", raw: "40g dry", cooked: "100g", cal: 164, p: 9, c: 27, f: 2.5, fiber: 7, cat: "protein", veg: true },
  { id: "pv5", name: "Rajma (Kidney Beans)", raw: "40g dry", cooked: "100g", cal: 127, p: 8.5, c: 22, f: 0.5, fiber: 6, cat: "protein", veg: true },
  { id: "pv6", name: "Moong Dal", raw: "40g dry", cooked: "100g", cal: 105, p: 7, c: 18, f: 0.4, fiber: 4, cat: "protein", veg: true },
  { id: "pv7", name: "Toor Dal", raw: "40g dry", cooked: "100g", cal: 118, p: 7.5, c: 20, f: 0.5, fiber: 5, cat: "protein", veg: true },
  { id: "pv8", name: "Masoor Dal", raw: "40g dry", cooked: "100g", cal: 116, p: 9, c: 20, f: 0.4, fiber: 4, cat: "protein", veg: true },
  { id: "pv9", name: "Soya Chunks", raw: "50g dry", cooked: "100g soaked", cal: 170, p: 26, c: 16, f: 0.5, fiber: 7, cat: "protein", veg: true },
  { id: "pv10", name: "Curd (low fat)", raw: "150g", cooked: "150g", cal: 85, p: 6, c: 7, f: 3, fiber: 0, cat: "protein", veg: true },
  { id: "pv11", name: "Curd (full fat)", raw: "150g", cooked: "150g", cal: 100, p: 5, c: 7, f: 5, fiber: 0, cat: "protein", veg: true },
  { id: "pv12", name: "Greek Yogurt", raw: "150g", cooked: "150g", cal: 90, p: 15, c: 5, f: 0.7, fiber: 0, cat: "protein", veg: true },
  { id: "pv13", name: "Sprouts (Mixed)", raw: "60g dry", cooked: "100g", cal: 100, p: 7, c: 15, f: 1, fiber: 4, cat: "protein", veg: true },
  { id: "pv14", name: "Whey Protein", raw: "1 scoop (30g)", cooked: "1 scoop (30g)", cal: 120, p: 24, c: 3, f: 1.5, fiber: 0, cat: "protein", veg: true },
  { id: "pv15", name: "Chana Dal", raw: "40g dry", cooked: "100g", cal: 130, p: 8, c: 22, f: 1.5, fiber: 5, cat: "protein", veg: true },

  // PROTEIN NON-VEG
  { id: "pn1", name: "Chicken Breast (grilled)", raw: "120g", cooked: "100g", cal: 165, p: 31, c: 0, f: 3.6, fiber: 0, cat: "protein", veg: false },
  { id: "pn2", name: "Chicken Thigh (skinless)", raw: "130g", cooked: "100g", cal: 195, p: 26, c: 0, f: 10, fiber: 0, cat: "protein", veg: false },
  { id: "pn3", name: "Egg (whole, boiled)", raw: "1 egg (55g)", cooked: "1 egg (50g)", cal: 78, p: 6, c: 0.6, f: 5, fiber: 0, cat: "protein", veg: false },
  { id: "pn4", name: "Egg White (boiled)", raw: "1 white (33g)", cooked: "1 white (30g)", cal: 17, p: 3.6, c: 0.2, f: 0.1, fiber: 0, cat: "protein", veg: false },
  { id: "pn5", name: "Fish (Rohu)", raw: "120g", cooked: "100g", cal: 97, p: 17, c: 0, f: 3, fiber: 0, cat: "protein", veg: false },
  { id: "pn6", name: "Fish (Pomfret)", raw: "120g", cooked: "100g", cal: 96, p: 18, c: 0, f: 2.5, fiber: 0, cat: "protein", veg: false },
  { id: "pn7", name: "Prawns", raw: "120g", cooked: "100g", cal: 99, p: 20, c: 1, f: 1.5, fiber: 0, cat: "protein", veg: false },
  { id: "pn8", name: "Mutton (lean)", raw: "130g", cooked: "100g", cal: 215, p: 26, c: 0, f: 12, fiber: 0, cat: "protein", veg: false },
  { id: "pn9", name: "Salmon (grilled)", raw: "120g", cooked: "100g", cal: 208, p: 20, c: 0, f: 13, fiber: 0, cat: "protein", veg: false },
  { id: "pn10", name: "Tuna (canned)", raw: "100g", cooked: "100g", cal: 116, p: 26, c: 0, f: 1, fiber: 0, cat: "protein", veg: false },
  { id: "pn11", name: "Chicken Keema (lean)", raw: "130g", cooked: "100g", cal: 175, p: 28, c: 0, f: 7, fiber: 0, cat: "protein", veg: false },

  // VEGETABLES
  { id: "v1", name: "Mixed Sabzi (low oil)", raw: "200g", cooked: "150g", cal: 80, p: 3, c: 10, f: 3, fiber: 4, cat: "vegetable", veg: true },
  { id: "v2", name: "Palak (Spinach)", raw: "150g", cooked: "100g", cal: 23, p: 2.9, c: 3.6, f: 0.4, fiber: 2.2, cat: "vegetable", veg: true },
  { id: "v3", name: "Broccoli", raw: "120g", cooked: "100g", cal: 35, p: 2.4, c: 7, f: 0.4, fiber: 3, cat: "vegetable", veg: true },
  { id: "v4", name: "Cucumber", raw: "100g", cooked: "100g", cal: 15, p: 0.7, c: 3.6, f: 0.1, fiber: 0.5, cat: "vegetable", veg: true },
  { id: "v5", name: "Salad (mixed greens)", raw: "100g", cooked: "100g", cal: 25, p: 1.5, c: 4, f: 0.3, fiber: 2, cat: "vegetable", veg: true },
  { id: "v6", name: "Bhindi (Okra)", raw: "120g", cooked: "100g", cal: 35, p: 2, c: 7, f: 0.3, fiber: 3, cat: "vegetable", veg: true },
  { id: "v7", name: "Lauki (Bottle Gourd)", raw: "150g", cooked: "100g", cal: 15, p: 0.6, c: 3.4, f: 0.1, fiber: 0.5, cat: "vegetable", veg: true },
  { id: "v8", name: "Capsicum", raw: "100g", cooked: "100g", cal: 20, p: 0.9, c: 4.6, f: 0.2, fiber: 1.7, cat: "vegetable", veg: true },
  { id: "v9", name: "Mushroom", raw: "100g", cooked: "80g", cal: 22, p: 3.1, c: 3.3, f: 0.3, fiber: 1, cat: "vegetable", veg: true },
  { id: "v10", name: "Zucchini", raw: "120g", cooked: "100g", cal: 20, p: 1.5, c: 3.5, f: 0.3, fiber: 1, cat: "vegetable", veg: true },
  { id: "v11", name: "Cauliflower", raw: "130g", cooked: "100g", cal: 25, p: 2, c: 5, f: 0.3, fiber: 2, cat: "vegetable", veg: true },
  { id: "v12", name: "Beans (French)", raw: "100g", cooked: "80g", cal: 31, p: 1.8, c: 7, f: 0.1, fiber: 3, cat: "vegetable", veg: true },

  // FRUITS
  { id: "f1", name: "Banana", raw: "1 medium (120g)", cooked: "1 medium (120g)", cal: 105, p: 1.3, c: 27, f: 0.4, fiber: 3, cat: "fruit", veg: true },
  { id: "f2", name: "Apple", raw: "1 medium (180g)", cooked: "1 medium (180g)", cal: 95, p: 0.5, c: 25, f: 0.3, fiber: 4, cat: "fruit", veg: true },
  { id: "f3", name: "Papaya", raw: "150g", cooked: "150g", cal: 60, p: 0.7, c: 15, f: 0.2, fiber: 2.5, cat: "fruit", veg: true },
  { id: "f4", name: "Guava", raw: "1 pc (100g)", cooked: "1 pc (100g)", cal: 68, p: 2.5, c: 14, f: 1, fiber: 5, cat: "fruit", veg: true },
  { id: "f5", name: "Orange", raw: "1 medium (150g)", cooked: "1 medium (150g)", cal: 62, p: 1.2, c: 15, f: 0.2, fiber: 3, cat: "fruit", veg: true },
  { id: "f6", name: "Watermelon", raw: "200g", cooked: "200g", cal: 60, p: 1.2, c: 15, f: 0.3, fiber: 0.8, cat: "fruit", veg: true },
  { id: "f7", name: "Mango", raw: "1 cup (165g)", cooked: "1 cup (165g)", cal: 99, p: 1.4, c: 25, f: 0.6, fiber: 2.6, cat: "fruit", veg: true },
  { id: "f8", name: "Pomegranate", raw: "100g seeds", cooked: "100g seeds", cal: 83, p: 1.7, c: 19, f: 1.2, fiber: 4, cat: "fruit", veg: true },
  { id: "f9", name: "Berries (mixed)", raw: "100g", cooked: "100g", cal: 50, p: 1, c: 12, f: 0.3, fiber: 3, cat: "fruit", veg: true },
  { id: "f10", name: "Pear", raw: "1 medium (170g)", cooked: "1 medium (170g)", cal: 100, p: 0.6, c: 27, f: 0.2, fiber: 5.5, cat: "fruit", veg: true },

  // FATS & NUTS
  { id: "n1", name: "Almonds", raw: "10 pcs (12g)", cooked: "10 pcs (12g)", cal: 70, p: 2.5, c: 2.5, f: 6, fiber: 1.5, cat: "fat", veg: true },
  { id: "n2", name: "Walnuts", raw: "5 halves (15g)", cooked: "5 halves (15g)", cal: 98, p: 2.3, c: 2, f: 9.5, fiber: 1, cat: "fat", veg: true },
  { id: "n3", name: "Peanuts", raw: "20g", cooked: "20g", cal: 115, p: 5, c: 3, f: 10, fiber: 1.5, cat: "fat", veg: true },
  { id: "n4", name: "Peanut Butter", raw: "1 tbsp (16g)", cooked: "1 tbsp (16g)", cal: 95, p: 4, c: 3, f: 8, fiber: 1, cat: "fat", veg: true },
  { id: "n5", name: "Ghee", raw: "1 tsp (5g)", cooked: "1 tsp (5g)", cal: 45, p: 0, c: 0, f: 5, fiber: 0, cat: "fat", veg: true },
  { id: "n6", name: "Coconut Oil", raw: "1 tsp (5g)", cooked: "1 tsp (5g)", cal: 40, p: 0, c: 0, f: 4.5, fiber: 0, cat: "fat", veg: true },
  { id: "n7", name: "Olive Oil", raw: "1 tsp (5g)", cooked: "1 tsp (5g)", cal: 40, p: 0, c: 0, f: 4.5, fiber: 0, cat: "fat", veg: true },
  { id: "n8", name: "Flax Seeds", raw: "1 tbsp (10g)", cooked: "1 tbsp (10g)", cal: 55, p: 2, c: 3, f: 4, fiber: 3, cat: "fat", veg: true },
  { id: "n9", name: "Chia Seeds", raw: "1 tbsp (12g)", cooked: "1 tbsp (12g)", cal: 58, p: 2, c: 5, f: 3.5, fiber: 4, cat: "fat", veg: true },
  { id: "n10", name: "Avocado", raw: "50g", cooked: "50g", cal: 80, p: 1, c: 4, f: 7, fiber: 3, cat: "fat", veg: true },
  { id: "n11", name: "Cheese (cheddar)", raw: "20g", cooked: "20g", cal: 80, p: 5, c: 0.5, f: 6.5, fiber: 0, cat: "fat", veg: true },
  { id: "n12", name: "Cashews", raw: "10 pcs (15g)", cooked: "10 pcs (15g)", cal: 85, p: 2.5, c: 5, f: 6.5, fiber: 0.5, cat: "fat", veg: true },

  // BEVERAGES
  { id: "b1", name: "Black Coffee", raw: "1 cup", cooked: "1 cup", cal: 2, p: 0.3, c: 0, f: 0, fiber: 0, cat: "beverage", veg: true },
  { id: "b2", name: "Green Tea", raw: "1 cup", cooked: "1 cup", cal: 2, p: 0, c: 0.5, f: 0, fiber: 0, cat: "beverage", veg: true },
  { id: "b3", name: "Milk (toned)", raw: "200ml", cooked: "200ml", cal: 120, p: 6, c: 10, f: 6, fiber: 0, cat: "beverage", veg: true },
  { id: "b4", name: "Milk (skimmed)", raw: "200ml", cooked: "200ml", cal: 70, p: 7, c: 10, f: 0.4, fiber: 0, cat: "beverage", veg: true },
  { id: "b5", name: "Buttermilk (Chaas)", raw: "200ml", cooked: "200ml", cal: 40, p: 2, c: 5, f: 1, fiber: 0, cat: "beverage", veg: true },
  { id: "b6", name: "Coconut Water", raw: "200ml", cooked: "200ml", cal: 45, p: 0.5, c: 10, f: 0.2, fiber: 0, cat: "beverage", veg: true },
];

const CATS = [
  { key: "grain", label: "Grains & Cereals", emoji: "🌾" },
  { key: "protein", label: "Proteins", emoji: "🥩" },
  { key: "vegetable", label: "Vegetables", emoji: "🥬" },
  { key: "fruit", label: "Fruits", emoji: "🍎" },
  { key: "fat", label: "Fats & Nuts", emoji: "🥜" },
  { key: "beverage", label: "Beverages", emoji: "☕" },
  { key: "custom", label: "Custom Recipes", emoji: "👨‍🍳" },
];

const MEAL_SLOTS = ["Early Morning", "Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner", "Post Dinner"];

// ─── COLORS ───
const C = {
  bg: "#08090A", card: "#111315", card2: "#181B1E", accent: "#A8E84C", accentDim: "rgba(168,232,76,.12)",
  text: "#EDF0E8", dim: "#6B7770", border: "#1E2422", red: "#F26B5E", blue: "#5EB8F2", orange: "#F2A85E",
  green: "#5EF2A8", purple: "#A85EF2",
};
const FONT = `'DM Sans', sans-serif`;
const DISP = `'Playfair Display', serif`;

// ─── STYLES ───
const ss = {
  page: { fontFamily: FONT, background: C.bg, color: C.text, minHeight: "100vh", padding: "20px 14px", maxWidth: 720, margin: "0 auto" },
  card: { background: C.card, borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: `1px solid ${C.border}` },
  label: { fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, display: "block" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, fontFamily: FONT, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, fontFamily: FONT, outline: "none", boxSizing: "border-box" },
  btn: { padding: "12px 24px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, fontSize: 14, fontWeight: 700, fontFamily: FONT, cursor: "pointer" },
  btnSm: { padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.accent}`, background: "transparent", color: C.accent, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" },
  btnDanger: { padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.red}`, background: "transparent", color: C.red, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" },
  chip: (on) => ({ padding: "6px 14px", borderRadius: 20, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accentDim : "transparent", color: on ? C.accent : C.dim, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", transition: "all .15s" }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  tag: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: color + "18", color }),
};

// ─── MAIN APP ───
export default function App() {
  const [screen, setScreen] = useState("client"); // client | prefs | plan_build | result
  const [db, setDb] = useState(FOOD_DB_INIT);
  const [qtyMode, setQtyMode] = useState("cooked"); // raw | cooked

  // Client info
  const [client, setClient] = useState({ name: "", weight: "", height: "", age: "", gender: "male", activity: "moderate", chest: "", waist: "", hip: "", arm: "", thigh: "" });
  const uc = (k, v) => setClient(c => ({ ...c, [k]: v }));

  // Goal & macros
  const [goal, setGoal] = useState("fat_loss");
  const [macroMode, setMacroMode] = useState("auto"); // auto | manual
  const [manualMacros, setManualMacros] = useState({ cal: "", p: "", c: "", f: "" });
  const umm = (k, v) => setManualMacros(m => ({ ...m, [k]: v }));

  // Food preferences: set of allowed food IDs
  const [allowedFoods, setAllowedFoods] = useState(new Set(FOOD_DB_INIT.map(f => f.id)));
  const [dietFilter, setDietFilter] = useState("all"); // all | veg | egg

  // Custom recipe modal
  const [showCustom, setShowCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", raw: "", cooked: "", cal: "", p: "", c: "", f: "", fiber: "0", cat: "custom", veg: true });
  const ucf = (k, v) => setCustomForm(cf => ({ ...cf, [k]: v }));

  // Meal plan state
  const [meals, setMeals] = useState(null);
  const [activeMeals, setActiveMeals] = useState(["Early Morning", "Breakfast", "Lunch", "Evening Snack", "Dinner"]);

  // ─── COMPUTED MACROS ───
  const computedMacros = useMemo(() => {
    if (macroMode === "manual" && manualMacros.cal) {
      return { cal: +manualMacros.cal, p: +manualMacros.p, c: +manualMacros.c, f: +manualMacros.f };
    }
    const w = +client.weight, h = +client.height, a = +client.age;
    if (!w || !h || !a) return null;
    let bmr = client.gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const af = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (af[client.activity] || 1.55));
    const mult = { weight_loss: 0.80, fat_loss: 0.75, muscle_gain: 1.15 };
    const cal = Math.round(tdee * (mult[goal] || 1));
    const splits = { weight_loss: [.35, .35, .30], fat_loss: [.40, .30, .30], muscle_gain: [.30, .45, .25] };
    const [pr, cr, fr] = splits[goal] || [.30, .40, .30];
    return { cal, p: Math.round(cal * pr / 4), c: Math.round(cal * cr / 4), f: Math.round(cal * fr / 9), tdee };
  }, [client, goal, macroMode, manualMacros]);

  // ─── FOOD FILTERS ───
  const filteredDb = useMemo(() => {
    return db.filter(f => {
      if (dietFilter === "veg" && !f.veg) return false;
      if (dietFilter === "egg" && !f.veg && !f.name.includes("Egg")) return false;
      return true;
    });
  }, [db, dietFilter]);

  const toggleFood = (id) => {
    setAllowedFoods(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleCat = (cat) => {
    const ids = filteredDb.filter(f => f.cat === cat).map(f => f.id);
    const allOn = ids.every(id => allowedFoods.has(id));
    setAllowedFoods(s => { const n = new Set(s); ids.forEach(id => allOn ? n.delete(id) : n.add(id)); return n; });
  };

  // ─── ADD CUSTOM RECIPE ───
  const addCustom = () => {
    const id = "custom_" + Date.now();
    const item = { id, name: customForm.name, raw: customForm.raw, cooked: customForm.cooked, cal: +customForm.cal, p: +customForm.p, c: +customForm.c, f: +customForm.f, fiber: +customForm.fiber, cat: "custom", veg: customForm.veg };
    setDb(d => [...d, item]);
    setAllowedFoods(s => new Set([...s, id]));
    setCustomForm({ name: "", raw: "", cooked: "", cal: "", p: "", c: "", f: "", fiber: "0", cat: "custom", veg: true });
    setShowCustom(false);
  };

  // ─── GENERATE PLAN ───
  const generatePlan = useCallback(() => {
    if (!computedMacros) return;
    const pool = filteredDb.filter(f => allowedFoods.has(f.id));
    const mealCount = activeMeals.length;
    const calPerMeal = computedMacros.cal / mealCount;

    const builtMeals = activeMeals.map(mealName => {
      const items = [];
      const usedIds = new Set();

      const pickFrom = (cats, n) => {
        const avail = pool.filter(f => cats.includes(f.cat) && !usedIds.has(f.id));
        const shuffled = [...avail].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
      };

      // Assign items by meal type
      let picks = [];
      if (mealName === "Early Morning" || mealName === "Post Dinner") {
        picks = [...pickFrom(["beverage"], 1), ...pickFrom(["fat"], 1)];
      } else if (mealName === "Breakfast") {
        picks = [...pickFrom(["grain"], 1), ...pickFrom(["protein"], 1), ...pickFrom(["fruit"], 1)];
      } else if (mealName === "Lunch" || mealName === "Dinner") {
        picks = [...pickFrom(["grain"], 1), ...pickFrom(["protein"], 1), ...pickFrom(["vegetable"], 1), ...pickFrom(["fat"], 1)];
      } else if (mealName.includes("Snack") || mealName === "Mid-Morning Snack") {
        picks = [...pickFrom(["protein", "fruit", "fat", "custom"], 2)];
      } else {
        picks = [...pickFrom(["grain", "protein", "custom"], 2)];
      }
      picks.forEach(f => usedIds.add(f.id));

      // Balance quantities to hit meal calorie target
      if (picks.length > 0) {
        const totalBaseCal = picks.reduce((s, f) => s + f.cal, 0);
        const scale = totalBaseCal > 0 ? calPerMeal / totalBaseCal : 1;
        picks.forEach(f => {
          let qty = Math.round(scale * 4) / 4; // quarter-serving precision
          qty = Math.max(0.25, Math.min(4, qty));
          items.push({ ...f, qty });
        });
      }

      return { name: mealName, items };
    });

    setMeals(builtMeals);
    setScreen("result");
  }, [computedMacros, filteredDb, allowedFoods, activeMeals]);

  // ─── ADJUST QTY in result ───
  const adjustQty = (mi, ii, delta) => {
    setMeals(prev => prev.map((m, mIdx) => mIdx !== mi ? m : {
      ...m, items: m.items.map((it, iIdx) => iIdx !== ii ? it : { ...it, qty: Math.max(0.25, Math.round((it.qty + delta) * 4) / 4) })
    }));
  };

  const removeItem = (mi, ii) => {
    setMeals(prev => prev.map((m, mIdx) => mIdx !== mi ? m : { ...m, items: m.items.filter((_, iIdx) => iIdx !== ii) }));
  };

  const swapItem = (mi, ii) => {
    setMeals(prev => prev.map((m, mIdx) => {
      if (mIdx !== mi) return m;
      const old = m.items[ii];
      const pool = filteredDb.filter(f => allowedFoods.has(f.id) && f.cat === old.cat && f.id !== old.id);
      if (!pool.length) return m;
      const replacement = pool[Math.floor(Math.random() * pool.length)];
      const newItems = [...m.items];
      newItems[ii] = { ...replacement, qty: old.qty };
      return { ...m, items: newItems };
    }));
  };

  // ─── TOTAL ACTUALS ───
  const totals = useMemo(() => {
    if (!meals) return { cal: 0, p: 0, c: 0, f: 0 };
    return meals.reduce((acc, m) => {
      m.items.forEach(it => { acc.cal += it.cal * it.qty; acc.p += it.p * it.qty; acc.c += it.c * it.qty; acc.f += it.f * it.qty; });
      return acc;
    }, { cal: 0, p: 0, c: 0, f: 0 });
  }, [meals]);

  // ─── AUTO-BALANCE: adjusts quantities across all meals to match target macros ───
  const autoBalance = () => {
    if (!meals || !computedMacros) return;
    const targetCal = computedMacros.cal;
    const currentCal = totals.cal;
    if (currentCal === 0) return;
    const ratio = targetCal / currentCal;
    setMeals(prev => prev.map(m => ({
      ...m, items: m.items.map(it => ({ ...it, qty: Math.max(0.25, Math.round(it.qty * ratio * 4) / 4) }))
    })));
  };

  // ═══════════════════════════════════════════════
  // SCREENS
  // ═══════════════════════════════════════════════

  const Header = ({ sub }) => (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ fontFamily: DISP, fontSize: 26, fontWeight: 700, color: C.accent }}>SHAPE</div>
      <div style={{ fontSize: 10, color: C.dim, letterSpacing: 3, textTransform: "uppercase" }}>{sub}</div>
    </div>
  );

  const Field = ({ label, k, obj, set, type = "text", ph = "" }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={ss.label}>{label}</label>
      <input style={ss.input} type={type} placeholder={ph} value={obj[k]} onChange={e => set(k, e.target.value)} />
    </div>
  );

  // ─── SCREEN 1: CLIENT INFO ───
  if (screen === "client") {
    return (
      <div style={ss.page}>
        <Header sub="Step 1 — Client Info & Goals" />

        <div style={ss.card}>
          <div style={ss.sectionTitle}>👤 Client Details</div>
          <Field label="Name" k="name" obj={client} set={uc} ph="Rahul Sharma" />
          <div style={ss.grid3}>
            <Field label="Weight (kg)" k="weight" obj={client} set={uc} type="number" ph="82" />
            <Field label="Height (cm)" k="height" obj={client} set={uc} type="number" ph="175" />
            <Field label="Age" k="age" obj={client} set={uc} type="number" ph="32" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={ss.label}>Gender</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["male", "female"].map(g => <button key={g} style={ss.chip(client.gender === g)} onClick={() => uc("gender", g)}>{g === "male" ? "Male" : "Female"}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={ss.label}>Activity Level</label>
            <select style={ss.select} value={client.activity} onChange={e => uc("activity", e.target.value)}>
              <option value="sedentary">Sedentary (desk job)</option>
              <option value="light">Light (1-2x/week)</option>
              <option value="moderate">Moderate (3-5x/week)</option>
              <option value="active">Active (6-7x/week)</option>
              <option value="very_active">Very Active (2x/day)</option>
            </select>
          </div>
        </div>

        <div style={ss.card}>
          <div style={ss.sectionTitle}>📐 Body Measurements (inches)</div>
          <div style={ss.grid3}>
            <Field label="Chest" k="chest" obj={client} set={uc} type="number" ph="40" />
            <Field label="Waist" k="waist" obj={client} set={uc} type="number" ph="34" />
            <Field label="Hip" k="hip" obj={client} set={uc} type="number" ph="38" />
          </div>
          <div style={ss.grid2}>
            <Field label="Arm" k="arm" obj={client} set={uc} type="number" ph="14" />
            <Field label="Thigh" k="thigh" obj={client} set={uc} type="number" ph="22" />
          </div>
        </div>

        <div style={ss.card}>
          <div style={ss.sectionTitle}>🎯 Goal</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[["fat_loss", "Fat Loss"], ["weight_loss", "Weight Loss"], ["muscle_gain", "Muscle Gain"]].map(([v, l]) =>
              <button key={v} style={ss.chip(goal === v)} onClick={() => setGoal(v)}>{l}</button>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={ss.label}>Macro Setting</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button style={ss.chip(macroMode === "auto")} onClick={() => setMacroMode("auto")}>Auto (from TDEE)</button>
              <button style={ss.chip(macroMode === "manual")} onClick={() => setMacroMode("manual")}>Manual</button>
            </div>
          </div>

          {macroMode === "manual" ? (
            <div style={ss.grid2}>
              <Field label="Total Calories" k="cal" obj={manualMacros} set={umm} type="number" ph="1800" />
              <Field label="Protein (g)" k="p" obj={manualMacros} set={umm} type="number" ph="150" />
              <Field label="Carbs (g)" k="c" obj={manualMacros} set={umm} type="number" ph="180" />
              <Field label="Fat (g)" k="f" obj={manualMacros} set={umm} type="number" ph="50" />
            </div>
          ) : computedMacros && (
            <div style={{ background: C.card2, borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{computedMacros.cal}</div><div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>KCAL</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: C.blue }}>{computedMacros.p}g</div><div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>PROTEIN</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: C.orange }}>{computedMacros.c}g</div><div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>CARBS</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: C.red }}>{computedMacros.f}g</div><div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>FAT</div></div>
            </div>
          )}
        </div>

        <button style={{ ...ss.btn, width: "100%", opacity: (client.name && computedMacros) ? 1 : 0.4 }} disabled={!client.name || !computedMacros} onClick={() => setScreen("prefs")}>
          Next → Food Preferences
        </button>
      </div>
    );
  }

  // ─── SCREEN 2: FOOD PREFERENCES ───
  if (screen === "prefs") {
    return (
      <div style={ss.page}>
        <Header sub="Step 2 — Food Preferences" />

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button style={ss.btnSm} onClick={() => setScreen("client")}>← Back</button>
          <div style={{ flex: 1 }} />
          <label style={ss.label}>Diet</label>
          {[["all", "All"], ["veg", "Veg"], ["egg", "Egg+Veg"]].map(([v, l]) =>
            <button key={v} style={ss.chip(dietFilter === v)} onClick={() => setDietFilter(v)}>{l}</button>
          )}
        </div>

        <div style={{ ...ss.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={ss.sectionTitle}>📏 Quantity Display</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ss.chip(qtyMode === "raw")} onClick={() => setQtyMode("raw")}>Raw</button>
            <button style={ss.chip(qtyMode === "cooked")} onClick={() => setQtyMode("cooked")}>Cooked</button>
          </div>
        </div>

        {CATS.map(cat => {
          const items = filteredDb.filter(f => f.cat === cat.key);
          if (!items.length) return null;
          const allOn = items.every(f => allowedFoods.has(f.id));
          return (
            <div key={cat.key} style={ss.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={ss.sectionTitle}>{cat.emoji} {cat.label} ({items.filter(f => allowedFoods.has(f.id)).length}/{items.length})</div>
                <button style={ss.chip(allOn)} onClick={() => toggleCat(cat.key)}>{allOn ? "Deselect All" : "Select All"}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {items.map(f => (
                  <button key={f.id} onClick={() => toggleFood(f.id)} style={{
                    ...ss.chip(allowedFoods.has(f.id)),
                    fontSize: 11, padding: "5px 10px",
                  }}>
                    {f.name}
                    <span style={{ marginLeft: 6, opacity: 0.6 }}>{f.cal}cal</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add Custom Recipe */}
        <div style={ss.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={ss.sectionTitle}>👨‍🍳 Add Custom Recipe</div>
            <button style={ss.btnSm} onClick={() => setShowCustom(!showCustom)}>{showCustom ? "Cancel" : "+ Add"}</button>
          </div>
          {showCustom && (
            <div style={{ marginTop: 10 }}>
              <Field label="Recipe Name" k="name" obj={customForm} set={ucf} ph="Mom's Dal Khichdi" />
              <div style={ss.grid2}>
                <Field label="Raw Qty" k="raw" obj={customForm} set={ucf} ph="80g rice + 30g dal" />
                <Field label="Cooked Qty" k="cooked" obj={customForm} set={ucf} ph="1 bowl (250g)" />
              </div>
              <div style={ss.grid2}>
                <Field label="Calories" k="cal" obj={customForm} set={ucf} type="number" ph="280" />
                <Field label="Protein (g)" k="p" obj={customForm} set={ucf} type="number" ph="10" />
              </div>
              <div style={ss.grid3}>
                <Field label="Carbs (g)" k="c" obj={customForm} set={ucf} type="number" ph="45" />
                <Field label="Fat (g)" k="f" obj={customForm} set={ucf} type="number" ph="5" />
                <Field label="Fiber (g)" k="fiber" obj={customForm} set={ucf} type="number" ph="3" />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <button style={ss.chip(customForm.veg)} onClick={() => ucf("veg", true)}>Veg</button>
                <button style={ss.chip(!customForm.veg)} onClick={() => ucf("veg", false)}>Non-Veg</button>
              </div>
              <button style={ss.btn} onClick={addCustom} disabled={!customForm.name || !customForm.cal}>Save Recipe</button>
            </div>
          )}
        </div>

        {/* Meal Slots */}
        <div style={ss.card}>
          <div style={ss.sectionTitle}>🕐 Active Meals</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {MEAL_SLOTS.map(m => (
              <button key={m} style={ss.chip(activeMeals.includes(m))} onClick={() => {
                setActiveMeals(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
              }}>{m}</button>
            ))}
          </div>
        </div>

        <button style={{ ...ss.btn, width: "100%" }} onClick={generatePlan}>
          Generate Diet Plan →
        </button>
      </div>
    );
  }

  // ─── SCREEN 3: RESULT ───
  if (screen === "result" && meals) {
    const goalLabels = { weight_loss: "Weight Loss", fat_loss: "Fat Loss", muscle_gain: "Muscle Gain" };
    const calDiff = Math.round(totals.cal) - computedMacros.cal;
    const calColor = Math.abs(calDiff) < 50 ? C.green : Math.abs(calDiff) < 150 ? C.orange : C.red;

    return (
      <div style={ss.page}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: DISP, fontSize: 22, fontWeight: 700, color: C.accent }}>SHAPE</div>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2 }}>DIET PLAN</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button style={ss.btnSm} onClick={() => setScreen("prefs")}>← Edit</button>
            <button style={ss.btnSm} onClick={generatePlan}>↻ Shuffle</button>
            <button style={{ ...ss.btnSm, borderColor: C.green, color: C.green }} onClick={autoBalance}>⚖ Auto-Balance</button>
          </div>
        </div>

        {/* Client card */}
        <div style={{ ...ss.card, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: DISP, fontSize: 18, fontWeight: 700 }}>{client.name}</div>
            <div style={{ fontSize: 11, color: C.dim }}>{client.weight}kg · {client.height}cm · {client.age}y · {client.gender}</div>
            {(client.chest || client.waist) && <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>
              {[client.chest && `C:${client.chest}"`, client.waist && `W:${client.waist}"`, client.hip && `H:${client.hip}"`, client.arm && `A:${client.arm}"`, client.thigh && `T:${client.thigh}"`].filter(Boolean).join(" · ")}
            </div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={ss.tag(C.accent)}>{goalLabels[goal]}</span>
            <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Qty: {qtyMode === "raw" ? "RAW" : "COOKED"}</div>
          </div>
        </div>

        {/* Macro dashboard */}
        <div style={ss.card}>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 34, fontWeight: 800, fontFamily: DISP, color: C.accent }}>{Math.round(totals.cal)}</div>
            <div style={{ fontSize: 10, color: C.dim }}>TARGET: {computedMacros.cal} kcal <span style={{ color: calColor, fontWeight: 700 }}>({calDiff > 0 ? "+" : ""}{calDiff})</span></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            {[
              { label: "Protein", val: totals.p, target: computedMacros.p, color: C.blue, unit: "g" },
              { label: "Carbs", val: totals.c, target: computedMacros.c, color: C.orange, unit: "g" },
              { label: "Fat", val: totals.f, target: computedMacros.f, color: C.red, unit: "g" },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{Math.round(m.val)}{m.unit}</div>
                <div style={{ fontSize: 9, color: C.dim }}>{m.label} (T:{m.target})</div>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        {meals.map((meal, mi) => {
          const mt = meal.items.reduce((a, it) => ({ cal: a.cal + it.cal * it.qty, p: a.p + it.p * it.qty, c: a.c + it.c * it.qty, f: a.f + it.f * it.qty }), { cal: 0, p: 0, c: 0, f: 0 });
          return (
            <div key={mi} style={ss.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 600 }}>{meal.name}</div>
                <span style={ss.tag(C.accent)}>{Math.round(mt.cal)} kcal</span>
              </div>
              {meal.items.map((it, ii) => (
                <div key={ii} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                      <div style={{ fontSize: 11, color: C.dim }}>
                        {it.qty === 1 ? (qtyMode === "raw" ? it.raw : it.cooked) : `${it.qty} × ${qtyMode === "raw" ? it.raw : it.cooked}`}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, fontSize: 10, color: C.dim, marginRight: 8 }}>
                      <span><b style={{ color: C.text }}>{Math.round(it.cal * it.qty)}</b> cal</span>
                      <span><b style={{ color: C.blue }}>{Math.round(it.p * it.qty)}g</b> P</span>
                      <span><b style={{ color: C.orange }}>{Math.round(it.c * it.qty)}g</b> C</span>
                      <span><b style={{ color: C.red }}>{Math.round(it.f * it.qty)}g</b> F</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button style={{ ...ss.chip(false), padding: "3px 10px", fontSize: 13, fontWeight: 700 }} onClick={() => adjustQty(mi, ii, -0.25)}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, minWidth: 35, textAlign: "center", lineHeight: "28px" }}>{it.qty}</span>
                    <button style={{ ...ss.chip(false), padding: "3px 10px", fontSize: 13, fontWeight: 700 }} onClick={() => adjustQty(mi, ii, 0.25)}>+</button>
                    <button style={{ ...ss.chip(false), padding: "3px 8px", fontSize: 10 }} onClick={() => swapItem(mi, ii)}>🔄 Swap</button>
                    <button style={{ ...ss.chip(false), padding: "3px 8px", fontSize: 10, borderColor: C.red, color: C.red }} onClick={() => removeItem(mi, ii)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div style={{ textAlign: "center", padding: 16, fontSize: 10, color: C.dim }}>
          SHAPE — The Inch Loss Secret · {new Date().toLocaleDateString("en-IN")} · DB: {db.length} items · {qtyMode.toUpperCase()} quantities
        </div>
      </div>
    );
  }

  return <div style={ss.page}><Header sub="Loading..." /></div>;
}
