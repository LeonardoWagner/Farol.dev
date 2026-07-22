/** Small circular/square icon-only button, for toolbars and compact actions. */
function IconButton({ children, size = 'md', variant = 'ghost', onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const dims = { sm: 32, md: 40, lg: 48 }[size];
  const variants = {
    ghost: { background: hover ? 'var(--surface-raised)' : 'transparent', border: '1px solid transparent', color: 'var(--text-primary)' },
    outline: { background: hover ? 'var(--surface-raised)' : 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)' },
    solid: { background: hover ? 'var(--color-gray-700)' : 'var(--surface-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: dims, height: dims, borderRadius: 'var(--radius-md)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background var(--duration-fast) var(--ease-standard)',
        boxSizing: 'border-box', ...variants[variant], ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

window.FarolDevDesignSystem_199cc2 = window.FarolDevDesignSystem_199cc2 || {};
window.FarolDevDesignSystem_199cc2.IconButton = IconButton;
