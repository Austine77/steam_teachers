type Kpi = { label: string; value: string; hint?: string };

export default function StatKpis({ items }: { items: Kpi[] }) {
  return (
    <div className="kpiRow">
      {items.map((k) => (
        <div key={k.label} className="kpi">
          <div className="kpiLabel">{k.label}</div>
          <div className="kpiValue">{k.value}</div>
          {k.hint ? <div className="small" style={{ marginTop: 6 }}>{k.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}
