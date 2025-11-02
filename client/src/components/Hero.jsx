function Hero({ background, title, subtitle }) {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${background}')`
  };

  return (
    <section className="hero" style={heroStyle} data-testid="hero-section">
      <div className="hero-content">
        <h1 data-testid="hero-title">{title}</h1>
        <p data-testid="hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}

export default Hero;
