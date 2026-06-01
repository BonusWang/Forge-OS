import React from 'react';

type OrbitKpiTone = 'orange' | 'green' | 'yellow' | 'red' | 'muted';

interface OrbitKpi {
  label: string;
  value: string | number;
  detail?: string;
  tone?: OrbitKpiTone;
}

interface OrbitPageHeaderProps {
  eyebrow: string;
  title: string;
  summary?: string;
  kpis: OrbitKpi[];
}

const OrbitPageHeader: React.FC<OrbitPageHeaderProps> = ({
  eyebrow,
  title,
  summary,
  kpis,
}) => {
  return (
    <section className="orbit-page-header">
      <div className="orbit-page-copy">
        <div className="orbit-eyebrow">{eyebrow}</div>
        <h1 className="orbit-page-title">{title}</h1>
        {summary && <p className="orbit-page-summary">{summary}</p>}
      </div>

      <div className="orbit-kpi-strip" aria-label={`${title} 状态摘要`}>
        {kpis.map((kpi) => (
          <div className="orbit-kpi-card" data-tone={kpi.tone ?? 'muted'} key={kpi.label}>
            <div className="orbit-kpi-label">{kpi.label}</div>
            <div className="orbit-kpi-value">{kpi.value}</div>
            {kpi.detail && <div className="orbit-kpi-detail">{kpi.detail}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrbitPageHeader;
