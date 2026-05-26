const STATS = [
  { label: "Utenti totali", value: "1,284", delta: "+12%" },
  { label: "Sessioni oggi", value: "342", delta: "+5%" },
  { label: "Errori", value: "3", delta: "-80%" },
];

export default function Cards() {
  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 14, textTransform: "uppercase", color: "#888" }}>Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, padding: "20px 24px" }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.delta.startsWith("+") ? "#4ade80" : "#f87171", marginTop: 6 }}>{s.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}