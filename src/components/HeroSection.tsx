import './Components.css';

export const HeroSection = () => {
  return (
    <section className="hero animate-fade-in">
      <div className="hero-title-container">
        <img src="/NuvioLogo.png" alt="Nuvio Logo" className="hero-logo" />
        <h1 className="hero-title">Nuvio Plugin Library</h1>
      </div>
      <p className="hero-subtitle">
        The central place to find all available plugins for Nuvio
      </p>
    </section>
  );
};
