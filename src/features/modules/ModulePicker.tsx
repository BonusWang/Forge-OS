import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getAllModules } from './moduleRegistry';
import type { ModuleId } from '../../types';

interface ModulePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModulePicker: React.FC<ModulePickerProps> = ({ isOpen, onClose }) => {
  const enabledModules = useAppStore((s) => s.enabledModules);
  const toggleModule = useAppStore((s) => s.toggleModule);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modules = getAllModules();
  const enabledCount = enabledModules.length;

  return (
    <div
      className="module-picker-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        className="module-picker-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-picker-title"
      >
        <div className="module-picker-header">
          <div>
            <div className="font-h2 module-picker-title" id="module-picker-title">
              模块管理
            </div>
            <div className="font-caption module-picker-count">
              已启用 {enabledCount} / {modules.length}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="module-picker-close"
            aria-label="关闭模块管理"
          >
            ×
          </button>
        </div>

        <div className="module-picker-list">
          {modules.map((mod) => {
            const isEnabled = enabledModules.includes(mod.id as ModuleId);
            const zoneLabel = mod.defaultZone === 'main' ? '主区' : '侧栏';
            return (
              <button
                type="button"
                key={mod.id}
                className={`module-picker-row${isEnabled ? ' is-enabled' : ''}`}
                aria-pressed={isEnabled}
                onClick={() => toggleModule(mod.id as ModuleId)}
              >
                <span className="module-picker-icon" aria-hidden="true">
                  {mod.icon}
                </span>

                <span className="module-picker-copy">
                  <span className="font-body module-picker-name">
                    {mod.name}
                  </span>
                  <span className="font-caption module-picker-description">
                    {mod.description}
                  </span>
                </span>

                <span className="module-picker-meta">
                  <span className="module-picker-zone">{zoneLabel}</span>
                  <span className="module-picker-state">{isEnabled ? '启用' : '隐藏'}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="module-picker-footer">
          <div className="module-picker-meter" aria-hidden="true">
            <span style={{ width: `${(enabledCount / modules.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePicker;
