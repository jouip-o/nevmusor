import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { count: number; dropped_on: string };

const MONTHS = {
  ru: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function BatteryStats({ userId, ru }: { userId: string; ru: boolean }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = () =>
    supabase.from("dropoffs").select("count, dropped_on").eq("user_id", userId).order("dropped_on")
      .then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, [userId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(count, 10);
    if (!n || n < 1 || n > 10000) return setErr(ru ? "Введите число от 1 до 10000" : "Enter a number from 1 to 10000");
    setBusy(true); setErr("");
    const { error } = await supabase.from("dropoffs").insert({ user_id: userId, count: n, dropped_on: date });
    setBusy(false);
    if (error) return setErr(error.message);
    setCount("");
    load();
  };

  // last 12 months
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: MONTHS[ru ? "ru" : "en"][d.getMonth()] };
  });
  const totals = months.map((m) => rows.filter((r) => r.dropped_on.startsWith(m.key)).reduce((s, r) => s + r.count, 0));
  const total = rows.reduce((s, r) => s + r.count, 0);
  const max = Math.max(5, ...totals);

  const W = 600, H = 220, L = 36, R = 12, T = 14, B = 30;
  const x = (i: number) => L + (i * (W - L - R)) / 11;
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const path = totals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const ticks = [0, Math.round(max / 2), max];

  return (
    <div className="acc-stats">
      <h2>{ru ? "Мои батарейки" : "My batteries"}</h2>
      <p className="acc-total"><strong>{total}</strong> {ru ? "сдано всего" : "dropped off in total"}</p>
      <form className="acc-form acc-drop" onSubmit={add}>
        <label>
          {ru ? "Сколько батареек сдали" : "Batteries dropped off"}
          <input type="number" min={1} max={10000} inputMode="numeric" required value={count} onChange={(e) => setCount(e.target.value)} placeholder="10" />
        </label>
        <label>
          {ru ? "Дата" : "Date"}
          <input type="date" required value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{ru ? "Добавить" : "Add"}</button>
      </form>
      {err ? <p className="acc-err">{err}</p> : null}
      <svg className="acc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ru ? "Батарейки по месяцам" : "Batteries per month"}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="currentColor" opacity=".15" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="currentColor">{t}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {totals.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="4" fill="#dbee75" stroke="currentColor" strokeWidth="2"><title>{`${months[i].label}: ${v}`}</title></circle>
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="currentColor">{months[i].label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
