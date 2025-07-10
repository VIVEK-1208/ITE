import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Banner */}
      <div className="about-banner">
        <img src="/img/about-us.jpg" alt="About Banner" className="banner-image" />
      </div>

      {/* Section 1 */}
      <section className="about-section">
        <div className="about-content reverse">
          <div className="about-text">
            <h2>Unique experiences to drive engagement with our tools</h2>
            <p>
              Users are looking to consume engaging content about tools. We empower our teams to create the most
              relevant content on pneumatic tools.
            </p>
            <p>
              We have one goal in mind, user satisfaction with our tools.
            </p>
          </div>
          <div className="about-img">
            <img src="/img/about-us-2.png" alt="Tools Experience" />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-img">
            <img src="/img/about-us-3.jpg" alt="Explore Tools" />
          </div>
          <div className="about-text">
            <h2>Explore New Tools</h2>
            <p>
              We offer a wide range of pneumatic tools designed for efficiency and durability. Our products cater to
              various industries, ensuring you find the right tool for your needs.
            </p>
            <p>
              Begin with understanding the needs of your clients – discover what they require and provide it effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="about-section">
        <h2 className="center-heading">Our finest selection</h2>
        <div className="selection-grid">
          <div className="tool-item">
            <img src="/img/tool1.jpg" alt="Angle Grinder" />
            <h4>Angle Grinder</h4>
          </div>
          <div className="tool-item">
            <img src="/img/tool2.jpg" alt="Cutter" />
            <h4>Cutter</h4>
          </div>
          <div className="tool-item">
            <img src="/img/tool3.jpg" alt="Drill Machine" />
            <h4>Drill Machine</h4>
          </div>
          <div className="tool-item">
            <img src="/img/tool4.jpg" alt="Chain Saw" />
            <h4>Chain Saw</h4>
          </div>
          <div className="tool-item">
            <img src="/img/tool5.png" alt="Wood Cutting Blade" />
            <h4>Wood Cutting Blade</h4>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default About;
