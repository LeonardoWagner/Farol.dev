function FarolFooter() {
  return (
    <footer className="farol-footer" style={{
      padding: '48px 40px', borderTop: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '13px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="../../assets/logo/farol-icon.png" alt="" style={{ height: '20px', width: '20px', borderRadius: '5px' }} />
        <span>farol.dev — Software Studio</span>
      </div>
      <span>© 2026 Farol.dev</span>
    </footer>
  );
}

window.FarolFooter = FarolFooter;
