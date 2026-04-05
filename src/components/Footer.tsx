import './Components.css';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in" style={{ animationDelay: '280ms' }}>
      <p className="footer-callout">
        Have a provider to share? Join the{' '}
        <a
          className="footer-discord-link"
          href="https://discord.gg/Nps9Ye2HNs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>{' '}
        community and post your manifest URL.
      </p>
      <p>
        Built by <span className="footer-name">wolf knight</span> and <span className="footer-name">alasss</span>
        {' '}for the Nuvio ecosystem.
      </p>
    </footer>
  );
};
