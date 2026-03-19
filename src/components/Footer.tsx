import './Components.css';

export const Footer = () => {
  return (
    <footer className="footer animate-fade-in" style={{ animationDelay: '300ms' }}>
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
