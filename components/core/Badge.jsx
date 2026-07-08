const badgeColors = {
  neutral: { bg: 'var(--surface-raised)', fg: 'var(--text-secondary)', border: 'var(--border-subtle)' },
  coral: { bg: 'rgba(255,107,87,0.14)', fg: 'var(--color-coral)', border: 'rgba(255,107,87,0.3)' },
  blue: { bg: 'rgba(76,111,255,0.14)', fg: 'var(--color-blue)', border: 'rgba(76,111,255,0.3)' },
  purple: { bg: 'rgba(138,92,255,0.14)', fg: 'var(--color-purple)', border: 'rgba(138,92,255,0.3)' },
  success: { bg: 'rgba(62,216,182,0.14)', fg: 'var(--color-success)', border: 'rgba(62,216,182,0.3)' },
  danger: { bg: 'rgba(255,92,92,0.14)', fg: 'var(--color-danger)', border: 'rgba(255,92,92,0.3)' },
};

/** Small status/label pill — used for tags, states, and metadata chips. */
function Badge({ children, color = 'neutral', style, ...rest }) {
  const c = badgeColors[color] || badgeColors.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
        background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

window.FarolDevDesignSystem_199cc2 = window.FarolDevDesignSystem_199cc2 || {};
window.FarolDevDesignSystem_199cc2.Badge = Badge;
