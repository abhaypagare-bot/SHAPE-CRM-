import { useState, useEffect, useMemo, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

// ═══════════════════════════════════════════════════════
// FOOD DATABASE - HARDCODED (never changes)
// ═══════════════════════════════════════════════════════
const FOOD_DB = [
  { id:"g1",name:"Brown Rice",raw:"50g dry",cooked:"150g cooked",cal:170,p:4,c:36,f:1.5,cat:"grain",veg:true },
  { id:"g2",name:"White Rice",raw:"50g dry",cooked:"150g cooked",cal:195,p:3.5,c:44,f:0.4,cat:"grain",veg:true },
  { id:"g3",name:"Roti (Wheat)",raw:"40g atta",cooked:"1 roti",cal:120,p:3.5,c:20,f:3.5,cat:"grain",veg:true },
  { id:"g4",name:"Multigrain Roti",raw:"40g atta",cooked:"1 roti",cal:125,p:4,c:19,f:3.8,cat:"grain",veg:true },
  { id:"g5",name:"Jowar Roti",raw:"40g flour",cooked:"1 roti",cal:118,p:3.8,c:22,f:1.8,cat:"grain",veg:true },
  { id:"g6",name:"Bajra Roti",raw:"40g flour",cooked:"1 roti",cal:130,p:3.5,c:22,f:2.2,cat:"grain",veg:true },
  { id:"g7",name:"Oats",raw:"40g dry",cooked:"1 bowl (200g)",cal:150,p:5,c:27,f:2.5,cat:"grain",veg:true },
  { id:"g8",name:"Poha",raw:"50g dry",cooked:"1 cup (150g)",cal:180,p:3.5,c:35,f:3,cat:"grain",veg:true },
  { id:"g9",name:"Upma (Rava)",raw:"50g rava",cooked:"1 cup (200g)",cal:210,p:5,c:32,f:7,cat:"grain",veg:true },
  { id:"g10",name:"Dalia",raw:"50g dry",cooked:"1 cup (200g)",cal:175,p:6,c:32,f:2,cat:"grain",veg:true },
  { id:"g11",name:"Idli",raw:"80g batter",cooked:"2 pcs",cal:130,p:4,c:26,f:0.5,cat:"grain",veg:true },
  { id:"g12",name:"Dosa (Plain)",raw:"70g batter",cooked:"1 dosa",cal:135,p:3.5,c:22,f:3.5,cat:"grain",veg:true },
  { id:"g13",name:"Quinoa",raw:"50g dry",cooked:"150g cooked",cal:180,p:6.5,c:30,f:3,cat:"grain",veg:true },
  { id:"g14",name:"Sweet Potato",raw:"150g raw",cooked:"150g boiled",cal:135,p:2,c:31,f:0.2,cat:"grain",veg:true },
  { id:"g15",name:"Muesli",raw:"50g",cooked:"50g",cal:190,p:5,c:33,f:4.5,cat:"grain",veg:true },
  { id:"g16",name:"Ragi Roti",raw:"40g flour",cooked:"1 roti",cal:115,p:3.2,c:23,f:1.5,cat:"grain",veg:true },
  { id:"pv1",name:"Paneer (low fat)",raw:"100g",cooked:"100g",cal:195,p:18,c:3,f:12,cat:"protein",veg:true },
  { id:"pv2",name:"Paneer (full fat)",raw:"100g",cooked:"100g",cal:265,p:18,c:3,f:20,cat:"protein",veg:true },
  { id:"pv3",name:"Tofu",raw:"100g",cooked:"100g",cal:76,p:8,c:2,f:4.5,cat:"protein",veg:true },
  { id:"pv4",name:"Chana (Chickpeas)",raw:"40g dry",cooked:"100g cooked",cal:164,p:9,c:27,f:2.5,cat:"protein",veg:true },
  { id:"pv5",name:"Rajma",raw:"40g dry",cooked:"100g cooked",cal:127,p:8.5,c:22,f:0.5,cat:"protein",veg:true },
  { id:"pv6",name:"Moong Dal",raw:"40g dry",cooked:"100g cooked",cal:105,p:7,c:18,f:0.4,cat:"protein",veg:true },
  { id:"pv7",name:"Toor Dal",raw:"40g dry",cooked:"100g cooked",cal:118,p:7.5,c:20,f:0.5,cat:"protein",veg:true },
  { id:"pv8",name:"Masoor Dal",raw:"40g dry",cooked:"100g cooked",cal:116,p:9,c:20,f:0.4,cat:"protein",veg:true },
  { id:"pv9",name:"Soya Chunks",raw:"50g dry",cooked:"100g soaked",cal:170,p:26,c:16,f:0.5,cat:"protein",veg:true },
  { id:"pv10",name:"Curd (low fat)",raw:"150g",cooked:"150g",cal:85,p:6,c:7,f:3,cat:"protein",veg:true },
  { id:"pv11",name:"Curd (full fat)",raw:"150g",cooked:"150g",cal:100,p:5,c:7,f:5,cat:"protein",veg:true },
  { id:"pv12",name:"Greek Yogurt",raw:"150g",cooked:"150g",cal:90,p:15,c:5,f:0.7,cat:"protein",veg:true },
  { id:"pv13",name:"Sprouts (Mixed)",raw:"60g dry",cooked:"100g",cal:100,p:7,c:15,f:1,cat:"protein",veg:true },
  { id:"pv14",name:"Whey Protein",raw:"1 scoop (30g)",cooked:"1 scoop (30g)",cal:120,p:24,c:3,f:1.5,cat:"protein",veg:true },
  { id:"pv15",name:"Chana Dal",raw:"40g dry",cooked:"100g cooked",cal:130,p:8,c:22,f:1.5,cat:"protein",veg:true },
  { id:"pn1",name:"Chicken Breast",raw:"120g raw",cooked:"100g grilled",cal:165,p:31,c:0,f:3.6,cat:"protein",veg:false },
  { id:"pn2",name:"Chicken Thigh",raw:"130g raw",cooked:"100g cooked",cal:195,p:26,c:0,f:10,cat:"protein",veg:false },
  { id:"pn3",name:"Egg (whole)",raw:"1 egg (55g)",cooked:"1 boiled egg",cal:78,p:6,c:0.6,f:5,cat:"protein",veg:false },
  { id:"pn4",name:"Egg White",raw:"1 white (33g)",cooked:"1 white",cal:17,p:3.6,c:0.2,f:0.1,cat:"protein",veg:false },
  { id:"pn5",name:"Fish (Rohu)",raw:"120g raw",cooked:"100g grilled",cal:97,p:17,c:0,f:3,cat:"protein",veg:false },
  { id:"pn6",name:"Fish (Pomfret)",raw:"120g raw",cooked:"100g cooked",cal:96,p:18,c:0,f:2.5,cat:"protein",veg:false },
  { id:"pn7",name:"Prawns",raw:"120g raw",cooked:"100g cooked",cal:99,p:20,c:1,f:1.5,cat:"protein",veg:false },
  { id:"pn8",name:"Mutton (lean)",raw:"130g raw",cooked:"100g cooked",cal:215,p:26,c:0,f:12,cat:"protein",veg:false },
  { id:"pn9",name:"Salmon",raw:"120g raw",cooked:"100g grilled",cal:208,p:20,c:0,f:13,cat:"protein",veg:false },
  { id:"pn10",name:"Tuna (canned)",raw:"100g",cooked:"100g",cal:116,p:26,c:0,f:1,cat:"protein",veg:false },
  { id:"v1",name:"Mixed Sabzi",raw:"200g raw",cooked:"150g cooked",cal:80,p:3,c:10,f:3,cat:"vegetable",veg:true },
  { id:"v2",name:"Palak",raw:"150g raw",cooked:"100g cooked",cal:23,p:2.9,c:3.6,f:0.4,cat:"vegetable",veg:true },
  { id:"v3",name:"Broccoli",raw:"120g raw",cooked:"100g steamed",cal:35,p:2.4,c:7,f:0.4,cat:"vegetable",veg:true },
  { id:"v4",name:"Cucumber",raw:"100g",cooked:"100g",cal:15,p:0.7,c:3.6,f:0.1,cat:"vegetable",veg:true },
  { id:"v5",name:"Salad (mixed)",raw:"100g",cooked:"100g",cal:25,p:1.5,c:4,f:0.3,cat:"vegetable",veg:true },
  { id:"v6",name:"Bhindi (Okra)",raw:"120g raw",cooked:"100g cooked",cal:35,p:2,c:7,f:0.3,cat:"vegetable",veg:true },
  { id:"v7",name:"Lauki",raw:"150g raw",cooked:"100g cooked",cal:15,p:0.6,c:3.4,f:0.1,cat:"vegetable",veg:true },
  { id:"v8",name:"Mushroom",raw:"100g",cooked:"80g cooked",cal:22,p:3.1,c:3.3,f:0.3,cat:"vegetable",veg:true },
  { id:"v9",name:"Capsicum",raw:"100g",cooked:"100g",cal:20,p:0.9,c:4.6,f:0.2,cat:"vegetable",veg:true },
  { id:"v10",name:"Cauliflower",raw:"130g raw",cooked:"100g cooked",cal:25,p:2,c:5,f:0.3,cat:"vegetable",veg:true },
  { id:"f1",name:"Banana",raw:"1 medium (120g)",cooked:"1 medium",cal:105,p:1.3,c:27,f:0.4,cat:"fruit",veg:true },
  { id:"f2",name:"Apple",raw:"1 medium (180g)",cooked:"1 medium",cal:95,p:0.5,c:25,f:0.3,cat:"fruit",veg:true },
  { id:"f3",name:"Papaya",raw:"150g",cooked:"150g",cal:60,p:0.7,c:15,f:0.2,cat:"fruit",veg:true },
  { id:"f4",name:"Guava",raw:"1 pc (100g)",cooked:"1 pc",cal:68,p:2.5,c:14,f:1,cat:"fruit",veg:true },
  { id:"f5",name:"Orange",raw:"1 medium (150g)",cooked:"1 medium",cal:62,p:1.2,c:15,f:0.2,cat:"fruit",veg:true },
  { id:"f6",name:"Watermelon",raw:"200g",cooked:"200g",cal:60,p:1.2,c:15,f:0.3,cat:"fruit",veg:true },
  { id:"f7",name:"Pomegranate",raw:"100g seeds",cooked:"100g seeds",cal:83,p:1.7,c:19,f:1.2,cat:"fruit",veg:true },
  { id:"f8",name:"Berries (mixed)",raw:"100g",cooked:"100g",cal:50,p:1,c:12,f:0.3,cat:"fruit",veg:true },
  { id:"n1",name:"Almonds",raw:"10 pcs (12g)",cooked:"10 pcs",cal:70,p:2.5,c:2.5,f:6,cat:"fat",veg:true },
  { id:"n2",name:"Walnuts",raw:"5 halves (15g)",cooked:"5 halves",cal:98,p:2.3,c:2,f:9.5,cat:"fat",veg:true },
  { id:"n3",name:"Peanuts",raw:"20g",cooked:"20g",cal:115,p:5,c:3,f:10,cat:"fat",veg:true },
  { id:"n4",name:"Peanut Butter",raw:"1 tbsp (16g)",cooked:"1 tbsp",cal:95,p:4,c:3,f:8,cat:"fat",veg:true },
  { id:"n5",name:"Ghee",raw:"1 tsp (5g)",cooked:"1 tsp",cal:45,p:0,c:0,f:5,cat:"fat",veg:true },
  { id:"n6",name:"Olive Oil",raw:"1 tsp (5g)",cooked:"1 tsp",cal:40,p:0,c:0,f:4.5,cat:"fat",veg:true },
  { id:"n7",name:"Flax Seeds",raw:"1 tbsp (10g)",cooked:"1 tbsp",cal:55,p:2,c:3,f:4,cat:"fat",veg:true },
  { id:"n8",name:"Chia Seeds",raw:"1 tbsp (12g)",cooked:"1 tbsp",cal:58,p:2,c:5,f:3.5,cat:"fat",veg:true },
  { id:"n9",name:"Cashews",raw:"10 pcs (15g)",cooked:"10 pcs",cal:85,p:2.5,c:5,f:6.5,cat:"fat",veg:true },
  { id:"n10",name:"Cheese",raw:"20g",cooked:"20g",cal:80,p:5,c:0.5,f:6.5,cat:"fat",veg:true },
  { id:"b1",name:"Black Coffee",raw:"1 cup",cooked:"1 cup",cal:2,p:0.3,c:0,f:0,cat:"beverage",veg:true },
  { id:"b2",name:"Green Tea",raw:"1 cup",cooked:"1 cup",cal:2,p:0,c:0.5,f:0,cat:"beverage",veg:true },
  { id:"b3",name:"Milk (toned)",raw:"200ml",cooked:"200ml",cal:120,p:6,c:10,f:6,cat:"beverage",veg:true },
  { id:"b4",name:"Milk (skimmed)",raw:"200ml",cooked:"200ml",cal:70,p:7,c:10,f:0.4,cat:"beverage",veg:true },
  { id:"b5",name:"Buttermilk",raw:"200ml",cooked:"200ml",cal:40,p:2,c:5,f:1,cat:"beverage",veg:true },
  { id:"b6",name:"Coconut Water",raw:"200ml",cooked:"200ml",cal:45,p:0.5,c:10,f:0.2,cat:"beverage",veg:true },
];

const CATS = [
  { key:"grain",label:"Grains",em:"🌾" },{ key:"protein",label:"Proteins",em:"🥩" },
  { key:"vegetable",label:"Vegetables",em:"🥬" },{ key:"fruit",label:"Fruits",em:"🍎" },
  { key:"fat",label:"Fats & Nuts",em:"🥜" },{ key:"beverage",label:"Beverages",em:"☕" },
  { key:"custom",label:"Custom",em:"👨‍🍳" },
];
const MEALS = ["Early Morning","Breakfast","Mid-Morning","Lunch","Evening Snack","Dinner","Post Dinner"];

// ═══════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════
const C = {
  bg:"#060809",surface:"#0E1113",card:"#141719",elevated:"#1C1F22",
  accent:"#B8F054",accentDim:"rgba(184,240,84,.10)",accentMid:"rgba(184,240,84,.25)",
  text:"#ECF0E8",sub:"#8A9490",muted:"#505A56",
  border:"#1E2325",borderLight:"#2A2F32",
  red:"#F06050",blue:"#50A8F0",orange:"#F0A850",green:"#50F0A8",purple:"#A870F0",
};
const FN = `'Outfit', sans-serif`;
const FD = `'Playfair Display', serif`;
const rad = 14;

// ═══════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════
const SK = {
  clients: "shape-clients",
  plans: (id) => `shape-plan:${id}`,
  checkins: (id) => `shape-checkins:${id}`,
  customFoods: "shape-custom-foods",
};

async function load(key, fallback) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch(e) { console.error("Save error", e); }
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [ready, setReady] = useState(false);
  const [clients, setClients] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);
  const [screen, setScreen] = useState("roster"); // roster | client_form | client_detail | diet_prefs | diet_result | checkin_form | dashboard
  const [activeClientId, setActiveClientId] = useState(null);
  const [search, setSearch] = useState("");

  // Client form
  const emptyClient = { id:"",name:"",weight:"",height:"",age:"",gender:"male",activity:"moderate",goal:"fat_loss",dietType:"non_veg",macroMode:"auto",manualCal:"",manualP:"",manualC:"",manualF:"",chest:"",waist:"",hip:"",arm:"",thigh:"",qtyMode:"cooked",allowedFoods:[],activeMeals:["Early Morning","Breakfast","Lunch","Evening Snack","Dinner"],phone:"",notes:"" };
  const [cf, setCf] = useState({...emptyClient});
  const ucf = (k,v) => setCf(p=>({...p,[k]:v}));

  // Diet plan state
  const [currentPlan, setCurrentPlan] = useState(null);

  // Check-in form
  const [checkins, setCheckins] = useState([]);
  const [ciForm, setCiForm] = useState({ date:"", weight:"", chest:"", waist:"", hip:"", arm:"", thigh:"", bodyFat:"", note:"" });
  const uci = (k,v) => setCiForm(p=>({...p,[k]:v}));

  // Custom food form
  const [showAddFood, setShowAddFood] = useState(false);
  const [foodForm, setFoodForm] = useState({ name:"",raw:"",cooked:"",cal:"",p:"",c:"",f:"",veg:true });
  const uff = (k,v) => setFoodForm(p=>({...p,[k]:v}));

  // ─── LOAD ───
  useEffect(() => {
    (async () => {
      const cl = await load(SK.clients, []);
      const cf2 = await load(SK.customFoods, []);
      setClients(cl);
      setCustomFoods(cf2);
      setReady(true);
    })();
  }, []);

  const allFoods = useMemo(() => [...FOOD_DB, ...customFoods], [customFoods]);
  const activeClient = clients.find(c => c.id === activeClientId);

  // ─── CLIENT CRUD ───
  const saveClient = async (clientData) => {
    const isNew = !clientData.id;
    const c = isNew ? { ...clientData, id: "c_" + Date.now() } : clientData;
    const updated = isNew ? [...clients, c] : clients.map(x => x.id === c.id ? c : x);
    setClients(updated);
    await save(SK.clients, updated);
    setActiveClientId(c.id);
    return c;
  };

  const deleteClient = async (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    await save(SK.clients, updated);
    try { await window.storage.delete(SK.plans(id)); } catch {}
    try { await window.storage.delete(SK.checkins(id)); } catch {}
    setScreen("roster");
  };

  // ─── LOAD CLIENT DATA ───
  const openClient = async (id) => {
    setActiveClientId(id);
    const plan = await load(SK.plans(id), null);
    const ci = await load(SK.checkins(id), []);
    setCurrentPlan(plan);
    setCheckins(ci);
    setScreen("client_detail");
  };

  // ─── DIET PLAN GENERATION ───
  const generatePlan = async (client) => {
    const macros = getClientMacros(client);
    if (!macros) return;
    const pool = getFilteredFoods(client);
    const mealCount = client.activeMeals.length;
    const calPerMeal = macros.cal / mealCount;

    const meals = client.activeMeals.map(mealName => {
      const items = [];
      const used = new Set();
      const pick = (cats, n) => {
        const avail = pool.filter(f => cats.includes(f.cat) && !used.has(f.id));
        const shuffled = [...avail].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
      };
      let picks = [];
      if (mealName === "Early Morning" || mealName === "Post Dinner") picks = [...pick(["beverage"],1), ...pick(["fat"],1)];
      else if (mealName === "Breakfast") picks = [...pick(["grain"],1), ...pick(["protein"],1), ...pick(["fruit"],1)];
      else if (mealName === "Lunch" || mealName === "Dinner") picks = [...pick(["grain"],1), ...pick(["protein"],1), ...pick(["vegetable"],1), ...pick(["fat"],1)];
      else picks = [...pick(["protein","fruit","fat","custom"],2)];
      picks.forEach(f => used.add(f.id));

      if (picks.length > 0) {
        const baseCal = picks.reduce((s,f) => s + f.cal, 0);
        const scale = baseCal > 0 ? calPerMeal / baseCal : 1;
        picks.forEach(f => items.push({ ...f, qty: Math.max(0.25, Math.round(scale * 4) / 4) }));
      }
      return { name: mealName, items };
    });

    const plan = { meals, macros, generatedAt: new Date().toISOString() };
    setCurrentPlan(plan);
    await save(SK.plans(client.id), plan);
    setScreen("diet_result");
  };

  const getClientMacros = (client) => {
    if (client.macroMode === "manual" && client.manualCal) {
      return { cal: +client.manualCal, p: +client.manualP, c: +client.manualC, f: +client.manualF };
    }
    const w = +client.weight, h = +client.height, a = +client.age;
    if (!w || !h || !a) return null;
    const bmr = client.gender === "male" ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
    const af = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
    const tdee = Math.round(bmr * (af[client.activity] || 1.55));
    const mult = { weight_loss:0.80, fat_loss:0.75, muscle_gain:1.15 };
    const cal = Math.round(tdee * (mult[client.goal] || 1));
    const splits = { weight_loss:[.35,.35,.30], fat_loss:[.40,.30,.30], muscle_gain:[.30,.45,.25] };
    const [pr,cr,fr] = splits[client.goal] || [.30,.40,.30];
    return { cal, p: Math.round(cal*pr/4), c: Math.round(cal*cr/4), f: Math.round(cal*fr/9), tdee };
  };

  const getFilteredFoods = (client) => {
    const allowed = new Set(client.allowedFoods || []);
    return allFoods.filter(f => {
      if (allowed.size > 0 && !allowed.has(f.id)) return false;
      if (client.dietType === "veg" && !f.veg) return false;
      if (client.dietType === "egg" && !f.veg && !f.name.includes("Egg")) return false;
      return true;
    });
  };

  // ─── PLAN MUTATIONS ───
  const adjustQty = async (mi, ii, delta) => {
    const p = { ...currentPlan, meals: currentPlan.meals.map((m, mIdx) => mIdx !== mi ? m : { ...m, items: m.items.map((it, iIdx) => iIdx !== ii ? it : { ...it, qty: Math.max(0.25, Math.round((it.qty + delta)*4)/4) }) }) };
    setCurrentPlan(p);
    await save(SK.plans(activeClientId), p);
  };

  const swapItem = async (mi, ii) => {
    const old = currentPlan.meals[mi].items[ii];
    const pool = getFilteredFoods(activeClient).filter(f => f.cat === old.cat && f.id !== old.id);
    if (!pool.length) return;
    const rep = pool[Math.floor(Math.random() * pool.length)];
    const p = { ...currentPlan, meals: currentPlan.meals.map((m, mIdx) => mIdx !== mi ? m : { ...m, items: m.items.map((it, iIdx) => iIdx !== ii ? it : { ...rep, qty: old.qty }) }) };
    setCurrentPlan(p);
    await save(SK.plans(activeClientId), p);
  };

  const removeItem = async (mi, ii) => {
    const p = { ...currentPlan, meals: currentPlan.meals.map((m, mIdx) => mIdx !== mi ? m : { ...m, items: m.items.filter((_, iIdx) => iIdx !== ii) }) };
    setCurrentPlan(p);
    await save(SK.plans(activeClientId), p);
  };

  const autoBalance = async () => {
    if (!currentPlan || !activeClient) return;
    const macros = currentPlan.macros;
    const curCal = currentPlan.meals.reduce((s,m) => s + m.items.reduce((s2,it) => s2 + it.cal*it.qty, 0), 0);
    if (curCal === 0) return;
    const ratio = macros.cal / curCal;
    const p = { ...currentPlan, meals: currentPlan.meals.map(m => ({ ...m, items: m.items.map(it => ({ ...it, qty: Math.max(0.25, Math.round(it.qty * ratio * 4)/4) })) })) };
    setCurrentPlan(p);
    await save(SK.plans(activeClientId), p);
  };

  // ─── CHECKIN ───
  const saveCheckin = async () => {
    const entry = { ...ciForm, date: ciForm.date || new Date().toISOString().split("T")[0], id: "ci_" + Date.now() };
    const updated = [...checkins, entry].sort((a,b) => a.date.localeCompare(b.date));
    setCheckins(updated);
    await save(SK.checkins(activeClientId), updated);
    setCiForm({ date:"", weight:"", chest:"", waist:"", hip:"", arm:"", thigh:"", bodyFat:"", note:"" });
    setScreen("dashboard");
  };

  const deleteCheckin = async (id) => {
    const updated = checkins.filter(c => c.id !== id);
    setCheckins(updated);
    await save(SK.checkins(activeClientId), updated);
  };

  // ─── ADD CUSTOM FOOD ───
  const addCustomFood = async () => {
    const item = { id: "cust_" + Date.now(), name: foodForm.name, raw: foodForm.raw, cooked: foodForm.cooked, cal: +foodForm.cal, p: +foodForm.p, c: +foodForm.c, f: +foodForm.f, cat: "custom", veg: foodForm.veg };
    const updated = [...customFoods, item];
    setCustomFoods(updated);
    await save(SK.customFoods, updated);
    setFoodForm({ name:"",raw:"",cooked:"",cal:"",p:"",c:"",f:"",veg:true });
    setShowAddFood(false);
  };

  // ═══════════════════════════════════════════════════════
  // SHARED UI COMPONENTS
  // ═══════════════════════════════════════════════════════
  const sty = {
    page: { fontFamily: FN, background: C.bg, color: C.text, minHeight:"100vh", padding:"16px 12px", maxWidth:780, margin:"0 auto" },
    card: { background: C.card, borderRadius: rad, padding:"16px", marginBottom:10, border:`1px solid ${C.border}` },
    label: { fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:5, display:"block" },
    input: { width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontSize:13, fontFamily:FN, outline:"none", boxSizing:"border-box" },
    select: { width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontSize:13, fontFamily:FN, outline:"none", boxSizing:"border-box" },
    btn: (bg=C.accent, fg=C.bg) => ({ padding:"11px 22px", borderRadius:10, border:"none", background:bg, color:fg, fontSize:13, fontWeight:700, fontFamily:FN, cursor:"pointer", transition:"all .15s" }),
    btnO: (c=C.accent) => ({ padding:"7px 14px", borderRadius:8, border:`1px solid ${c}`, background:"transparent", color:c, fontSize:11, fontWeight:600, fontFamily:FN, cursor:"pointer" }),
    chip: (on) => ({ padding:"5px 12px", borderRadius:20, border:`1px solid ${on ? C.accent : C.border}`, background:on ? C.accentDim : "transparent", color:on ? C.accent : C.sub, fontSize:11, fontWeight:600, fontFamily:FN, cursor:"pointer", transition:"all .15s" }),
    tag: (c) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, background:c+"15", color:c }),
    g2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
    g3: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 },
    sec: { fontSize:12, fontWeight:700, color:C.accent, marginBottom:10, display:"flex", alignItems:"center", gap:6 },
    row: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  };

  const Inp = ({ label, k, obj, set, type="text", ph="" }) => (
    <div style={{ marginBottom:10 }}>
      <label style={sty.label}>{label}</label>
      <input style={sty.input} type={type} placeholder={ph} value={obj[k]} onChange={e => set(k, e.target.value)} />
    </div>
  );

  const Logo = ({ sub }) => (
    <div style={{ textAlign:"center", marginBottom:20 }}>
      <div style={{ fontFamily:FD, fontSize:24, fontWeight:700, color:C.accent, letterSpacing:1 }}>SHAPE</div>
      <div style={{ fontSize:9, color:C.muted, letterSpacing:3, textTransform:"uppercase" }}>{sub}</div>
    </div>
  );

  const Nav = ({ items }) => (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
      {items.map(([label, action, color]) => <button key={label} style={sty.btnO(color || C.accent)} onClick={action}>{label}</button>)}
    </div>
  );

  if (!ready) return <div style={sty.page}><Logo sub="Loading..." /></div>;

  // ═══════════════════════════════════════════════════════
  // SCREEN: CLIENT ROSTER
  // ═══════════════════════════════════════════════════════
  if (screen === "roster") {
    const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <div style={sty.page}>
        <Logo sub={`Client Management · ${clients.length} Active Clients`} />
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <input style={{ ...sty.input, flex:1 }} placeholder="🔍  Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
          <button style={sty.btn()} onClick={() => { setCf({...emptyClient}); setScreen("client_form"); }}>+ New Client</button>
        </div>

        {filtered.length === 0 && <div style={{ ...sty.card, textAlign:"center", padding:40, color:C.sub }}>
          {clients.length === 0 ? "No clients yet. Add your first client!" : "No clients match your search."}
        </div>}

        {filtered.map(c => {
          const goalColors = { fat_loss:C.red, weight_loss:C.orange, muscle_gain:C.green };
          const goalLabels = { fat_loss:"Fat Loss", weight_loss:"Weight Loss", muscle_gain:"Muscle Gain" };
          return (
            <div key={c.id} style={{ ...sty.card, cursor:"pointer", transition:"all .15s" }} onClick={() => openClient(c.id)}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={sty.row}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, fontFamily:FD }}>{c.name}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{c.weight}kg · {c.height}cm · {c.age}y · {c.gender} · {c.dietType === "veg" ? "🟢 Veg" : c.dietType === "egg" ? "🟡 Egg" : "🔴 Non-Veg"}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={sty.tag(goalColors[c.goal] || C.accent)}>{goalLabels[c.goal]}</span>
                  {c.phone && <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{c.phone}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: CLIENT FORM (Add / Edit)
  // ═══════════════════════════════════════════════════════
  if (screen === "client_form") {
    const isEdit = !!cf.id;
    return (
      <div style={sty.page}>
        <Logo sub={isEdit ? "Edit Client" : "New Client"} />
        <Nav items={[["← Back", () => isEdit ? openClient(cf.id) : setScreen("roster")]]} />

        <div style={sty.card}>
          <div style={sty.sec}>👤 Details</div>
          <Inp label="Full Name" k="name" obj={cf} set={ucf} ph="Rahul Sharma" />
          <Inp label="Phone" k="phone" obj={cf} set={ucf} ph="+91 98765 43210" />
          <div style={sty.g3}>
            <Inp label="Weight (kg)" k="weight" obj={cf} set={ucf} type="number" ph="82" />
            <Inp label="Height (cm)" k="height" obj={cf} set={ucf} type="number" ph="175" />
            <Inp label="Age" k="age" obj={cf} set={ucf} type="number" ph="32" />
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={sty.label}>Gender</label>
            <div style={{ display:"flex", gap:6 }}>
              {["male","female"].map(g => <button key={g} style={sty.chip(cf.gender===g)} onClick={() => ucf("gender",g)}>{g==="male"?"Male":"Female"}</button>)}
            </div>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={sty.label}>Activity Level</label>
            <select style={sty.select} value={cf.activity} onChange={e => ucf("activity",e.target.value)}>
              <option value="sedentary">Sedentary</option><option value="light">Light (1-2x)</option>
              <option value="moderate">Moderate (3-5x)</option><option value="active">Active (6-7x)</option>
              <option value="very_active">Very Active (2x/day)</option>
            </select>
          </div>
        </div>

        <div style={sty.card}>
          <div style={sty.sec}>📐 Measurements (inches)</div>
          <div style={sty.g3}>
            <Inp label="Chest" k="chest" obj={cf} set={ucf} type="number" ph="40" />
            <Inp label="Waist" k="waist" obj={cf} set={ucf} type="number" ph="34" />
            <Inp label="Hip" k="hip" obj={cf} set={ucf} type="number" ph="38" />
          </div>
          <div style={sty.g2}>
            <Inp label="Arm" k="arm" obj={cf} set={ucf} type="number" ph="14" />
            <Inp label="Thigh" k="thigh" obj={cf} set={ucf} type="number" ph="22" />
          </div>
        </div>

        <div style={sty.card}>
          <div style={sty.sec}>🎯 Goal & Macros</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {[["fat_loss","Fat Loss"],["weight_loss","Weight Loss"],["muscle_gain","Muscle Gain"]].map(([v,l]) =>
              <button key={v} style={sty.chip(cf.goal===v)} onClick={() => ucf("goal",v)}>{l}</button>)}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {[["veg","🟢 Veg"],["egg","🟡 Egg+Veg"],["non_veg","🔴 Non-Veg"]].map(([v,l]) =>
              <button key={v} style={sty.chip(cf.dietType===v)} onClick={() => ucf("dietType",v)}>{l}</button>)}
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            <button style={sty.chip(cf.macroMode==="auto")} onClick={() => ucf("macroMode","auto")}>Auto (TDEE)</button>
            <button style={sty.chip(cf.macroMode==="manual")} onClick={() => ucf("macroMode","manual")}>Manual Macros</button>
          </div>
          {cf.macroMode === "manual" && <div style={sty.g2}>
            <Inp label="Calories" k="manualCal" obj={cf} set={ucf} type="number" ph="1800" />
            <Inp label="Protein (g)" k="manualP" obj={cf} set={ucf} type="number" ph="150" />
            <Inp label="Carbs (g)" k="manualC" obj={cf} set={ucf} type="number" ph="180" />
            <Inp label="Fat (g)" k="manualF" obj={cf} set={ucf} type="number" ph="50" />
          </div>}
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            <label style={sty.label}>Qty Display</label>
            <button style={sty.chip(cf.qtyMode==="raw")} onClick={() => ucf("qtyMode","raw")}>Raw</button>
            <button style={sty.chip(cf.qtyMode==="cooked")} onClick={() => ucf("qtyMode","cooked")}>Cooked</button>
          </div>
          <Inp label="Notes" k="notes" obj={cf} set={ucf} ph="Allergies, preferences, etc." />
        </div>

        <button style={{ ...sty.btn(), width:"100%", opacity: cf.name ? 1 : 0.4 }} disabled={!cf.name} onClick={async () => {
          const saved = await saveClient(cf);
          await openClient(saved.id);
        }}>{isEdit ? "Save Changes" : "Create Client"}</button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: CLIENT DETAIL (Hub)
  // ═══════════════════════════════════════════════════════
  if (screen === "client_detail" && activeClient) {
    const macros = getClientMacros(activeClient);
    const goalLabels = { fat_loss:"Fat Loss", weight_loss:"Weight Loss", muscle_gain:"Muscle Gain" };
    const lastCI = checkins.length > 0 ? checkins[checkins.length - 1] : null;
    const firstCI = checkins.length > 0 ? checkins[0] : null;

    return (
      <div style={sty.page}>
        <Logo sub="Client Profile" />
        <Nav items={[["← All Clients", () => setScreen("roster")]]} />

        {/* Profile Card */}
        <div style={{ ...sty.card, background:`linear-gradient(135deg, ${C.card} 0%, ${C.elevated} 100%)` }}>
          <div style={sty.row}>
            <div>
              <div style={{ fontFamily:FD, fontSize:22, fontWeight:700 }}>{activeClient.name}</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>{activeClient.weight}kg · {activeClient.height}cm · {activeClient.age}y · {activeClient.gender}</div>
              {activeClient.phone && <div style={{ fontSize:11, color:C.sub }}>📞 {activeClient.phone}</div>}
              {(activeClient.chest||activeClient.waist) && <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>
                {[activeClient.chest&&`C:${activeClient.chest}"`,activeClient.waist&&`W:${activeClient.waist}"`,activeClient.hip&&`H:${activeClient.hip}"`,activeClient.arm&&`A:${activeClient.arm}"`,activeClient.thigh&&`T:${activeClient.thigh}"`].filter(Boolean).join(" · ")}
              </div>}
              {activeClient.notes && <div style={{ fontSize:11, color:C.sub, marginTop:4, fontStyle:"italic" }}>{activeClient.notes}</div>}
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={sty.tag(C.accent)}>{goalLabels[activeClient.goal]}</span>
              <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{activeClient.dietType==="veg"?"🟢 Veg":activeClient.dietType==="egg"?"🟡 Egg":"🔴 Non-Veg"}</div>
              <div style={{ fontSize:10, color:C.muted }}>{activeClient.qtyMode==="raw"?"📏 Raw Qty":"🍽 Cooked Qty"}</div>
            </div>
          </div>
          {macros && <div style={{ display:"flex", justifyContent:"space-around", marginTop:14, padding:"12px 0", borderTop:`1px solid ${C.border}`, textAlign:"center" }}>
            <div><div style={{ fontSize:18, fontWeight:800, color:C.accent }}>{macros.cal}</div><div style={{ fontSize:9, color:C.muted }}>KCAL</div></div>
            <div><div style={{ fontSize:18, fontWeight:800, color:C.blue }}>{macros.p}g</div><div style={{ fontSize:9, color:C.muted }}>PROTEIN</div></div>
            <div><div style={{ fontSize:18, fontWeight:800, color:C.orange }}>{macros.c}g</div><div style={{ fontSize:9, color:C.muted }}>CARBS</div></div>
            <div><div style={{ fontSize:18, fontWeight:800, color:C.red }}>{macros.f}g</div><div style={{ fontSize:9, color:C.muted }}>FAT</div></div>
          </div>}
        </div>

        {/* Quick Stats */}
        {lastCI && <div style={{ ...sty.card, ...sty.g3, textAlign:"center" }}>
          <div>
            <div style={{ fontSize:9, color:C.muted }}>CURRENT WT</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{lastCI.weight}kg</div>
            {firstCI && checkins.length > 1 && <div style={{ fontSize:10, color: +lastCI.weight < +firstCI.weight ? C.green : C.red }}>{(+lastCI.weight - +firstCI.weight).toFixed(1)}kg</div>}
          </div>
          <div>
            <div style={{ fontSize:9, color:C.muted }}>WAIST</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text }}>{lastCI.waist || "—"}"</div>
            {firstCI && checkins.length > 1 && lastCI.waist && firstCI.waist && <div style={{ fontSize:10, color: +lastCI.waist < +firstCI.waist ? C.green : C.red }}>{(+lastCI.waist - +firstCI.waist).toFixed(1)}"</div>}
          </div>
          <div>
            <div style={{ fontSize:9, color:C.muted }}>CHECK-INS</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.accent }}>{checkins.length}</div>
          </div>
        </div>}

        {/* Action Buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
          {[
            ["🍽 Diet Plan", currentPlan ? () => setScreen("diet_result") : null, currentPlan ? "View Current Plan" : "No plan yet"],
            ["🆕 Generate Diet", () => { setScreen("diet_prefs"); }, "Create / Regenerate"],
            ["📋 Weekly Check-In", () => { setCiForm({ date: new Date().toISOString().split("T")[0], weight:"",chest:"",waist:"",hip:"",arm:"",thigh:"",bodyFat:"",note:"" }); setScreen("checkin_form"); }, "Log Measurements"],
            ["📊 Dashboard", checkins.length > 0 ? () => setScreen("dashboard") : null, checkins.length > 0 ? "View Progress" : "No data yet"],
          ].map(([title, action, sub]) => (
            <div key={title} style={{ ...sty.card, cursor: action ? "pointer" : "default", opacity: action ? 1 : 0.4, textAlign:"center", padding:20 }}
              onClick={action || undefined}>
              <div style={{ fontSize:16, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:10, color:C.sub }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button style={sty.btnO(C.accent)} onClick={() => { setCf({...activeClient}); setScreen("client_form"); }}>✏️ Edit Client</button>
          <button style={sty.btnO(C.red)} onClick={() => { if(confirm("Delete this client and all their data?")) deleteClient(activeClient.id); }}>🗑 Delete</button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: DIET PREFERENCES (Food selection for client)
  // ═══════════════════════════════════════════════════════
  if (screen === "diet_prefs" && activeClient) {
    const cl = activeClient;
    const allowed = new Set(cl.allowedFoods || []);
    const filtered = allFoods.filter(f => {
      if (cl.dietType === "veg" && !f.veg) return false;
      if (cl.dietType === "egg" && !f.veg && !f.name.includes("Egg")) return false;
      return true;
    });

    const toggleF = async (fid) => {
      const newAllowed = new Set(allowed);
      newAllowed.has(fid) ? newAllowed.delete(fid) : newAllowed.add(fid);
      const updated = { ...cl, allowedFoods: [...newAllowed] };
      await saveClient(updated);
    };

    const toggleCat = async (catKey) => {
      const ids = filtered.filter(f => f.cat === catKey).map(f => f.id);
      const allOn = ids.every(id => allowed.has(id) || allowed.size === 0);
      const newAllowed = new Set(allowed.size === 0 ? allFoods.map(f=>f.id) : allowed);
      ids.forEach(id => allOn ? newAllowed.delete(id) : newAllowed.add(id));
      const updated = { ...cl, allowedFoods: [...newAllowed] };
      await saveClient(updated);
    };

    const toggleMeal = async (m) => {
      const meals = cl.activeMeals.includes(m) ? cl.activeMeals.filter(x=>x!==m) : [...cl.activeMeals, m];
      await saveClient({ ...cl, activeMeals: meals });
    };

    const isEmpty = allowed.size === 0; // means "all allowed"

    return (
      <div style={sty.page}>
        <Logo sub={`${cl.name} — Food Preferences`} />
        <Nav items={[["← Back", () => openClient(cl.id)]]} />

        <div style={{ ...sty.card, ...sty.row }}>
          <div style={sty.sec}>🕐 Active Meals</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {MEALS.map(m => <button key={m} style={sty.chip(cl.activeMeals.includes(m))} onClick={() => toggleMeal(m)}>{m}</button>)}
        </div>

        {CATS.map(cat => {
          const items = filtered.filter(f => f.cat === cat.key);
          if (!items.length && cat.key !== "custom") return null;
          const allOn = items.length > 0 && items.every(f => isEmpty || allowed.has(f.id));
          return (
            <div key={cat.key} style={sty.card}>
              <div style={{ ...sty.row, marginBottom:8 }}>
                <div style={sty.sec}>{cat.em} {cat.label}</div>
                {items.length > 0 && <button style={sty.chip(allOn)} onClick={() => toggleCat(cat.key)}>{allOn ? "Deselect All" : "Select All"}</button>}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {items.map(f => (
                  <button key={f.id} style={{ ...sty.chip(isEmpty || allowed.has(f.id)), fontSize:10, padding:"4px 8px" }} onClick={() => toggleF(f.id)}>
                    {f.name} <span style={{ opacity:.5 }}>{f.cal}cal</span>
                  </button>
                ))}
              </div>
              {cat.key === "custom" && <button style={{ ...sty.btnO(), marginTop:8 }} onClick={() => setShowAddFood(true)}>+ Add Custom Recipe</button>}
            </div>
          );
        })}

        {/* Custom food modal */}
        {showAddFood && <div style={{ ...sty.card, border:`1px solid ${C.accent}` }}>
          <div style={sty.sec}>👨‍🍳 New Custom Recipe</div>
          <Inp label="Name" k="name" obj={foodForm} set={uff} ph="Mom's Dal Khichdi" />
          <div style={sty.g2}>
            <Inp label="Raw Qty" k="raw" obj={foodForm} set={uff} ph="80g rice+30g dal" />
            <Inp label="Cooked Qty" k="cooked" obj={foodForm} set={uff} ph="1 bowl (250g)" />
          </div>
          <div style={sty.g2}>
            <Inp label="Calories" k="cal" obj={foodForm} set={uff} type="number" ph="280" />
            <Inp label="Protein" k="p" obj={foodForm} set={uff} type="number" ph="10" />
          </div>
          <div style={sty.g2}>
            <Inp label="Carbs" k="c" obj={foodForm} set={uff} type="number" ph="45" />
            <Inp label="Fat" k="f" obj={foodForm} set={uff} type="number" ph="5" />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button style={sty.btn()} onClick={addCustomFood} disabled={!foodForm.name||!foodForm.cal}>Save</button>
            <button style={sty.btnO(C.red)} onClick={() => setShowAddFood(false)}>Cancel</button>
          </div>
        </div>}

        <button style={{ ...sty.btn(), width:"100%", marginTop:10 }} onClick={() => generatePlan(activeClient)}>
          Generate Diet Plan →
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: DIET RESULT
  // ═══════════════════════════════════════════════════════
  if (screen === "diet_result" && currentPlan && activeClient) {
    const cl = activeClient;
    const macros = currentPlan.macros;
    const tot = currentPlan.meals.reduce((a,m) => { m.items.forEach(it => { a.cal+=it.cal*it.qty; a.p+=it.p*it.qty; a.c+=it.c*it.qty; a.f+=it.f*it.qty; }); return a; }, {cal:0,p:0,c:0,f:0});
    const calDiff = Math.round(tot.cal) - macros.cal;
    const diffColor = Math.abs(calDiff) < 50 ? C.green : Math.abs(calDiff) < 150 ? C.orange : C.red;

    return (
      <div style={sty.page}>
        <div style={{ ...sty.row, marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:FD, fontSize:20, fontWeight:700, color:C.accent }}>SHAPE</div>
            <div style={{ fontSize:10, color:C.muted }}>{cl.name} — Diet Plan</div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <button style={sty.btnO()} onClick={() => openClient(cl.id)}>← Back</button>
            <button style={sty.btnO()} onClick={() => generatePlan(cl)}>↻ Shuffle</button>
            <button style={sty.btnO(C.green)} onClick={autoBalance}>⚖ Balance</button>
          </div>
        </div>

        {/* Macro bar */}
        <div style={sty.card}>
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <span style={{ fontSize:32, fontWeight:800, fontFamily:FD, color:C.accent }}>{Math.round(tot.cal)}</span>
            <span style={{ fontSize:12, color:C.muted, marginLeft:6 }}>/ {macros.cal} kcal</span>
            <span style={{ fontSize:12, color:diffColor, marginLeft:6, fontWeight:700 }}>({calDiff>0?"+":""}{calDiff})</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
            {[{l:"Protein",v:tot.p,t:macros.p,c:C.blue},{l:"Carbs",v:tot.c,t:macros.c,c:C.orange},{l:"Fat",v:tot.f,t:macros.f,c:C.red}].map(m =>
              <div key={m.l}><div style={{ fontSize:18, fontWeight:800, color:m.c }}>{Math.round(m.v)}g</div><div style={{ fontSize:9, color:C.muted }}>{m.l} (T:{m.t})</div></div>
            )}
          </div>
        </div>

        {/* Meals */}
        {currentPlan.meals.map((meal, mi) => {
          const mt = meal.items.reduce((a,it) => ({cal:a.cal+it.cal*it.qty, p:a.p+it.p*it.qty, c:a.c+it.c*it.qty, f:a.f+it.f*it.qty}), {cal:0,p:0,c:0,f:0});
          return (
            <div key={mi} style={sty.card}>
              <div style={{ ...sty.row, marginBottom:8 }}>
                <div style={{ fontFamily:FD, fontSize:15, fontWeight:600 }}>{meal.name}</div>
                <span style={sty.tag(C.accent)}>{Math.round(mt.cal)} kcal</span>
              </div>
              {meal.items.map((it, ii) => (
                <div key={ii} style={{ padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={sty.row}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{it.name}</div>
                      <div style={{ fontSize:10, color:C.sub }}>{it.qty === 1 ? (cl.qtyMode==="raw"?it.raw:it.cooked) : `${it.qty} × ${cl.qtyMode==="raw"?it.raw:it.cooked}`}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, fontSize:10, color:C.muted }}>
                      <span><b style={{color:C.text}}>{Math.round(it.cal*it.qty)}</b>cal</span>
                      <span><b style={{color:C.blue}}>{Math.round(it.p*it.qty)}g</b>P</span>
                      <span><b style={{color:C.orange}}>{Math.round(it.c*it.qty)}g</b>C</span>
                      <span><b style={{color:C.red}}>{Math.round(it.f*it.qty)}g</b>F</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:5, marginTop:5 }}>
                    <button style={{...sty.chip(false),padding:"2px 10px",fontSize:13,fontWeight:700}} onClick={() => adjustQty(mi,ii,-0.25)}>−</button>
                    <span style={{ fontSize:12, fontWeight:700, color:C.accent, minWidth:30, textAlign:"center", lineHeight:"24px" }}>{it.qty}</span>
                    <button style={{...sty.chip(false),padding:"2px 10px",fontSize:13,fontWeight:700}} onClick={() => adjustQty(mi,ii,0.25)}>+</button>
                    <button style={{...sty.chip(false),padding:"2px 8px",fontSize:10}} onClick={() => swapItem(mi,ii)}>🔄</button>
                    <button style={{...sty.chip(false),padding:"2px 8px",fontSize:10,borderColor:C.red,color:C.red}} onClick={() => removeItem(mi,ii)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <div style={{ fontSize:9, color:C.muted, textAlign:"center", padding:12 }}>Generated {new Date(currentPlan.generatedAt).toLocaleDateString("en-IN")} · {cl.qtyMode.toUpperCase()} quantities</div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: WEEKLY CHECK-IN FORM
  // ═══════════════════════════════════════════════════════
  if (screen === "checkin_form" && activeClient) {
    return (
      <div style={sty.page}>
        <Logo sub={`${activeClient.name} — Weekly Check-In`} />
        <Nav items={[["← Back", () => openClient(activeClient.id)]]} />

        <div style={sty.card}>
          <div style={sty.sec}>📋 Measurements</div>
          <Inp label="Date" k="date" obj={ciForm} set={uci} type="date" />
          <div style={sty.g2}>
            <Inp label="Weight (kg)" k="weight" obj={ciForm} set={uci} type="number" ph="80.5" />
            <Inp label="Body Fat %" k="bodyFat" obj={ciForm} set={uci} type="number" ph="22" />
          </div>
          <div style={sty.g3}>
            <Inp label="Chest (in)" k="chest" obj={ciForm} set={uci} type="number" ph="40" />
            <Inp label="Waist (in)" k="waist" obj={ciForm} set={uci} type="number" ph="33" />
            <Inp label="Hip (in)" k="hip" obj={ciForm} set={uci} type="number" ph="38" />
          </div>
          <div style={sty.g2}>
            <Inp label="Arm (in)" k="arm" obj={ciForm} set={uci} type="number" ph="14" />
            <Inp label="Thigh (in)" k="thigh" obj={ciForm} set={uci} type="number" ph="22" />
          </div>
          <Inp label="Coach Notes" k="note" obj={ciForm} set={uci} ph="Followed plan well, increased water..." />
        </div>

        <button style={{ ...sty.btn(), width:"100%", opacity: ciForm.weight ? 1 : 0.4 }} disabled={!ciForm.weight} onClick={saveCheckin}>
          Save Check-In →
        </button>

        {/* Previous check-ins */}
        {checkins.length > 0 && <div style={{ ...sty.card, marginTop:14 }}>
          <div style={sty.sec}>📜 History ({checkins.length} entries)</div>
          {[...checkins].reverse().slice(0, 8).map(ci => (
            <div key={ci.id} style={{ ...sty.row, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>{ci.date}</div>
                <div style={{ fontSize:10, color:C.sub }}>{ci.weight}kg · W:{ci.waist}" · C:{ci.chest}"</div>
              </div>
              <button style={sty.btnO(C.red)} onClick={() => deleteCheckin(ci.id)}>✕</button>
            </div>
          ))}
        </div>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SCREEN: PROGRESS DASHBOARD
  // ═══════════════════════════════════════════════════════
  if (screen === "dashboard" && activeClient && checkins.length > 0) {
    const cl = activeClient;
    const data = checkins.map(ci => ({
      date: ci.date.slice(5), // MM-DD
      weight: +ci.weight || null,
      waist: +ci.waist || null,
      chest: +ci.chest || null,
      hip: +ci.hip || null,
      arm: +ci.arm || null,
      thigh: +ci.thigh || null,
      bodyFat: +ci.bodyFat || null,
    })).filter(d => d.weight);

    const first = data[0];
    const last = data[data.length - 1];
    const delta = (key) => first[key] && last[key] ? (last[key] - first[key]).toFixed(1) : "—";
    const deltaColor = (key) => {
      const d = first[key] && last[key] ? last[key] - first[key] : 0;
      if (cl.goal === "muscle_gain") return d > 0 ? C.green : d < 0 ? C.red : C.sub;
      return d < 0 ? C.green : d > 0 ? C.red : C.sub;
    };

    const StatCard = ({ label, val, diff, color }) => (
      <div style={{ background:C.surface, borderRadius:10, padding:12, textAlign:"center" }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:1 }}>{label}</div>
        <div style={{ fontSize:20, fontWeight:800, color:C.text }}>{val}</div>
        {diff !== "—" && <div style={{ fontSize:11, fontWeight:700, color }}>{+diff > 0 ? "+" : ""}{diff}</div>}
      </div>
    );

    return (
      <div style={sty.page}>
        <Logo sub={`${cl.name} — Progress Dashboard`} />
        <Nav items={[["← Back", () => openClient(cl.id)], ["+ Check-In", () => { setCiForm({ date: new Date().toISOString().split("T")[0], weight:"",chest:"",waist:"",hip:"",arm:"",thigh:"",bodyFat:"",note:"" }); setScreen("checkin_form"); }]]} />

        {/* Summary Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, marginBottom:12 }}>
          <StatCard label="WEIGHT" val={`${last.weight}kg`} diff={delta("weight")} color={deltaColor("weight")} />
          <StatCard label="WAIST" val={`${last.waist || "—"}"`} diff={delta("waist")} color={deltaColor("waist")} />
          <StatCard label="BODY FAT" val={`${last.bodyFat || "—"}%`} diff={delta("bodyFat")} color={deltaColor("bodyFat")} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:12 }}>
          <StatCard label="CHEST" val={`${last.chest||"—"}"`} diff={delta("chest")} color={deltaColor("chest")} />
          <StatCard label="HIP" val={`${last.hip||"—"}"`} diff={delta("hip")} color={deltaColor("hip")} />
          <StatCard label="ARM" val={`${last.arm||"—"}"`} diff={delta("arm")} color={deltaColor("arm")} />
          <StatCard label="THIGH" val={`${last.thigh||"—"}"`} diff={delta("thigh")} color={deltaColor("thigh")} />
        </div>

        {/* Weight Chart */}
        <div style={sty.card}>
          <div style={sty.sec}>⚖️ Weight Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" stroke={C.muted} fontSize={10} />
              <YAxis stroke={C.muted} fontSize={10} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:FN, fontSize:12 }} />
              <Line type="monotone" dataKey="weight" stroke={C.accent} strokeWidth={2.5} dot={{ fill:C.accent, r:4 }} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inches Chart */}
        <div style={sty.card}>
          <div style={sty.sec}>📏 Inch Loss Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" stroke={C.muted} fontSize={10} />
              <YAxis stroke={C.muted} fontSize={10} />
              <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:FN, fontSize:12 }} />
              <Legend wrapperStyle={{ fontSize:10 }} />
              <Line type="monotone" dataKey="waist" stroke={C.red} strokeWidth={2} dot={{ r:3 }} name="Waist" />
              <Line type="monotone" dataKey="chest" stroke={C.blue} strokeWidth={2} dot={{ r:3 }} name="Chest" />
              <Line type="monotone" dataKey="hip" stroke={C.orange} strokeWidth={2} dot={{ r:3 }} name="Hip" />
              <Line type="monotone" dataKey="arm" stroke={C.purple} strokeWidth={2} dot={{ r:3 }} name="Arm" />
              <Line type="monotone" dataKey="thigh" stroke={C.green} strokeWidth={2} dot={{ r:3 }} name="Thigh" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Body Fat Chart (if data exists) */}
        {data.some(d => d.bodyFat) && <div style={sty.card}>
          <div style={sty.sec}>🔥 Body Fat %</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.filter(d => d.bodyFat)}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" stroke={C.muted} fontSize={10} />
              <YAxis stroke={C.muted} fontSize={10} />
              <Tooltip contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:FN, fontSize:12 }} />
              <Bar dataKey="bodyFat" fill={C.orange} radius={[6,6,0,0]} name="Body Fat %" />
            </BarChart>
          </ResponsiveContainer>
        </div>}

        {/* Check-in History Table */}
        <div style={sty.card}>
          <div style={sty.sec}>📜 All Check-Ins</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ color:C.muted, textAlign:"left" }}>
                  {["Date","Wt(kg)","Chest","Waist","Hip","Arm","Thigh","BF%","Notes"].map(h => <th key={h} style={{ padding:"6px 4px", borderBottom:`1px solid ${C.border}`, fontSize:9, letterSpacing:1 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...checkins].reverse().map(ci => (
                  <tr key={ci.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"6px 4px", fontWeight:600 }}>{ci.date}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.weight}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.chest||"—"}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.waist||"—"}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.hip||"—"}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.arm||"—"}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.thigh||"—"}</td>
                    <td style={{ padding:"6px 4px" }}>{ci.bodyFat||"—"}</td>
                    <td style={{ padding:"6px 4px", color:C.sub, maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ci.note||""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ fontSize:9, color:C.muted, textAlign:"center", padding:12 }}>SHAPE — The Inch Loss Secret · {checkins.length} check-ins tracked</div>
      </div>
    );
  }

  // Fallback
  return <div style={sty.page}><Logo sub="Loading..." /><button style={sty.btn()} onClick={() => setScreen("roster")}>Go to Roster</button></div>;
}
