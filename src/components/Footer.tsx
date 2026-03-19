import './Components.css';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in" style={{ animationDelay: '300ms' }}>
      <p className="footer-callout">
        Know a plugin we&apos;re missing? Click{' '}
        <a
          className="footer-discord-link"
          href="https://discord.com/users/709281623866081300"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{' '}
        and message me.
      </p>
      <p>
        Developed by <span className="footer-name">wolf knight</span> and{' '}
        <a
          className="footer-link"
          href="https://www.acelabador.me/"
          target="_blank"
          rel="noopener noreferrer"
        >
          alasss
        </a>
      </p>
    </footer>
  );
};
