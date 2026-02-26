type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 className="h1">{title}</h1>
            {subtitle ? <p className="p">{subtitle}</p> : null}
          </div>
          {actions ? <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div> : null}
        </div>
      </div>
      <div className="cardBody" />
    </div>
  );
}
