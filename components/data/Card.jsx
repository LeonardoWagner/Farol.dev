/** Generic content card — charcoal surface, hairline border, soft shadow. */
function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: 'var(--surface-card)', border: '1px solid var(--surface-card-border)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)',
        padding: 'var(--space-6)', fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)', boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

window.FarolDevDesignSystem_199cc2 = window.FarolDevDesignSystem_199cc2 || {};
window.FarolDevDesignSystem_199cc2.Card = Card;
