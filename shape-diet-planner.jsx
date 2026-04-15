import { useState, useCallback, useRef } from "react";

// ─── HARDCODED INDIAN FOOD DATABASE (per serving) ───
// Source reference: Fittr / IFCT / NIN values - THESE NEVER CHANGE
const FOOD_DB = {
  // ── GRAINS & CEREALS ──
  "Brown Rice (cooked)": { serving: "150g", cal: 170, protein: 4, carbs: 36, fat: 1.5, fiber: 2, category: "grain" },
  "White Rice (cooked)": { serving: "150g", cal: 195, protein: 3.5, carbs: 44, fat: 0.4, fiber: 0.5, category: "grain" },
  "Roti (Whole Wheat)": { serving: "1 pc (40g atta)", cal: 120, protein: 3.5, carbs: 20, fat: 3.5, fiber: 2, category: "grain" },
  "Multigrain Roti": { serving: "1 pc (40g)", cal: 125, protein: 4, carbs: 19, fat: 3.8, fiber: 2.5, category: "grain" },
  "Jowar Roti": { serving: "1 pc (40g)", cal: 118, protein: 3.8, carbs: 22, fat: 1.8, fiber: 2.8, category: "grain" },
  "Bajra Roti": { serving: "1 pc (40g)", cal: 130, protein: 3.5, carbs: 22, fat: 2.2, fiber: 2.5, category: "grain" },
  "Oats (cooked)": { serving: "40g dry", cal: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4, category: "grain" },
  "Poha (cooked)": { serving: "1 cup (150g)", cal: 180, protein: 3.5, carbs: 35, fat: 3, fiber: 1.5, category: "grain" },
  "Upma (Rava)": { serving: "1 cup (200g)", cal: 210, protein: 5, carbs: 32, fat: 7, fiber: 2, category: "grain" },
  "Dalia (Broken Wheat)": { serving: "1 cup (200g)", cal: 175, protein: 6, carbs: 32, fat: 2, fiber: 4.5, category: "grain" },
  "Idli": { serving: "2 pcs (120g)", cal: 130, protein: 4, carbs: 26, fat: 0.5, fiber: 1, category: "grain" },
  "Dosa (Plain)": { serving: "1 pc (80g)", cal: 135, protein: 3.5, carbs: 22, fat: 3.5, fiber: 1, category: "grain" },
  "Quinoa (cooked)": { serving: "150g", cal: 180, protein: 6.5, carbs: 30, fat: 3, fiber: 3, category: "grain" },
  "Sweet Potato (boiled)": { serving: "150g", cal: 135, protein: 2, carbs: 31, fat: 0.2, fiber: 4, category: "grain" },
  "Muesli (no sugar)": { serving: "50g", cal: 190, protein: 5, carbs: 33, fat: 4.5, fiber: 3, category: "grain" },

  // ── PROTEINS (VEG) ──
  "Paneer (low fat)": { serving: "100g", cal: 195, protein: 18, carbs: 3, fat: 12, fiber: 0, category: "protein_veg" },
  "Paneer (full fat)": { serving: "100g", cal: 265, protein: 18, carbs: 3, fat: 20, fiber: 0, category: "protein_veg" },
  "Tofu": { serving: "100g", cal: 76, protein: 8, carbs: 2, fat: 4.5, fiber: 0.5, category: "protein_veg" },
  "Chana (Chickpeas, cooked)": { serving: "100g", cal: 164, protein: 9, carbs: 27, fat: 2.5, fiber: 7, category: "protein_veg" },
  "Rajma (Kidney Beans, cooked)": { serving: "100g", cal: 127, protein: 8.5, carbs: 22, fat: 0.5, fiber: 6, category: "protein_veg" },
  "Moong Dal (cooked)": { serving: "100g", cal: 105, protein: 7, carbs: 18, fat: 0.4, fiber: 4, category: "protein_veg" },
  "Toor Dal (cooked)": { serving: "100g", cal: 118, protein: 7.5, carbs: 20, fat: 0.5, fiber: 5, category: "protein_veg" },
  "Masoor Dal (cooked)": { serving: "100g", cal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 4, category: "protein_veg" },
  "Soya Chunks (cooked)": { serving: "50g dry", cal: 170, protein: 26, carbs: 16, fat: 0.5, fiber: 7, category: "protein_veg" },
  "Curd (low fat)": { serving: "150g", cal: 85, protein: 6, carbs: 7, fat: 3, fiber: 0, category: "protein_veg" },
  "Curd (full fat)": { serving: "150g", cal: 100, protein: 5, carbs: 7, fat: 5, fiber: 0, category: "protein_veg" },
  "Greek Yogurt": { serving: "150g", cal: 90, protein: 15, carbs: 5, fat: 0.7, fiber: 0, category: "protein_veg" },
  "Sprouts (Mixed)": { serving: "100g", cal: 100, protein: 7, carbs: 15, fat: 1, fiber: 4, category: "protein_veg" },
  "Whey Protein": { serving: "1 scoop (30g)", cal: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, category: "protein_veg" },

  // ── PROTEINS (NON-VEG) ──
  "Chicken Breast (grilled)": { serving: "100g", cal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: "protein_nv" },
  "Chicken Thigh (skinless)": { serving: "100g", cal: 195, protein: 26, carbs: 0, fat: 10, fiber: 0, category: "protein_nv" },
  "Egg (whole, boiled)": { serving: "1 large (50g)", cal: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, category: "protein_nv" },
  "Egg White (boiled)": { serving: "1 large", cal: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, category: "protein_nv" },
  "Fish (Rohu, grilled)": { serving: "100g", cal: 97, protein: 17, carbs: 0, fat: 3, fiber: 0, category: "protein_nv" },
  "Fish (Pomfret)": { serving: "100g", cal: 96, protein: 18, carbs: 0, fat: 2.5, fiber: 0, category: "protein_nv" },
  "Prawns (cooked)": { serving: "100g", cal: 99, protein: 20, carbs: 1, fat: 1.5, fiber: 0, category: "protein_nv" },
  "Mutton (lean, cooked)": { serving: "100g", cal: 215, protein: 26, carbs: 0, fat: 12, fiber: 0, category: "protein_nv" },
  "Salmon (grilled)": { serving: "100g", cal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: "protein_nv" },
  "Tuna (canned in water)": { serving: "100g", cal: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, category: "protein_nv" },

  // ── VEGETABLES ──
  "Mixed Sabzi (low oil)": { serving: "150g", cal: 80, protein: 3, carbs: 10, fat: 3, fiber: 4, category: "vegetable" },
  "Palak (Spinach, cooked)": { serving: "100g", cal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: "vegetable" },
  "Broccoli (steamed)": { serving: "100g", cal: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3, category: "vegetable" },
  "Cucumber": { serving: "100g", cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: "vegetable" },
  "Tomato": { serving: "100g", cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: "vegetable" },
  "Salad (mixed greens)": { serving: "100g", cal: 25, protein: 1.5, carbs: 4, fat: 0.3, fiber: 2, category: "vegetable" },
  "Bhindi (Okra, cooked)": { serving: "100g", cal: 35, protein: 2, carbs: 7, fat: 0.3, fiber: 3, category: "vegetable" },
  "Lauki (Bottle Gourd)": { serving: "100g", cal: 15, protein: 0.6, carbs: 3.4, fat: 0.1, fiber: 0.5, category: "vegetable" },
  "Capsicum": { serving: "100g", cal: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, category: "vegetable" },
  "Mushroom": { serving: "100g", cal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, category: "vegetable" },

  // ── FRUITS ──
  "Banana": { serving: "1 medium (120g)", cal: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, category: "fruit" },
  "Apple": { serving: "1 medium (180g)", cal: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, category: "fruit" },
  "Papaya": { serving: "150g", cal: 60, protein: 0.7, carbs: 15, fat: 0.2, fiber: 2.5, category: "fruit" },
  "Guava": { serving: "1 medium (100g)", cal: 68, protein: 2.5, carbs: 14, fat: 1, fiber: 5, category: "fruit" },
  "Orange": { serving: "1 medium (150g)", cal: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3, category: "fruit" },
  "Watermelon": { serving: "200g", cal: 60, protein: 1.2, carbs: 15, fat: 0.3, fiber: 0.8, category: "fruit" },
  "Mango": { serving: "1 cup (165g)", cal: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, category: "fruit" },
  "Pomegranate": { serving: "100g seeds", cal: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, category: "fruit" },
  "Berries (mixed)": { serving: "100g", cal: 50, protein: 1, carbs: 12, fat: 0.3, fiber: 3, category: "fruit" },

  // ── FATS & NUTS ──
  "Almonds": { serving: "10 pcs (12g)", cal: 70, protein: 2.5, carbs: 2.5, fat: 6, fiber: 1.5, category: "fat" },
  "Walnuts": { serving: "5 halves (15g)", cal: 98, protein: 2.3, carbs: 2, fat: 9.5, fiber: 1, category: "fat" },
  "Peanuts": { serving: "20g", cal: 115, protein: 5, carbs: 3, fat: 10, fiber: 1.5, category: "fat" },
  "Peanut Butter": { serving: "1 tbsp (16g)", cal: 95, protein: 4, carbs: 3, fat: 8, fiber: 1, category: "fat" },
  "Ghee": { serving: "1 tsp (5g)", cal: 45, protein: 0, carbs: 0, fat: 5, fiber: 0, category: "fat" },
  "Coconut Oil": { serving: "1 tsp (5g)", cal: 40, protein: 0, carbs: 0, fat: 4.5, fiber: 0, category: "fat" },
  "Olive Oil": { serving: "1 tsp (5g)", cal: 40, protein: 0, carbs: 0, fat: 4.5, fiber: 0, category: "fat" },
  "Flax Seeds": { serving: "1 tbsp (10g)", cal: 55, protein: 2, carbs: 3, fat: 4, fiber: 3, category: "fat" },
  "Chia Seeds": { serving: "1 tbsp (12g)", cal: 58, protein: 2, carbs: 5, fat: 3.5, fiber: 4, category: "fat" },
  "Avocado": { serving: "50g", cal: 80, protein: 1, carbs: 4, fat: 7, fiber: 3, category: "fat" },
  "Cheese (cheddar)": { serving: "20g", cal: 80, protein: 5, carbs: 0.5, fat: 6.5, fiber: 0, category: "fat" },

  // ── BEVERAGES & MISC ──
  "Black Coffee": { serving: "1 cup", cal: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, category: "beverage" },
  "Green Tea": { serving: "1 cup", cal: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, category: "beverage" },
  "Milk (toned)": { serving: "200ml", cal: 120, protein: 6, carbs: 10, fat: 6, fiber: 0, category: "beverage" },
  "Milk (skimmed)": { serving: "200ml", cal: 70, protein: 7, carbs: 10, fat: 0.4, fiber: 0, category: "beverage" },
  "Buttermilk (Chaas)": { serving: "200ml", cal: 40, protein: 2, carbs: 5, fat: 1, fiber: 0, category: "beverage" },
  "Coconut Water": { serving: "200ml", cal: 45, protein: 0.5, carbs: 10, fat: 0.2, fiber: 0, category: "beverage" },
  "Honey": { serving: "1 tsp (7g)", cal: 21, protein: 0, carbs: 6, fat: 0, fiber: 0, category: "beverage" },
  "Jaggery": { serving: "10g", cal: 38, protein: 0.1, carbs: 10, fat: 0, fiber: 0, category: "beverage" },
};

// ─── MEAL TEMPLATES BY GOAL ───
const MEAL_TEMPLATES = {
  weight_loss: {
    meals: 5,
    split: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    mealNames: ["Early Morning", "Breakfast", "Lunch", "Evening Snack", "Dinner"],
    mealCalSplit: [0.05, 0.25, 0.30, 0.10, 0.30],
  },
  fat_loss: {
    meals: 5,
    split: { protein: 0.40, carbs: 0.30, fat: 0.30 },
    mealNames: ["Early Morning", "Breakfast", "Lunch", "Evening Snack", "Dinner"],
    mealCalSplit: [0.05, 0.25, 0.30, 0.10, 0.30],
  },
  muscle_gain: {
    meals: 6,
    split: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    mealNames: ["Early Morning", "Breakfast", "Mid-Morning", "Lunch", "Post Workout", "Dinner"],
    mealCalSplit: [0.05, 0.20, 0.10, 0.25, 0.15, 0.25],
  },
};

// ─── CALORIE CALCULATOR ───
function calcTDEE(weight, height, age, gender, activity) {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  return Math.round(bmr * (factors[activity] || 1.55));
}

function getTargetCalories(tdee, goal) {
  if (goal === "weight_loss") return Math.round(tdee * 0.80);
  if (goal === "fat_loss") return Math.round(tdee * 0.75);
  if (goal === "muscle_gain") return Math.round(tdee * 1.15);
  return tdee;
}

// ─── SMART MEAL BUILDER ───
function pickItems(targetCal, targetP, targetC, targetF, mealType, dietType, usedItems) {
  const items = [];
  let remCal = targetCal, remP = targetP, remC = targetC, remF = targetF;

  const allowed = Object.entries(FOOD_DB).filter(([name, f]) => {
    if (dietType === "veg" && f.category === "protein_nv") return false;
    if (dietType === "egg_only" && f.category === "protein_nv" && !name.includes("Egg")) return false;
    return true;
  });

  function pick(categories, count) {
    const pool = allowed.filter(([n, f]) => categories.includes(f.category) && !usedItems.has(n));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const [name, food] = shuffled[i];
      let servings = Math.max(0.5, Math.min(3, Math.round((remCal * 0.5 / food.cal) * 2) / 2));
      if (food.category === "fat") servings = Math.min(2, servings);
      if (food.category === "vegetable") servings = Math.max(1, servings);
      items.push({ name, ...food, qty: servings });
      remCal -= food.cal * servings;
      remP -= food.protein * servings;
      remC -= food.carbs * servings;
      remF -= food.fat * servings;
      usedItems.add(name);
    }
  }

  // Meal type logic
  if (mealType === "Early Morning") {
    pick(["beverage"], 1);
    pick(["fat"], 1);
  } else if (mealType === "Breakfast") {
    pick(["grain"], 1);
    pick(["protein_veg", "protein_nv"], 1);
    pick(["fruit"], 1);
  } else if (mealType === "Lunch") {
    pick(["grain"], 1);
    pick(["protein_veg", "protein_nv"], 1);
    pick(["vegetable"], 1);
    pick(["fat"], 1);
  } else if (mealType === "Dinner") {
    pick(["grain"], 1);
    pick(["protein_veg", "protein_nv"], 1);
    pick(["vegetable"], 1);
  } else if (mealType === "Evening Snack" || mealType === "Mid-Morning") {
    pick(["protein_veg", "fruit", "fat"], 2);
  } else if (mealType === "Post Workout") {
    pick(["protein_veg", "protein_nv"], 1);
    pick(["grain", "fruit"], 1);
  }

  return items;
}

function generatePlan(params) {
  const { weight, height, age, gender, activity, goal, dietType } = params;
  const tdee = calcTDEE(weight, height, age, gender, activity);
  const target = getTargetCalories(tdee, goal);
  const template = MEAL_TEMPLATES[goal];
  const { protein: pRatio, carbs: cRatio, fat: fRatio } = template.split;

  const totalP = Math.round((target * pRatio) / 4);
  const totalC = Math.round((target * cRatio) / 4);
  const totalF = Math.round((target * fRatio) / 9);

  const usedItems = new Set();
  const meals = template.mealNames.map((name, i) => {
    const mealCal = Math.round(target * template.mealCalSplit[i]);
    const mealP = Math.round(totalP * template.mealCalSplit[i]);
    const mealC = Math.round(totalC * template.mealCalSplit[i]);
    const mealF = Math.round(totalF * template.mealCalSplit[i]);
    const items = pickItems(mealCal, mealP, mealC, mealF, name, dietType, usedItems);
    return { name, targetCal: mealCal, items };
  });

  return { tdee, target, totalP, totalC, totalF, meals };
}

// ─── COMPONENTS ───
const FONT = `'DM Sans', sans-serif`;
const DISPLAY = `'Playfair Display', serif`;

const colors = {
  bg: "#0B0F0E",
  card: "#141A18",
  cardHover: "#1A2220",
  accent: "#C5F467",
  accentDim: "rgba(197,244,103,0.15)",
  text: "#E8EDE6",
  textDim: "#7A8A7E",
  border: "#1E2A26",
  danger: "#F47068",
  blue: "#68B8F4",
};

export default function App() {
  const [step, setStep] = useState("input"); // input | result
  const [form, setForm] = useState({
    clientName: "", weight: "", height: "", age: "", gender: "male",
    activity: "moderate", goal: "fat_loss", dietType: "non_veg",
    chest: "", waist: "", hip: "", arm: "", thigh: "",
  });
  const [plan, setPlan] = useState(null);
  const printRef = useRef();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = () => {
    const p = generatePlan({
      weight: +form.weight, height: +form.height, age: +form.age,
      gender: form.gender, activity: form.activity, goal: form.goal, dietType: form.dietType,
    });
    setPlan(p);
    setStep("result");
  };

  const regenerate = () => {
    const p = generatePlan({
      weight: +form.weight, height: +form.height, age: +form.age,
      gender: form.gender, activity: form.activity, goal: form.goal, dietType: form.dietType,
    });
    setPlan(p);
  };

  const canGenerate = form.clientName && form.weight && form.height && form.age;

  const s = {
    page: { fontFamily: FONT, background: colors.bg, color: colors.text, minHeight: "100vh", padding: "24px 16px" },
    logo: { fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: colors.accent, letterSpacing: 1, marginBottom: 4 },
    subtitle: { fontSize: 12, color: colors.textDim, letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 },
    card: { background: colors.card, borderRadius: 16, padding: "20px", marginBottom: 16, border: `1px solid ${colors.border}` },
    label: { fontSize: 11, color: colors.textDim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, display: "block" },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, fontFamily: FONT, outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, fontFamily: FONT, outline: "none", boxSizing: "border-box", appearance: "none" },
    btn: { width: "100%", padding: "14px", borderRadius: 12, border: "none", background: colors.accent, color: colors.bg, fontSize: 15, fontWeight: 700, fontFamily: FONT, cursor: "pointer", letterSpacing: 0.5, marginTop: 8 },
    btnOutline: { padding: "10px 20px", borderRadius: 10, border: `1px solid ${colors.accent}`, background: "transparent", color: colors.accent, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    tag: { display: "inline-block", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
    mealHeader: { fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, marginBottom: 12 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${colors.border}` },
  };

  const Field = ({ label, k, type = "text", placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} placeholder={placeholder} value={form[k]} onChange={e => update(k, e.target.value)} />
    </div>
  );

  const Select = ({ label, k, options }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={s.label}>{label}</label>
      <select style={s.select} value={form[k]} onChange={e => update(k, e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const Chip = ({ active, children, onClick }) => (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 20, border: `1px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentDim : "transparent", color: active ? colors.accent : colors.textDim,
      fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer", transition: "all .2s",
    }}>{children}</button>
  );

  // ─── INPUT FORM ───
  if (step === "input") {
    return (
      <div style={s.page}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={s.logo}>SHAPE</div>
          <div style={s.subtitle}>The Inch Loss Secret — Diet Planner</div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.accent }}>Client Info</div>
          <Field label="Client Name" k="clientName" placeholder="Rahul Sharma" />
          <div style={s.grid2}>
            <Field label="Weight (kg)" k="weight" type="number" placeholder="82" />
            <Field label="Height (cm)" k="height" type="number" placeholder="175" />
          </div>
          <div style={s.grid2}>
            <Field label="Age" k="age" type="number" placeholder="32" />
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Gender</label>
              <div style={{ display: "flex", gap: 8 }}>
                <Chip active={form.gender === "male"} onClick={() => update("gender", "male")}>Male</Chip>
                <Chip active={form.gender === "female"} onClick={() => update("gender", "female")}>Female</Chip>
              </div>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.accent }}>Body Measurements (inches)</div>
          <div style={s.grid3}>
            <Field label="Chest" k="chest" type="number" placeholder="40" />
            <Field label="Waist" k="waist" type="number" placeholder="34" />
            <Field label="Hip" k="hip" type="number" placeholder="38" />
          </div>
          <div style={s.grid2}>
            <Field label="Arm" k="arm" type="number" placeholder="14" />
            <Field label="Thigh" k="thigh" type="number" placeholder="22" />
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.accent }}>Goal & Preferences</div>
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Goal</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Chip active={form.goal === "weight_loss"} onClick={() => update("goal", "weight_loss")}>Weight Loss</Chip>
              <Chip active={form.goal === "fat_loss"} onClick={() => update("goal", "fat_loss")}>Fat Loss</Chip>
              <Chip active={form.goal === "muscle_gain"} onClick={() => update("goal", "muscle_gain")}>Muscle Gain</Chip>
            </div>
          </div>
          <Select label="Activity Level" k="activity" options={[
            { value: "sedentary", label: "Sedentary (desk job, no exercise)" },
            { value: "light", label: "Light (1-2 workouts/week)" },
            { value: "moderate", label: "Moderate (3-5 workouts/week)" },
            { value: "active", label: "Active (6-7 workouts/week)" },
            { value: "very_active", label: "Very Active (twice daily)" },
          ]} />
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Diet Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Chip active={form.dietType === "veg"} onClick={() => update("dietType", "veg")}>Veg</Chip>
              <Chip active={form.dietType === "egg_only"} onClick={() => update("dietType", "egg_only")}>Egg + Veg</Chip>
              <Chip active={form.dietType === "non_veg"} onClick={() => update("dietType", "non_veg")}>Non-Veg</Chip>
            </div>
          </div>
        </div>

        <button style={{ ...s.btn, opacity: canGenerate ? 1 : 0.4 }} disabled={!canGenerate} onClick={generate}>
          Generate Diet Plan →
        </button>
      </div>
    );
  }

  // ─── RESULT VIEW ───
  const goalLabel = { weight_loss: "Weight Loss", fat_loss: "Fat Loss", muscle_gain: "Muscle Gain" };
  const totalActual = plan.meals.reduce((acc, m) => {
    m.items.forEach(it => { acc.cal += it.cal * it.qty; acc.p += it.protein * it.qty; acc.c += it.carbs * it.qty; acc.f += it.fat * it.qty; });
    return acc;
  }, { cal: 0, p: 0, c: 0, f: 0 });

  return (
    <div style={s.page} ref={printRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={s.logo}>SHAPE</div>
          <div style={{ fontSize: 11, color: colors.textDim, letterSpacing: 2, textTransform: "uppercase" }}>Diet Plan</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.btnOutline} onClick={regenerate}>↻ Shuffle</button>
          <button style={s.btnOutline} onClick={() => setStep("input")}>← Edit</button>
        </div>
      </div>

      {/* Client Summary */}
      <div style={{ ...s.card, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: DISPLAY }}>{form.clientName}</div>
          <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>
            {form.weight}kg · {form.height}cm · {form.age}y · {form.gender}
          </div>
          {(form.chest || form.waist || form.hip) && (
            <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>
              Measurements: {[form.chest && `C:${form.chest}"`, form.waist && `W:${form.waist}"`, form.hip && `H:${form.hip}"`, form.arm && `A:${form.arm}"`, form.thigh && `T:${form.thigh}"`].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ ...s.tag, background: colors.accentDim, color: colors.accent }}>{goalLabel[form.goal]}</span>
          <div style={{ fontSize: 11, color: colors.textDim, marginTop: 6 }}>TDEE: {plan.tdee} kcal</div>
        </div>
      </div>

      {/* Macro Overview */}
      <div style={{ ...s.card }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: DISPLAY, color: colors.accent }}>{Math.round(totalActual.cal)}</div>
          <div style={{ fontSize: 11, color: colors.textDim, letterSpacing: 2, textTransform: "uppercase" }}>Target: {plan.target} kcal</div>
        </div>
        <div style={{ ...s.grid3, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.blue }}>{Math.round(totalActual.p)}g</div>
            <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>Protein</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.accent }}>{Math.round(totalActual.c)}g</div>
            <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>Carbs</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.danger }}>{Math.round(totalActual.f)}g</div>
            <div style={{ fontSize: 10, color: colors.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>Fat</div>
          </div>
        </div>
      </div>

      {/* Meals */}
      {plan.meals.map((meal, mi) => {
        const mealTotals = meal.items.reduce((a, it) => ({
          cal: a.cal + it.cal * it.qty, p: a.p + it.protein * it.qty, c: a.c + it.carbs * it.qty, f: a.f + it.fat * it.qty
        }), { cal: 0, p: 0, c: 0, f: 0 });

        return (
          <div key={mi} style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={s.mealHeader}>{meal.name}</div>
              <span style={{ ...s.tag, background: colors.accentDim, color: colors.accent }}>{Math.round(mealTotals.cal)} kcal</span>
            </div>

            {meal.items.map((item, ii) => (
              <div key={ii} style={s.row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: colors.textDim }}>{item.qty === 1 ? item.serving : `${item.qty} × ${item.serving}`}</div>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: colors.textDim, textAlign: "right" }}>
                  <div><span style={{ color: colors.text, fontWeight: 600 }}>{Math.round(item.cal * item.qty)}</span> cal</div>
                  <div><span style={{ color: colors.blue }}>{Math.round(item.protein * item.qty)}g</span> P</div>
                  <div><span style={{ color: colors.accent }}>{Math.round(item.carbs * item.qty)}g</span> C</div>
                  <div><span style={{ color: colors.danger }}>{Math.round(item.fat * item.qty)}g</span> F</div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Food Database Reference */}
      <div style={{ ...s.card, marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: colors.accent }}>📋 Database: {Object.keys(FOOD_DB).length} Indian food items</div>
        <div style={{ fontSize: 12, color: colors.textDim, lineHeight: 1.6 }}>
          Values are fixed per serving — same food always shows same calories. Reference: IFCT (Indian Food Composition Tables) / NIN / Fittr benchmarks. 
          Includes grains, dals, paneer, chicken, fish, eggs, vegetables, fruits, nuts, oils & beverages.
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: colors.textDim }}>
        SHAPE — The Inch Loss Secret · Generated {new Date().toLocaleDateString("en-IN")}
      </div>
    </div>
  );
}
