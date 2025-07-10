import React from 'react';
import './ProcessSteps.css';

const steps = [
  { title: 'Add to cart', description: 'Let your customers understand your process.', icon: '🛒' },
  { title: 'Sign in', description: 'Click on the number to adapt it to your purpose.', icon: '🔐' },
  { title: 'Pay', description: 'Duplicate blocks to add more steps.', icon: '💳' },
  { title: 'Get Delivered', description: 'Select and delete blocks to remove some steps.', icon: '📦' }
];

const ProcessSteps = () => {
  return (
    <section className="process-section">
      <h2 className="process-title">Our process in four easy steps</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step-card" key={index} style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index !== steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
