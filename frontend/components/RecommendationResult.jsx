import { useTranslation } from 'react-i18next';

const priorityColor = {
  PRIMARY: { bg: 'rgba(74,140,63,0.15)', border: 'rgba(74,140,63,0.35)', text: 'var(--green-300)' },
  SECONDARY: { bg: 'rgba(212,168,67,0.1)', border: 'rgba(212,168,67,0.3)', text: 'var(--accent-yellow)' },
  OPTIONAL: { bg: 'rgba(90,155,196,0.1)', border: 'rgba(90,155,196,0.3)', text: 'var(--accent-blue)' },
};

function NPKChips({ n, p, k }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {n !== undefined && <span className="npk-chip npk-n">N {n}%</span>}
      {p !== undefined && <span className="npk-chip npk-p">P {p}%</span>}
      {k !== undefined && <span className="npk-chip npk-k">K {k}%</span>}
    </div>
  );
}

export default function RecommendationResult({ result, onReset }) {
  const { t } = useTranslation();

  if (!result) return null;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', animation: 'slideUp 0.5s ease' }}>
      {/* Result header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2d, #1e3a1e)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 32px 28px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--green-300)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Your Growing Plan
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#fff', marginBottom: 8 }}>
              {result.cropName} 🌱
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, maxWidth: 500 }}>
              {result.generalTips}
            </p>
          </div>
          <button className="btn btn-outline" onClick={onReset} style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 13 }}>
            {t('btn.new_search')}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { label: '⏱ Harvest', value: result.harvestTime },
            { label: '💧 Watering', value: result.wateringSchedule?.split('.')[0] },
            { label: '☀️ Sunlight', value: result.sunlightNeeds },
          ].map(({ label, value }) => value && (
            <div key={label} style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              fontSize: 13,
              color: 'rgba(255,255,255,0.85)',
            }}>
              {label}: <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Quick info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 20, marginBottom: 10 }}>💧</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
            {t('result.watering')}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{result.wateringSchedule}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: 20, marginBottom: 10 }}>🌱</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
            {t('result.soil_prep')}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{result.soilPreparation}</p>
        </div>
      </div>

      {/* Fertilizer Schedule */}
      {result.fertilizers?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6 }}>
            {t('result.fertilizers')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
            Tap any fertilizer to see full details. Apply in the order listed below.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {result.fertilizers.map((fert, i) => {
              const colors = priorityColor[fert.priority] || priorityColor.OPTIONAL;
              return (
                <div key={i} style={{
                  background: 'var(--bg-card)',
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 22px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
                    background: colors.text,
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                          {fert.fertilizerName}
                        </span>
                        <span style={{
                          padding: '2px 10px', borderRadius: 10,
                          background: colors.bg, color: colors.text,
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {fert.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{fert.type}</div>
                      <NPKChips n={fert.nitrogenPct} p={fert.phosphorusPct} k={fert.potassiumPct} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 13 }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 3, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Purpose</span>
                      <span style={{ color: 'var(--text-primary)' }}>{fert.purpose}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 3, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dosage</span>
                      <span style={{ color: 'var(--text-primary)' }}>{fert.dosage}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 3, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>When to apply</span>
                      <span style={{ color: 'var(--text-primary)' }}>{fert.timing}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Care Tips + Common Mistakes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        {result.careTips?.length > 0 && (
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💡</span> {t('result.care_tips')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.careTips.map((tip, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--green-400)', fontWeight: 700, marginTop: 1 }}>✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.commonMistakes?.length > 0 && (
          <div className="card" style={{ borderColor: 'rgba(201,87,87,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span> {t('result.mistakes')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.commonMistakes.map((m, i) => (
                <li key={i} style={{
                  display: 'flex', gap: 10, fontSize: 13,
                  color: 'var(--text-secondary)', lineHeight: 1.6,
                  paddingLeft: 12,
                  borderLeft: '3px solid var(--accent-red)',
                }}>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="btn btn-primary btn-full" onClick={onReset} style={{ height: 52, fontSize: 16 }}>
        🌱 Advise Me on Another Crop
      </button>
    </div>
  );
}
