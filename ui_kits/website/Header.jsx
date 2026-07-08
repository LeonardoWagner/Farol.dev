function FarolHeader({ active, onNavigate, onCTA }) {
  const { IconButton } = window.FarolDevDesignSystem_199cc2;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const items = ['Soluções', 'Cases', 'Sobre', 'Contato'];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);
    item === 'Contato' ? (onCTA && onCTA()) : (onNavigate && onNavigate(item));
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px', position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(15,17,21,0.85)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="../../assets/logo/farol-icon.png" alt="Farol.dev" style={{ height: '30px', width: '30px', objectFit: 'contain', borderRadius: '7px' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#fff' }}>
          Farol<span style={{ color: 'var(--color-coral)' }}>.dev</span>
        </span>
      </div>
      <nav className={`farol-header__nav${menuOpen ? ' is-open' : ''}`}>
        {items.map((item) => (
          <a
            key={item}
            onClick={(e) => handleNavClick(e, item)}
            href={item === 'Contato' ? undefined : `#${item}`}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
              color: active === item ? '#fff' : 'var(--text-secondary)',
              textDecoration: 'none', cursor: 'pointer',
              transition: 'color var(--duration-fast) var(--ease-standard)',
            }}
          >
            {item}
          </a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onCTA}
          className="farol-header__cta"
          style={{
            background: 'var(--color-coral)', color: '#0F1115', border: 'none',
            borderRadius: 'var(--radius-full)', padding: '9px 20px', fontWeight: 600,
            fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer',
          }}
        >
          Falar com a gente
        </button>
        <button
          className="farol-header__toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          style={{ fontSize: '22px' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}

window.FarolHeader = FarolHeader;
