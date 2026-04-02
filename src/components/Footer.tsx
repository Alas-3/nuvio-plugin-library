import './Components.css';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in" style={{ animationDelay: '300ms' }}>
      <p className="footer-callout">
        Want a plugin added? Join the{' '}
        <a
          className="footer-discord-link"
          href="https://discord.gg/Nps9Ye2HNs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>{' '}
        and ping @wolfknight5555.
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
