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

  return (
    <div
      className="module-picker-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '64px',
      }}
    >
      <div
        className="module-picker-panel"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-5)',
          minWidth: '320px',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            paddingBottom: 'var(--space-3)',
          }}
        >
          <span
            className="font-h2"
            style={{ color: 'var(--accent-gold)' }}
          >
            [ 模块管理 ]
          </span>
          <button
            onClick={onClose}
            className="font-h2"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            [✕]
          </button>
        </div>

        <div className="module-picker-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {modules.map((mod) => {
            const isEnabled = enabledModules.includes(mod.id as ModuleId);
            return (
              <div
                key={mod.id}
                className="module-picker-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid transparent',
                  transition: 'border-color var(--duration-instant) var(--ease-instant)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <span
                  className="font-mono-data"
                  style={{
                    color: isEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    minWidth: '32px',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  {mod.icon}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="font-body"
                    style={{
                      color: isEnabled ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {mod.name}
                  </div>
                  <div
                    className="font-caption"
                    style={{
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                    }}
                  >
                    {mod.description}
                  </div>
                </div>

                <button
                  onClick={() => toggleModule(mod.id as ModuleId)}
                  className="font-h2"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isEnabled ? 'var(--accent-success)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    padding: 'var(--space-1)',
                    transition: `color var(--duration-instant) var(--ease-instant)`,
                    userSelect: 'none',
                  }}
                  title={isEnabled ? '点击隐藏' : '点击显示'}
                >
                  {isEnabled ? '[●]' : '[○]'}
                </button>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--border-primary)',
            textAlign: 'center',
          }}
        >
          <span className="font-caption" style={{ color: 'var(--text-secondary)' }}>
            启用的模块: {enabledModules.length} / {modules.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModulePicker;
