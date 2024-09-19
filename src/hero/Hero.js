function HeroPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Polling Station & Election Information in Seconds</h1>
            <p>
              Search for your voter record, find your polling station, and get
              ready to vote. All the information you need in one place.
            </p>

            {/* <!-- Optional Extra Information --> */}
            <div className="features">
              <div className="feature-item">
                <i className="icon-location"></i>
                <p>Check Your Polling Station</p>
              </div>
              <div className="feature-item">
                <i className="icon-id-card"></i>
                <p>Easy Voter Lookup</p>
              </div>
              <div className="feature-item">
                <i className="icon-info-circle"></i>
                <p>Get Election Day Info</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroPage;
