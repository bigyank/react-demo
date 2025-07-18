import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
`;

const DemoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const InputContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.controlled ? '#4ecdc4' : '#ff6b6b'};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  margin: 0.5rem 0;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.controlled ? '#2eb8b0' : '#ff5252'};
    box-shadow: 0 0 0 3px ${props => props.controlled ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
  }
`;

const StateDisplay = styled(motion.div)`
  background: ${props => props.controlled ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 107, 107, 0.2)'};
  border: 2px solid ${props => props.controlled ? '#4ecdc4' : '#ff6b6b'};
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  th {
    background: rgba(255, 255, 255, 0.2);
    font-weight: bold;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ExplanationBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const FlowDiagram = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const FlowStep = styled(motion.div)`
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.borderColor || 'rgba(255, 255, 255, 0.3)'};
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  min-width: 200px;
`;

const Arrow = styled(motion.div)`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #4ecdc4;
`;

function ControlledComponent() {
  const [value, setValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedValue(value);
  };

  const clearValue = () => {
    setValue('');
    setSubmittedValue('');
  };

  return (
    <div>
      <h4>🎛️ Controlled Component</h4>
      <p>React state controls the input value</p>
      
      <FlowDiagram>
        <FlowStep color="rgba(78, 205, 196, 0.2)" borderColor="#4ecdc4">
          User types → onChange → setState
        </FlowStep>
        <Arrow />
        <FlowStep color="rgba(78, 205, 196, 0.2)" borderColor="#4ecdc4">
          State updates → Re-render → Input value updates
        </FlowStep>
      </FlowDiagram>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <label>Controlled Input:</label>
          <StyledInput
            controlled={true}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something..."
          />
        </InputContainer>
        
        <StateDisplay 
          controlled={true}
          animate={{ scale: value !== submittedValue ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <strong>React State:</strong> "{value}"
        </StateDisplay>
        
        <Button type="submit">Submit</Button>
        <Button type="button" onClick={clearValue}>Clear</Button>
      </form>
      
      {submittedValue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'rgba(78, 205, 196, 0.3)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem' 
          }}
        >
          <strong>Submitted:</strong> "{submittedValue}"
        </motion.div>
      )}
    </div>
  );
}

function UncontrolledComponent() {
  const inputRef = useRef(null);
  const [submittedValue, setSubmittedValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedValue(inputRef.current.value);
  };

  const clearValue = () => {
    inputRef.current.value = '';
    setSubmittedValue('');
  };

  const getCurrentValue = () => {
    return inputRef.current ? inputRef.current.value : '';
  };

  return (
    <div>
      <h4>🔓 Uncontrolled Component</h4>
      <p>DOM manages the input value directly</p>
      
      <FlowDiagram>
        <FlowStep color="rgba(255, 107, 107, 0.2)" borderColor="#ff6b6b">
          User types → DOM updates directly
        </FlowStep>
        <Arrow />
        <FlowStep color="rgba(255, 107, 107, 0.2)" borderColor="#ff6b6b">
          React reads value via ref when needed
        </FlowStep>
      </FlowDiagram>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <label>Uncontrolled Input:</label>
          <StyledInput
            controlled={false}
            ref={inputRef}
            type="text"
            defaultValue=""
            placeholder="Type something..."
          />
        </InputContainer>
        
        <StateDisplay controlled={false}>
          <strong>DOM Value:</strong> Access via ref on submit
        </StateDisplay>
        
        <Button type="submit">Submit</Button>
        <Button type="button" onClick={clearValue}>Clear</Button>
      </form>
      
      {submittedValue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'rgba(255, 107, 107, 0.3)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem' 
          }}
        >
          <strong>Submitted:</strong> "{submittedValue}"
        </motion.div>
      )}
    </div>
  );
}

function MixedFormExample() {
  const [controlledEmail, setControlledEmail] = useState('');
  const [controlledAge, setControlledAge] = useState('');
  const [uncontrolledName, setUncontrolledName] = useState('');
  const [uncontrolledBio, setUncontrolledBio] = useState('');
  const nameRef = useRef(null);
  const bioRef = useRef(null);
  const [formData, setFormData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      email: controlledEmail,
      age: controlledAge,
      bio: bioRef.current.value
    };
    setFormData(data);
  };

  const handleNameChange = () => {
    setUncontrolledName(nameRef.current.value);
  };

  const handleBioChange = () => {
    setUncontrolledBio(bioRef.current.value);
  };

  const clearForm = () => {
    setControlledEmail('');
    setControlledAge('');
    setUncontrolledName('');
    setUncontrolledBio('');
    nameRef.current.value = '';
    bioRef.current.value = '';
    setFormData(null);
  };

  return (
    <DemoCard
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3>📝 Mixed Form Example with Live State</h3>
      <p>Real-world forms often mix controlled and uncontrolled components</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h4>📋 Form</h4>
          <form onSubmit={handleSubmit}>
            <InputContainer>
              <label>Name (Uncontrolled):</label>
              <StyledInput
                controlled={false}
                ref={nameRef}
                type="text"
                placeholder="Enter your name"
                onChange={handleNameChange}
              />
            </InputContainer>

            <InputContainer>
              <label>Email (Controlled):</label>
              <StyledInput
                controlled={true}
                type="email"
                value={controlledEmail}
                onChange={(e) => setControlledEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </InputContainer>

            <InputContainer>
              <label>Age (Controlled):</label>
              <StyledInput
                controlled={true}
                type="number"
                value={controlledAge}
                onChange={(e) => setControlledAge(e.target.value)}
                placeholder="Enter your age"
              />
            </InputContainer>

            <InputContainer>
              <label>Bio (Uncontrolled):</label>
              <textarea
                ref={bioRef}
                onChange={handleBioChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ff6b6b',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  fontSize: '1rem',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Tell us about yourself"
              />
            </InputContainer>

            <div style={{ textAlign: 'center' }}>
              <Button type="submit">Submit Form</Button>
              <Button type="button" onClick={clearForm}>Clear Form</Button>
            </div>
          </form>
        </div>

        <div>
          <h4>📊 Live Form State</h4>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ color: '#4ecdc4', margin: '0 0 0.5rem 0' }}>Controlled Fields (React State):</h5>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> "{controlledEmail}"
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Age:</strong> "{controlledAge}"
            </div>
          </div>

          <div style={{ 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h5 style={{ color: '#ff6b6b', margin: '0 0 0.5rem 0' }}>Uncontrolled Fields (DOM State):</h5>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <strong>Name:</strong> "{uncontrolledName}"
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Bio:</strong> "{uncontrolledBio.substring(0, 30)}{uncontrolledBio.length > 30 ? '...' : ''}"
            </div>
            <small style={{ opacity: 0.7 }}>
              (Updated via onChange for demo)
            </small>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '1rem', 
            borderRadius: '8px'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>Form Validation Status:</h5>
            <div style={{ fontSize: '0.9rem' }}>
              <span style={{ color: controlledEmail.includes('@') ? '#4ecdc4' : '#ff6b6b' }}>
                ✓ Email: {controlledEmail.includes('@') ? 'Valid' : 'Invalid'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <span style={{ color: controlledAge && parseInt(controlledAge) > 0 ? '#4ecdc4' : '#ff6b6b' }}>
                ✓ Age: {controlledAge && parseInt(controlledAge) > 0 ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {formData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}
          >
            <h4>📤 Submitted Form Data:</h4>
            <pre style={{ fontSize: '0.9rem', overflow: 'auto' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoCard>
  );
}

function ControlledUncontrolledDemo() {
  return (
    <Container>
      <BackButton to="/">← Back to Home</BackButton>
      
      <Title>Controlled vs Uncontrolled Components</Title>
      
      <ExplanationBox>
        <h3>🎯 Understanding Component Control</h3>
        <p>
          In React, form elements can be either controlled (React manages the state) or uncontrolled (DOM manages the state).
          Each approach has its use cases and trade-offs.
        </p>
      </ExplanationBox>

      <DemoSection>
        <DemoCard
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ControlledComponent />
        </DemoCard>

        <DemoCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <UncontrolledComponent />
        </DemoCard>
      </DemoSection>

      <MixedFormExample />

      <ExplanationBox>
        <h3>📊 Comparison</h3>
        <ComparisonTable>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Controlled</th>
              <th>Uncontrolled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>State Management</strong></td>
              <td>React state</td>
              <td>DOM state</td>
            </tr>
            <tr>
              <td><strong>Value Access</strong></td>
              <td>Always available in state</td>
              <td>Access via ref when needed</td>
            </tr>
            <tr>
              <td><strong>Validation</strong></td>
              <td>Real-time validation</td>
              <td>Validation on submit</td>
            </tr>
            <tr>
              <td><strong>Performance</strong></td>
              <td>Re-renders on every change</td>
              <td>No re-renders on input</td>
            </tr>
            <tr>
              <td><strong>Use Case</strong></td>
              <td>Dynamic forms, validation</td>
              <td>Simple forms, file inputs</td>
            </tr>
          </tbody>
        </ComparisonTable>
      </ExplanationBox>

      <ExplanationBox>
        <h3>💡 Best Practices</h3>
        <ul>
          <li><strong>Controlled:</strong> Use for forms that need validation, formatting, or dynamic behavior</li>
          <li><strong>Uncontrolled:</strong> Use for simple forms or when integrating with non-React libraries</li>
          <li><strong>File inputs:</strong> Always uncontrolled (React cannot control file input values)</li>
          <li><strong>Performance:</strong> Consider uncontrolled for large forms with many inputs</li>
          <li><strong>Consistency:</strong> Pick one approach per form to avoid confusion</li>
        </ul>
      </ExplanationBox>
    </Container>
  );
}

export default ControlledUncontrolledDemo;