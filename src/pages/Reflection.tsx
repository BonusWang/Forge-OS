import React, { useState } from 'react';
import ReflectionGrid from '../features/reflections/ReflectionGrid';
import ReflectionDetailModal from '../features/reflections/ReflectionDetailModal';
import OKRPanel from '../features/okr/OKRPanel';
import AbilityReader from '../features/abilities/AbilityReader';
import AbilityTraining from '../features/abilities/AbilityTraining';
import AsciiBox from '../components/AsciiBox';
import OrbitPageHeader from '../components/OrbitPageHeader';
import { useAppStore } from '../store/useAppStore';
import type { Reflection } from '../types';

interface ReflectionPageProps {
  visualStyle?: 'classic' | 'orbit';
}

const ReflectionPage: React.FC<ReflectionPageProps> = ({ visualStyle = 'classic' }) => {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const abilities = useAppStore((s) => s.abilities);
  const objectives = useAppStore((s) => s.objectives);
  const reflections = useAppStore((s) => s.reflections);
  const isOrbitStyle = visualStyle === 'orbit';
  const keyResults = objectives.flatMap((objective) => objective.keyResults);
  const completedKeyResults = keyResults.filter((kr) => kr.completed).length;

  return (
    <div className={isOrbitStyle ? 'orbit-page reflection-page' : ''}>
      {isOrbitStyle && (
        <OrbitPageHeader
          eyebrow="Review system"
          title="反思与能力面板"
          kpis={[
            {
              label: '反思总数',
              value: reflections.length,
              detail: '全部历史记录',
              tone: 'orange',
            },
            {
              label: '目标数量',
              value: objectives.length,
              detail: `${completedKeyResults}/${keyResults.length} 个 KR 完成`,
              tone: completedKeyResults > 0 ? 'green' : 'muted',
            },
            {
              label: '能力项目',
              value: abilities.length,
              detail: '阅读与训练共用',
              tone: 'yellow',
            },
            {
              label: '当前选择',
              value: selectedReflection ? '1' : '0',
              detail: '详情弹层沿用原逻辑',
              tone: 'muted',
            },
          ]}
        />
      )}

      <div className={isOrbitStyle ? 'orbit-content-section' : ''}>
        <OKRPanel />
      </div>

      <div
        className="reflection-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-8)',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          alignItems: 'start',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <AsciiBox title="反思库">
            <ReflectionGrid onViewDetail={setSelectedReflection} />
          </AsciiBox>
        </div>

        <div style={{ minWidth: 0 }}>
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
