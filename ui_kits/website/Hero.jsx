/* Full-bleed light-beam hero device — the brand's signature background motif
   (coral -> lilás -> azul beam flaring from a point), matching the brandbook's
   presentation-cover and site-hero mockups. */
function FarolBeam({ style }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
      <div style={{
        position: 'absolute', top: '46%', left: '20%', width: '140%', height: '3px',
        background: 'linear-gradient(90deg, transparent 0%, var(--color-coral) 30%, var(--color-purple) 55%, var(--color-blue) 78%, transparent 100%)',
        transform: 'translateY(-50%) rotate(-4deg)', filter: 'blur(1.5px)',
      }} />
      <div style={{
        position: 'absolute', top: '46%', left: '58%', width: '340px', height: '340px',
        transform: 'translate(-50%,-50%)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,87,0.55) 0%, rgba(138,92,255,0.28) 42%, transparent 72%)',
        filter: 'blur(14px)',
      }} />
    </div>
  );
}

function FarolHero({ onCTA }) {
  return (
    <section style={{ position: 'relative', background: 'var(--color-black)', padding: '120px 40px 100px', overflow: 'hidden' }}>
      <FarolBeam />
      <div style={{ position: 'relative', maxWidth: '680px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '18px',
        }}>Software Studio</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '52px', lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)', color: '#fff', margin: '0 0 22px',
        }}>
          <span style={{ fontStyle: 'italic' }}>Construímos produtos digitais que</span> <span style={{ color: 'var(--color-coral)' }}>resolvem</span> <span style={{ fontStyle: 'italic' }}>problemas reais.</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: '0 0 36px', maxWidth: '520px' }}>
          Código com direção. A luz que tira produtos da ideia e coloca no mundo.
        </p>
        <button
          onClick={onCTA}
          style={{
            background: 'var(--color-coral)', color: '#0F1115', border: 'none',
            borderRadius: 'var(--radius-full)', padding: '14px 28px', fontWeight: 600,
            fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer',
          }}
        >
          Falar com a gente
        </button>
      </div>
    </section>
  );
}

window.FarolHero = FarolHero;
window.FarolBeam = FarolBeam;
