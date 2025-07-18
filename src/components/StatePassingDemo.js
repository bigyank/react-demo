import React, { useState, useEffect, useCallback } from 'react';
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

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const ComponentBox = styled(motion.div)`
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.borderColor || 'rgba(255, 255, 255, 0.3)'};
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

const RerenderIndicator = styled(motion.div)`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ExplanationBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border-left: 4px solid #4ecdc4;
`;

const StateFlowArrow = styled(motion.div)`
  position: relative;
  width: 2px;
  height: 30px;
  background: #4ecdc4;
  margin: 0 auto;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -5px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #4ecdc4;
  }
`;

const StateIndicator = styled(motion.div)`
  position: absolute;
  top: ${props => props.top || '10px'};
  left: ${props => props.left || '10px'};
  background: #667eea;
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  z-index: 2;
  pointer-events: none;
`;

// Child components for demonstration
function GrandChild({ count, onIncrement }) {
  const [rerenderCount, setRerenderCount] = useState(0);
  
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
    
    // Add visual highlight effect on rerender
    const el = document.getElementById('grandchild-component');
    if (el) {
      el.classList.add('highlight-rerender');
      setTimeout(() => {
        el.classList.remove('highlight-rerender');
      }, 500);
    }
  }, [count]); // Add dependency to prevent infinite loop

  return (
    <ComponentBox 
      id="grandchild-component"
      color="rgba(255, 107, 107, 0.2)" 
      borderColor="#ff6b6b"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      <RerenderIndicator
        key={rerenderCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {rerenderCount}
      </RerenderIndicator>
      <h4>GrandChild Component</h4>
      <p>Count: {count}</p>
      <StateIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Props: {JSON.stringify({count, onIncrement: 'fn()'})}
      </StateIndicator>
      <Button onClick={onIncrement}>Increment from GrandChild</Button>
    </ComponentBox>
  );
}

function Child({ count, onIncrement }) {
  const [rerenderCount, setRerenderCount] = useState(0);
  
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
    
    // Add visual highlight effect on rerender
    const el = document.getElementById('child-component');
    if (el) {
      el.classList.add('highlight-rerender');
      setTimeout(() => {
        el.classList.remove('highlight-rerender');
      }, 500);
    }
  }, [count]); // Add dependency to prevent infinite loop

  return (
    <ComponentBox 
      id="child-component"
      color="rgba(78, 205, 196, 0.2)" 
      borderColor="#4ecdc4"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      <RerenderIndicator
        key={rerenderCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {rerenderCount}
      </RerenderIndicator>
      <h4>Child Component</h4>
      <p>Received count: {count}</p>
      <StateIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Props: {JSON.stringify({count, onIncrement: 'fn()'})}
      </StateIndicator>
      <StateFlowArrow 
        initial={{ height: 0 }}
        animate={{ height: 30 }}
        transition={{ duration: 0.3 }}
      />
      <GrandChild count={count} onIncrement={onIncrement} />
    </ComponentBox>
  );
}

function Parent() {
  const [count, setCount] = useState(0);
  const [rerenderCount, setRerenderCount] = useState(0);
  
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
    
    // Add visual highlight effect on rerender
    const el = document.getElementById('parent-component');
    if (el) {
      el.classList.add('highlight-rerender');
      setTimeout(() => {
        el.classList.remove('highlight-rerender');
      }, 500);
    }
  }, [count]); // Add dependency to prevent infinite loop

  const incrementCount = () => {
    setCount(prev => prev + 1);
  };

  return (
    <ComponentBox 
      id="parent-component"
      color="rgba(102, 126, 234, 0.2)" 
      borderColor="#667eea"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      <RerenderIndicator
        key={rerenderCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {rerenderCount}
      </RerenderIndicator>
      <h4>Parent Component</h4>
      <p>State: {count}</p>
      <StateIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        State: {JSON.stringify({count})}
      </StateIndicator>
      <Button onClick={incrementCount}>Increment from Parent</Button>
      <StateFlowArrow 
        initial={{ height: 0 }}
        animate={{ height: 30 }}
        transition={{ duration: 0.3 }}
      />
      <Child count={count} onIncrement={incrementCount} />
    </ComponentBox>
  );
}

// Optimized components using React.memo
const OptimizedChild = React.memo(function OptimizedChild({ count, onIncrement }) {
  const [rerenderCount, setRerenderCount] = useState(0);
  
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
  }, [count]); // Only re-render when count changes

  return (
    <ComponentBox 
      color="rgba(78, 205, 196, 0.2)" 
      borderColor="#4ecdc4"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      <RerenderIndicator
        key={rerenderCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {rerenderCount}
      </RerenderIndicator>
      <h4>Optimized Child (React.memo)</h4>
      <p>Count: {count}</p>
      <Button onClick={onIncrement}>Increment</Button>
    </ComponentBox>
  );
});

function OptimizedParent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const [rerenderCount, setRerenderCount] = useState(0);
  
  useEffect(() => {
    setRerenderCount(prev => prev + 1);
  }, [count, otherState]); // Track both state changes

  const incrementCount = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const incrementOther = () => {
    setOtherState(prev => prev + 1);
  };

  return (
    <ComponentBox 
      color="rgba(102, 126, 234, 0.2)" 
      borderColor="#667eea"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      <RerenderIndicator
        key={rerenderCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {rerenderCount}
      </RerenderIndicator>
      <h4>Optimized Parent</h4>
      <p>Count: {count} | Other: {otherState}</p>
      <Button onClick={incrementCount}>Increment Count</Button>
      <Button onClick={incrementOther}>Increment Other (watch child!)</Button>
      <OptimizedChild count={count} onIncrement={incrementCount} />
    </ComponentBox>
  );
}

function StatePassingDemo() {
  return (
    <Container>
      <BackButton to="/">← Back to Home</BackButton>
      <Title>State Passing & Re-rendering in React</Title>
      
      <DemoCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>State Flow & Component Re-rendering</h3>
        <p>Watch how state changes flow down the component tree and trigger re-renders</p>
        
        <ExplanationBox>
          <h4>How to use this demo:</h4>
          <ul>
            <li>Click any "Increment" button to change state</li>
            <li>Watch the re-render counters (red circles) increase</li>
            <li>Notice how changes flow down from parent to children</li>
            <li>Observe which components re-render when state changes</li>
          </ul>
        </ExplanationBox>
        
        <style>
          {`
            @keyframes highlightRerender {
              0% { background: rgba(255, 107, 107, 0.1); }
              50% { background: rgba(255, 107, 107, 0.3); }
              100% { background: rgba(255, 107, 107, 0.0); }
            }
            
            .highlight-rerender {
              animation: highlightRerender 0.5s ease;
            }
          `}
        </style>
        
        <Parent />
        
        <ExplanationBox>
          <h4>What's happening:</h4>
          <p>
            When state changes in a parent component, React re-renders that component
            and all its children components that receive that state as props.
            Notice how the re-render count increases for all components in the tree.
          </p>
          
          <CodeBlock>
{`// Parent component with state
function Parent() {
  const [count, setCount] = useState(0);
  
  const incrementCount = () => {
    setCount(count + 1); // State change triggers re-render
  };

  return (
    <div>
      <h4>Parent Component</h4>
      <p>State: {count}</p>
      <Child count={count} onIncrement={incrementCount} />
    </div>
  );
}`}
          </CodeBlock>
        </ExplanationBox>
      </DemoCard>

      <DemoCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Performance Optimization with React.memo</h3>
        <p>See how React.memo prevents unnecessary re-renders when props don't change</p>
        
        <ExplanationBox>
          <h4>Optimization Demo:</h4>
          <ul>
            <li>Click "Increment Other" to change unrelated state</li>
            <li>Notice the optimized child doesn't re-render unnecessarily</li>
            <li>Compare with the basic example above where all children re-render</li>
            <li>React.memo only re-renders when props actually change</li>
          </ul>
        </ExplanationBox>
        
        <OptimizedParent />
        
        <ExplanationBox>
          <h4>How it works:</h4>
          <p>
            React.memo is a higher-order component that memoizes the result. 
            It only re-renders if props change, preventing unnecessary renders 
            when parent state changes that don't affect the child.
          </p>
          
          <CodeBlock>
{`// Optimized child component
const OptimizedChild = React.memo(function OptimizedChild({ count, onIncrement }) {
  return (
    <div>
      <h4>Optimized Child (React.memo)</h4>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
});

// Parent with multiple state values
function OptimizedParent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // useCallback prevents function recreation on every render
  const incrementCount = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <div>
      <p>Count: {count} | Other: {otherState}</p>
      <button onClick={incrementCount}>Increment Count</button>
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Increment Other (watch child!)
      </button>
      <OptimizedChild count={count} onIncrement={incrementCount} />
    </div>
  );
}`}
          </CodeBlock>
        </ExplanationBox>
      </DemoCard>

      <ExplanationBox>
        <h3>Key Concepts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(102, 126, 234, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4>State Flow</h4>
            <ul>
              <li>State flows down from parent to child via props</li>
              <li>Functions can be passed down to allow children to update parent state</li>
              <li>Changes trigger re-renders in the component tree</li>
            </ul>
          </div>
          
          <div style={{ background: 'rgba(78, 205, 196, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4>Re-rendering Rules</h4>
            <ul>
              <li>When state changes, the component re-renders</li>
              <li>All child components also re-render by default</li>
              <li>Re-renders happen even if props haven't changed</li>
            </ul>
          </div>
          
          <div style={{ background: 'rgba(255, 107, 107, 0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4>Optimization Techniques</h4>
            <ul>
              <li>React.memo prevents unnecessary re-renders</li>
              <li>useCallback memoizes functions</li>
              <li>useMemo memoizes expensive calculations</li>
            </ul>
          </div>
        </div>
      </ExplanationBox>
      
    </Container>
  );
}

export default StatePassingDemo;