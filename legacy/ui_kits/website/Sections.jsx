function FarolServices() {
  const { Card, Badge } = window.FarolDevDesignSystem_199cc2;
  const services = [
    { title: 'Lorem ipsum dolor', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', tag: 'Lorem' },
    { title: 'Sed do eiusmod', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore.', tag: 'Ipsum' },
    { title: 'Ut enim ad minim', desc: 'Ut enim ad minim veniam, quis nostrud exercitation.', tag: 'Dolor' },
  ];
  return (
    <section id="Soluções" className="farol-section" style={{ background: 'var(--color-black)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', margin: '0 0 40px' }}>Soluções</h2>
      <div className="farol-services-grid">
        {services.map((s) => (
          <Card key={s.title}>
            <Badge color="coral" style={{ marginBottom: '14px' }}>{s.tag}</Badge>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', margin: '0 0 8px' }}>{s.title}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>{s.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FarolCases() {
  const { Card } = window.FarolDevDesignSystem_199cc2;
  return (
    <section id="Cases" className="farol-section" style={{ background: 'var(--surface-raised)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', margin: '0 0 40px' }}>Cases</h2>
      <div className="farol-cases-grid">
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-success)', margin: '0 0 10px' }}>Lorem ipsum</p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', margin: '0 0 8px' }}>Lorem ipsum dolor sit</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        </Card>
        <Card>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-blue)', margin: '0 0 10px' }}>Lorem ipsum</p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', margin: '0 0 8px' }}>Consectetur adipiscing elit</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</p>
        </Card>
      </div>
    </section>
  );
}

function FarolAbout() {
  const pillars = [
    { color: 'var(--color-coral)', label: 'Propósito', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { color: 'var(--color-purple)', label: 'Abordagem', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore.' },
    { color: 'var(--color-teal)', label: 'Entrega', desc: 'Ut enim ad minim veniam, quis nostrud exercitation.' },
  ];
  return (
    <section id="Sobre" className="farol-section" style={{ background: 'var(--color-black)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', margin: '0 0 40px' }}>Sobre</h2>
      <div className="farol-about-grid">
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: '0 0 20px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </p>
        </div>
        <div
          style={{
            width: '100%', height: '260px', borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-default)', background: 'var(--surface-raised)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)',
          }}
        >
          img
        </div>
      </div>
      <div className="farol-about-pillars">
        {pillars.map((p) => (
          <div key={p.label} style={{ display: 'flex', gap: '14px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: p.color, marginTop: '4px', flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: '#fff', margin: '0 0 8px' }}>{p.label}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', margin: 0 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.FarolServices = FarolServices;
window.FarolCases = FarolCases;
window.FarolAbout = FarolAbout;
