import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fertilizerAPI, cropAPI } from '../services/api';

function NPKChip({ label, value, type }) {
  const colors = { n: 'npk-n', p: 'npk-p', k: 'npk-k' };
  return (
    <span className={`npk-chip ${colors[type]}`}>
      {label} {value}%
    </span>
  );
}

function FertilizerCard({ fertilizer, selected, onClick }) {
  return (
    <div
      onClick={() => onClick(fertilizer)}
      style={{
        background: selected ? 'rgba(74,140,63,0.1)' : 'var(--bg-card)',
        border: `1.5px solid ${selected ? 'var(--green-500)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
        {fertilizer.name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
        {fertilizer.type}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {fertilizer.nitrogenPct !== undefined && <NPKChip label="N" value={fertilizer.nitrogenPct} type="n" />}
        {fertilizer.phosphorusPct !== undefined && <NPKChip label="P" value={fertilizer.phosphorusPct} type="p" />}
        {fertilizer.potassiumPct !== undefined && <NPKChip label="K" value={fertilizer.potassiumPct} type="k" />}
      </div>
    </div>
  );
}

function FertilizerDetail({ fertilizer }) {
  if (!fertilizer) return null;

  const riskItems = fertilizer.avoidFor?.split(';') || [];

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2d, #1e3a1e)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>
          {fertilizer.name}
        </div>
        <div style={{ color: 'var(--green-200)', fontSize: 13, marginBottom: 14 }}>
          {fertilizer.type} · NPK: {fertilizer.nitrogenPct}% N, {fertilizer.phosphorusPct}% P, {fertilizer.potassiumPct}% K
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <NPKChip label="N" value={fertilizer.nitrogenPct} type="n" />
          <NPKChip label="P" value={fertilizer.phosphorusPct} type="p" />
          <NPKChip label="K" value={fertilizer.potassiumPct} type="k" />
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { label: 'How it works', value: fertilizer.howItWorks, icon: '🔬' },
          { label: 'Best soil', value: fertilizer.bestSoil, icon: '🌍' },
          { label: 'Optimal pH', value: fertilizer.optimalPh, icon: '⚗️', badge: true },
          { label: 'Dosage', value: fertilizer.dosageInstruction, icon: '⚖️' },
          { label: 'Timing', value: fertilizer.timing, icon: '📅' },
          { label: 'Storage', value: fertilizer.storageInstruction, icon: '📦' },
          { label: 'Cost level', value: fertilizer.costLevel, icon: '💰', accent: true },
        ].map(({ label, value, icon, badge, accent }) => (
          <div key={label} style={{
            display: 'flex', gap: 20, padding: '14px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: 14,
          }}>
            <span style={{ minWidth: 130, color: 'var(--text-muted)', fontWeight: 500 }}>{icon} {label}</span>
            <span style={{
              color: accent ? 'var(--accent-yellow)' : badge ? 'var(--accent-blue)' : 'var(--text-secondary)',
              lineHeight: 1.6, flex: 1
            }}>
              {value || '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Best for crops */}
      {fertilizer.bestForCrops && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            BEST FOR CROPS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {fertilizer.bestForCrops.split(',').map(crop => (
              <span key={crop} className="badge badge-green" style={{ fontSize: 12 }}>
                {crop.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Avoid for */}
      {fertilizer.avoidFor && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            AVOID FOR
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {fertilizer.avoidFor.split(';').map(item => (
              <span key={item} className="badge badge-red" style={{ fontSize: 12 }}>
                {item.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Side effects */}
      {fertilizer.avoidFor && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            ⚠ SIDE EFFECTS & RISKS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              fertilizer.avoidFor,
              ...(fertilizer.type?.includes('Synthetic') ? ['Overuse can cause soil acidification over time', 'Risk of nutrient runoff in heavy rainfall'] : []),
              ...(fertilizer.type?.includes('Organic') ? ['Slow-release — not suitable for emergency correction', 'Variable NPK content depending on source'] : []),
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(201,87,87,0.06)',
                borderLeft: '3px solid var(--accent-red)',
                borderRadius: '0 8px 8px 0',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}>{item}</div>
            ))}
          </div>
        </div>
      )}

      {/* Environmental impact */}
      {fertilizer.environmentalImpact && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            ENVIRONMENTAL IMPACT
          </div>
          <div style={{
            padding: '14px 18px',
            background: 'rgba(74,140,63,0.06)',
            borderLeft: '3px solid var(--green-500)',
            borderRadius: '0 8px 8px 0',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            {fertilizer.environmentalImpact}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchPage() {
  const { t } = useTranslation();
  const [fertilizers, setFertilizers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFert, setSelectedFert] = useState(null);
  const [activeTab, setActiveTab] = useState('fertilizers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fertilizerAPI.getAll(),
      cropAPI.getAll(),
    ]).then(([f, c]) => {
      setFertilizers(f.data);
      setCrops(c.data);
      if (f.data.length > 0) setSelectedFert(f.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'fertilizers', label: t('research.fertilizers') },
    { id: 'crops', label: t('research.crops') },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2d, #1e3a1e)',
        padding: '40px 20px 32px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 28 }}>🌾</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#fff' }}>
              {t('research.title')}
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 20, fontSize: 15 }}>
            {t('research.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              `${fertilizers.length} Fertilizer Types`,
              `${crops.length}+ Crops`,
              '6 Soil Types',
              '5 Climate Zones',
            ].map(b => (
              <span key={b} style={{
                padding: '5px 14px', background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20,
                fontSize: 12, color: 'rgba(255,255,255,0.85)',
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px 48px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 4,
          marginTop: 24,
          marginBottom: 28,
          width: 'fit-content',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                border: 'none',
                background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: 36, height: 36 }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading research data...</p>
          </div>
        ) : activeTab === 'fertilizers' ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
              {t('research.tap_to_see')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
              {fertilizers.map(f => (
                <FertilizerCard
                  key={f.id}
                  fertilizer={f}
                  selected={selectedFert?.id === f.id}
                  onClick={setSelectedFert}
                />
              ))}
            </div>

            {selectedFert && <FertilizerDetail fertilizer={selectedFert} />}
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
              All crops available in the advisor system. Difficulty and season info included.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {crops.map(crop => (
                <div key={crop.id} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{crop.iconEmoji || '🌿'}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{crop.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{crop.category}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>⏱ {crop.daysToHarvest} days</div>
                    <div style={{ color: 'var(--text-secondary)' }}>☀️ {crop.sunlightRequirement}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>📅 {crop.growingSeason}</div>
                  </div>
                  <span style={{
                    display: 'inline-block', marginTop: 12, padding: '3px 12px',
                    borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: crop.difficultyLevel === 'BEGINNER' ? 'rgba(74,140,63,0.15)' : 'rgba(212,168,67,0.12)',
                    color: crop.difficultyLevel === 'BEGINNER' ? 'var(--green-300)' : 'var(--accent-yellow)',
                  }}>{crop.difficultyLevel}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
