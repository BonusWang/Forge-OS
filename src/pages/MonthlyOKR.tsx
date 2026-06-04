import React from 'react';
import OKRPanel from '../features/okr/OKRPanel';

const MonthlyOKR: React.FC = () => {
  return (
    <div className="workspace-page monthly-okr-page">
      <section className="workspace-section monthly-okr-section" aria-label="月度 OKR">
        <OKRPanel />
      </section>
    </div>
  );
};

export default MonthlyOKR;
