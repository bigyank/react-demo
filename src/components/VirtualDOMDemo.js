import React, { useState, useRef, useEffect } from 'react';
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

// Change DemoSection layout to be vertical
const DemoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 3rem;
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardTitle = styled.h3`
  margin-bottom: 1rem;
  color: #4ecdc4;
  font-size: 1.5rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const DOMVisualization = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.95rem;
  min-height: 300px;
  overflow: auto;
  width: 100%;
  white-space: pre;
  
  /* Add nice scrollbars */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const TreeNode = styled(motion.div)`
  margin-left: ${props => props.level * 20}px;
  padding: 0.5rem 0;
  color: ${props => {
    switch (props.type) {
      case 'element': return '#61dafb';
      case 'text': return '#98fb98';
      case 'changed': return '#ff6b6b';
      case 'new': return '#4ecdc4';
      default: return 'white';
    }
  }};
  white-space: nowrap;
  width: fit-content;
  min-width: 100%;
  
  ${props => props.highlight && `
    background: rgba(255, 107, 107, 0.2);
    border-radius: 3px;
    padding: 0.5rem;
    animation: pulse 1.5s infinite;
  `}

  @keyframes pulse {
    0% { background: rgba(255, 107, 107, 0.1); }
    50% { background: rgba(255, 107, 107, 0.3); }
    100% { background: rgba(255, 107, 107, 0.1); }
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.7rem 1.5rem;
  background: ${props => props.primary ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.primary ? '#45b7b8' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4ecdc4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: black;
`;

const ConceptSection = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
`;

// Update the ConceptGrid to handle smaller screens better
const ConceptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ConceptCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #4ecdc4;
`;

const RealDOMVisual = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  
  &::before {
    content: '${props => props.showReflow ? 'DOM Reflow & Repaint' : ''}';
    position: absolute;
    top: 5px;
    right: 10px;
    background: #ff6b6b;
    color: white;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.8rem;
    opacity: ${props => props.showReflow ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: 10;
  }
`;

const VirtualDOMVisual = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  
  &::before {
    content: '${props => props.showComputing ? 'Diffing Algorithm' : ''}';
    position: absolute;
    top: 5px;
    right: 10px;
    background: #4ecdc4;
    color: white;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.8rem;
    opacity: ${props => props.showComputing ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: 10;
  }
`;

const PerformanceIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const PerformanceBar = styled.div`
  height: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.value}%;
    background: ${props => props.color};
    border-radius: 5px;
    transition: width 0.5s ease;
  }
`;

function VirtualDOMDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [realDOMOperations, setRealDOMOperations] = useState(0);
  const [virtualDOMOperations, setVirtualDOMOperations] = useState(0);
  const [showReflow, setShowReflow] = useState(false);
  const [showComputing, setShowComputing] = useState(false);

  const steps = [
    {
      title: "Initial State",
      description: "Both Real DOM and Virtual DOM start with the same structure",
      realDOM: [
        { type: 'element', content: '<div id="app">', level: 0 },
        { type: 'element', content: '  <h1>Todo List</h1>', level: 1 },
        { type: 'element', content: '  <ul>', level: 1 },
        { type: 'element', content: '    <li>Buy groceries</li>', level: 2 },
        { type: 'element', content: '    <li>Walk the dog</li>', level: 2 },
        { type: 'element', content: '  </ul>', level: 1 },
        { type: 'element', content: '</div>', level: 0 }
      ],
      virtualDOM: [
        { type: 'element', content: 'div#app', level: 0 },
        { type: 'element', content: '  h1: "Todo List"', level: 1 },
        { type: 'element', content: '  ul', level: 1 },
        { type: 'element', content: '    li: "Buy groceries"', level: 2 },
        { type: 'element', content: '    li: "Walk the dog"', level: 2 }
      ]
    },
    {
      title: "User Adds New Item",
      description: "User adds 'Read a book' to the todo list",
      realDOM: [
        { type: 'element', content: '<div id="app">', level: 0 },
        { type: 'element', content: '  <h1>Todo List</h1>', level: 1 },
        { type: 'element', content: '  <ul>', level: 1 },
        { type: 'element', content: '    <li>Buy groceries</li>', level: 2 },
        { type: 'element', content: '    <li>Walk the dog</li>', level: 2 },
        { type: 'new', content: '    <li>Read a book</li>', level: 2, highlight: true },
        { type: 'element', content: '  </ul>', level: 1 },
        { type: 'element', content: '</div>', level: 0 }
      ],
      virtualDOM: [
        { type: 'element', content: 'div#app', level: 0 },
        { type: 'element', content: '  h1: "Todo List"', level: 1 },
        { type: 'element', content: '  ul', level: 1 },
        { type: 'element', content: '    li: "Buy groceries"', level: 2 },
        { type: 'element', content: '    li: "Walk the dog"', level: 2 },
        { type: 'new', content: '    li: "Read a book"', level: 2, highlight: true }
      ]
    },
    {
      title: "Virtual DOM Diffing",
      description: "React compares old and new Virtual DOM trees to find differences",
      realDOM: [
        { type: 'element', content: 'Real DOM unchanged during diffing', level: 0 },
        { type: 'element', content: '(Expensive to manipulate)', level: 0 },
        { type: 'element', content: 'Operations: ' + realDOMOperations, level: 0 }
      ],
      virtualDOM: [
        { type: 'element', content: 'Diffing Algorithm Running...', level: 0 },
        { type: 'changed', content: '✓ Found: New <li> element', level: 1, highlight: true },
        { type: 'element', content: '✓ Position: After "Walk the dog"', level: 1 },
        { type: 'element', content: '✓ Content: "Read a book"', level: 1 },
        { type: 'element', content: 'Operations: ' + virtualDOMOperations, level: 0 }
      ]
    },
    {
      title: "Reconciliation",
      description: "React applies only the necessary changes to the Real DOM",
      realDOM: [
        { type: 'element', content: '<div id="app">', level: 0 },
        { type: 'element', content: '  <h1>Todo List</h1>', level: 1 },
        { type: 'element', content: '  <ul>', level: 1 },
        { type: 'element', content: '    <li>Buy groceries</li>', level: 2 },
        { type: 'element', content: '    <li>Walk the dog</li>', level: 2 },
        { type: 'new', content: '    <li>Read a book</li> ← ONLY THIS ADDED', level: 2, highlight: true },
        { type: 'element', content: '  </ul>', level: 1 },
        { type: 'element', content: '</div>', level: 0 }
      ],
      virtualDOM: [
        { type: 'element', content: 'div#app', level: 0 },
        { type: 'element', content: '  h1: "Todo List"', level: 1 },
        { type: 'element', content: '  ul', level: 1 },
        { type: 'element', content: '    li: "Buy groceries"', level: 2 },
        { type: 'element', content: '    li: "Walk the dog"', level: 2 },
        { type: 'element', content: '    li: "Read a book"', level: 2 }
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1 && !isAnimating) {
      setIsAnimating(true);
      
      // Show animation states based on the step
      if (currentStep === 1) {
        setShowComputing(true);
        setVirtualDOMOperations(prev => prev + 3);
      } else if (currentStep === 2) {
        setShowReflow(true);
        setRealDOMOperations(prev => prev + 1);
      }
      
      // Delay the step change to allow animations to play
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
        setShowComputing(false);
        setShowReflow(false);
      }, 1000);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setRealDOMOperations(0);
    setVirtualDOMOperations(0);
  };

  const currentStepData = steps[currentStep];

  return (
    <Container>
      <BackButton to="/">&larr; Back to Home</BackButton>
      <Title>Understanding React's Virtual DOM</Title>
      
      <DemoSection>
        <DemoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle>Real DOM</CardTitle>
          <Description>
            The actual Document Object Model rendered in the browser.
            Manipulating it directly is slow and expensive.
          </Description>
          
          <RealDOMVisual showReflow={showReflow}>
            <DOMVisualization>
              <AnimatePresence>
                {steps[currentStep].realDOM.map((node, index) => (
                  <TreeNode
                    key={`${index}-${node.content}`}
                    level={node.level}
                    type={node.type}
                    highlight={node.highlight}
                    initial={{ opacity: node.type === 'new' ? 0 : 1, x: node.type === 'new' ? -20 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {node.content}
                  </TreeNode>
                ))}
              </AnimatePresence>
            </DOMVisualization>
          </RealDOMVisual>
          
          <PerformanceIndicator>
            <div>DOM Operations: {realDOMOperations}</div>
            <div>Cost: High</div>
          </PerformanceIndicator>
          <PerformanceBar value={realDOMOperations * 25} color="#ff6b6b" />
        </DemoCard>
        
        {/* Add a visual separator */}
        <div style={{ 
          width: '100%', 
          height: '2px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          margin: '0.5rem 0' 
        }} />
        
        <DemoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardTitle>Virtual DOM</CardTitle>
          <Description>
            React's lightweight copy of the DOM structure.
            Changes are applied here first, then efficiently updated to the Real DOM.
          </Description>
          
          <VirtualDOMVisual showComputing={showComputing}>
            <DOMVisualization>
              <AnimatePresence>
                {steps[currentStep].virtualDOM.map((node, index) => (
                  <TreeNode
                    key={`${index}-${node.content}`}
                    level={node.level}
                    type={node.type}
                    highlight={node.highlight}
                    initial={{ opacity: node.type === 'new' ? 0 : 1, x: node.type === 'new' ? -20 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {node.content}
                  </TreeNode>
                ))}
              </AnimatePresence>
            </DOMVisualization>
          </VirtualDOMVisual>
          
          <PerformanceIndicator>
            <div>DOM Operations: {virtualDOMOperations}</div>
            <div>Cost: Low</div>
          </PerformanceIndicator>
          <PerformanceBar value={virtualDOMOperations * 5} color="#4ecdc4" />
        </DemoCard>
      </DemoSection>

      <ControlPanel>
        <StepIndicator>
          <StepNumber>{currentStep + 1}</StepNumber>
          <div>
            <h4>{steps[currentStep].title}</h4>
            <p>{steps[currentStep].description}</p>
          </div>
        </StepIndicator>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={prevStep} disabled={currentStep === 0 || isAnimating}>Previous</Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1 || isAnimating} primary>Next</Button>
          <Button onClick={reset} disabled={isAnimating}>Reset</Button>
        </div>
      </ControlPanel>
      
      <ConceptSection>
        <h3>What's happening when React updates the DOM?</h3>
        <p>
          When state changes in a React application, React doesn't immediately update the real DOM.
          Instead, it creates a new Virtual DOM tree, compares it with the previous one, and only
          applies the necessary changes to the real DOM. This process makes React applications faster.
        </p>
        
        <ConceptGrid>
          <ConceptCard>
            <h4>🚀 Performance</h4>
            <p>Virtual DOM operations are faster than real DOM operations because they happen in memory</p>
          </ConceptCard>
          <ConceptCard>
            <h4>🎯 Efficient Updates</h4>
            <p>Only the parts that actually changed get updated in the real DOM</p>
          </ConceptCard>
          <ConceptCard>
            <h4>🔄 Batching</h4>
            <p>Multiple changes can be batched together for optimal performance</p>
          </ConceptCard>
          <ConceptCard>
            <h4>🧠 Predictable</h4>
            <p>Makes UI updates more predictable and easier to debug</p>
          </ConceptCard>
        </ConceptGrid>
      </ConceptSection>
    </Container>
  );
}

export default VirtualDOMDemo;