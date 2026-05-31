import React, { useState } from 'react';
import ReflectionGrid from '../features/reflections/ReflectionGrid';
import ReflectionDetailModal from '../features/reflections/ReflectionDetailModal';
import OKRPanel from '../features/okr/OKRPanel';
import AbilityReader from '../features/abilities/AbilityReader';
import AbilityTraining from '../features/abilities/AbilityTraining';
import AsciiBox from '../components/AsciiBox';
import type { Reflection } from '../types';

const ReflectionPage: React.FC = () => {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  return (
    <div>
      <OKRPanel />

      <div
        className="reflection-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-8)',
          maxWidth: '1400px',
        }}
      >
        <div>
          <AsciiBox title="REFLECTION LIBRARY">
            <ReflectionGrid onViewDetail={setSelectedReflection} />
          </AsciiBox>
        </div>

        <div>
          <AbilityReader />
          <AbilityTraining />
        </div>
      </div>

      <ReflectionDetailModal
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};

export default ReflectionPage;
