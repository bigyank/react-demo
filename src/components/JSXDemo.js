import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as Babel from '@babel/standalone';

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
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const CodePanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const PanelTitle = styled.h3`
  margin-bottom: 1rem;
  color: #4ecdc4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CodeEditor = styled.textarea`
  width: 100%;
  height: 300px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  outline: none;
  white-space: pre;
  overflow-x: auto;

  &:focus {
    box-shadow: 0 0 0 2px #4ecdc4;
  }
`;

const OutputPanel = styled.div`
  background: #1e1e1e;
  border-radius: 8px;
  padding: 0;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  width: 100%;
  
  & > pre {
    margin: 0 !important;
    padding: 1rem !important;
  }
  
  & code {
    white-space: pre !important;
    overflow-x: auto !important;
    display: block !important;
  }
`;

const ExampleSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ExampleButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#45b7aa' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ConceptCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const StepByStepDemo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const Step = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #4ecdc4;
`;

const TransformArrow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  
  @media (min-width: 1025px) {
    margin: 0;
    position: absolute;
    top: 50%;
    left: -3rem;
    transform: translateY(-50%);
  }
  
  svg {
    fill: #4ecdc4;
    width: 40px;
    height: 40px;
  }
`;

const HighlightBox = styled(motion.div)`
  background: rgba(255, 107, 107, 0.1);
  border: 1px dashed #ff6b6b;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.5rem 0;
`;

const ConnectionLine = styled(motion.div)`
  position: absolute;
  border-top: 2px dashed #4ecdc4;
  pointer-events: none;
  transition: all 0.3s ease;
`;

const KeyPoint = styled.div`
  background: rgba(102, 126, 234, 0.2);
  border-left: 4px solid #667eea;
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 5px 5px 0;
`;

const VisualGuide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
`;

const GuideItem = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const ColorLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  &:before {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    background: ${props => props.color};
    border-radius: 3px;
  }
`;

const ToggleButton = styled.button`
  display: none; /* Hide the toggle button since we'll always show highlights */
`;

const CodeDisplay = styled.div`
  background: rgb(40, 44, 52);
  border-radius: 8px;
  padding: 0;
  min-height: 180px;
  margin: 1rem 0;
  overflow: auto;
  position: relative;
  border-left: 4px solid #4ecdc4;
  width: 100%;
  
  & > pre {
    margin: 0 !important;
    padding: 1rem !important;
  }
  
  & code {
    white-space: pre !important;
    overflow-x: auto !important;
    display: block !important;
    font-family: 'Fira Code', 'Courier New', monospace !important;
  }
`;

function JSXDemo() {
  const [selectedExample, setSelectedExample] = useState('basic');
  const [customJSX, setCustomJSX] = useState('');
  const [compiledJS, setCompiledJS] = useState('');
  const [showHighlights, setShowHighlights] = useState(true); // Always set to true
  const [highlightedSections, setHighlightedSections] = useState({jsx: [], js: []});

  const examples = {
    basic: {
      name: 'Basic JSX',
      jsx: `function Welcome() {
  return <h1>Hello, World!</h1>;
}`
    },
    withProps: {
      name: 'JSX with Props',
      jsx: `function Greeting({ name, age }) {
  return (
    <div className="greeting">
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
}`
    },
    withEvents: {
      name: 'JSX with Events',
      jsx: `function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button 
      onClick={handleClick}
      className="btn btn-primary"
    >
      Click me!
    </button>
  );
}`
    },
    complex: {
      name: 'Complex JSX',
      jsx: `function TodoList({ todos }) {
  return (
    <div className="todo-list">
      <h3>My Todos</h3>
      {todos.length === 0 ? (
        <p>No todos yet!</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span>{todo.text}</span>
              {todo.completed && <span> ✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`
    }
  };

  const compileJSX = (jsxCode) => {
    try {
      const result = Babel.transform(jsxCode, {
        presets: ['react'],
        plugins: []
      });
      
      // Extract highlighted sections for mapping
      const jsxHighlights = extractJSXHighlights(jsxCode);
      const jsHighlights = extractJSHighlights(result.code);
      
      setHighlightedSections({jsx: jsxHighlights, js: jsHighlights});
      return result.code;
    } catch (error) {
      return `// Compilation Error:\n// ${error.message}`;
    }
  };

  // Helper functions to extract sections for highlighting connections
  const extractJSXHighlights = (code) => {
    // This is a simplified version - in a real app, you'd use a proper parser
    const highlights = [];
    
    // Look for element tags
    const elementMatches = code.match(/<[A-Za-z][^>]*>/g) || [];
    elementMatches.forEach(match => {
      highlights.push({
        text: match,
        type: 'element',
        color: 'rgba(78, 205, 196, 0.3)'
      });
    });
    
    // Look for props
    const propsMatches = code.match(/[A-Za-z]+={.+?}/g) || [];
    propsMatches.forEach(match => {
      highlights.push({
        text: match,
        type: 'props',
        color: 'rgba(255, 107, 107, 0.3)'
      });
    });
    
    return highlights;
  };
  
  const extractJSHighlights = (code) => {
    // Simplified for demo purposes
    const highlights = [];
    
    // Look for React.createElement calls
    const createElementMatches = code.match(/React\.createElement\(.+?\)/g) || [];
    createElementMatches.forEach(match => {
      highlights.push({
        text: match,
        type: 'element',
        color: 'rgba(78, 205, 196, 0.3)'
      });
    });
    
    // Look for props objects
    const propsMatches = code.match(/\{\s*[A-Za-z]+:.+?\}/g) || [];
    propsMatches.forEach(match => {
      highlights.push({
        text: match,
        type: 'props',
        color: 'rgba(255, 107, 107, 0.3)'
      });
    });
    
    return highlights;
  };

  useEffect(() => {
    // Always ensure highlights are visible
    setShowHighlights(true);
    
    const currentJSX = customJSX || examples[selectedExample].jsx;
    const compiled = compileJSX(currentJSX);
    setCompiledJS(compiled);
  }, [selectedExample, customJSX]);

  const jsxConcepts = [
    {
      title: "What is JSX?",
      content: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It makes React components more readable and easier to write."
    },
    {
      title: "JSX is NOT HTML",
      content: "Although JSX looks like HTML, it's actually JavaScript. It gets compiled (transformed) into regular JavaScript function calls."
    },
    {
      title: "Babel Transformation",
      content: "Tools like Babel transform JSX into React.createElement() calls that the browser can understand."
    },
    {
      title: "Why Use JSX?",
      content: "JSX makes it easier to visualize the component structure, provides better error messages, and allows you to use the full power of JavaScript within your markup."
    }
  ];

  const transformationSteps = [
    {
      title: "Step 1: HTML-like JSX",
      jsx: `<div className="container">
  <h1>{title}</h1>
  <p>{content}</p>
</div>`,
      description: "You write JSX that looks like HTML but can include JavaScript expressions in curly braces"
    },
    {
      title: "Step 2: Babel Transforms to JavaScript",
      jsx: `React.createElement(
  "div", 
  { className: "container" },
  React.createElement("h1", null, title),
  React.createElement("p", null, content)
)`,
      description: "Babel transforms JSX into nested React.createElement() calls"
    },
    {
      title: "Step 3: React Creates Element Objects",
      jsx: `{
  type: "div",
  props: { 
    className: "container",
    children: [
      { type: "h1", props: { children: title } },
      { type: "p", props: { children: content } }
    ] 
  }
}`,
      description: "React creates JavaScript objects (Virtual DOM nodes)"
    },
    {
      title: "Step 4: DOM Rendering",
      jsx: `// DOM nodes are created:
const divElement = document.createElement("div");
divElement.className = "container";

const h1Element = document.createElement("h1");
h1Element.textContent = title;

// Elements are connected and added to the DOM
divElement.appendChild(h1Element);
// ...and so on`,
      description: "React uses these objects to create and update real DOM elements"
    }
  ];

  return (
    <Container>
      <BackButton to="/">&larr; Back to Home</BackButton>
      
      <Title>JSX Under the Hood</Title>
      
      {/* Concept Cards */}
      <StepByStepDemo>
        {jsxConcepts.map((concept, index) => (
          <Step
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h4 style={{ color: '#4ecdc4', marginBottom: '1rem' }}>{concept.title}</h4>
            <p style={{ lineHeight: 1.6, margin: 0 }}>{concept.content}</p>
          </Step>
        ))}
      </StepByStepDemo>
      
      <ConceptCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 style={{ marginBottom: '1rem' }}>JSX Transformation Process</h3>
        <p>Follow the step-by-step process of how JSX becomes DOM elements:</p>
        
        <VisualGuide>
          {transformationSteps.map((step, index) => (
            <GuideItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h4>{step.title}</h4>
              <CodeDisplay>
                <SyntaxHighlighter 
                  language={index === 0 ? "jsx" : "javascript"} 
                  style={atomDark}
                  wrapLines={false}
                  customStyle={{
                    background: 'transparent',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    width: '100%'
                  }}
                >
                  {step.jsx}
                </SyntaxHighlighter>
              </CodeDisplay>
              <p style={{ fontSize: '0.95rem' }}>{step.description}</p>
              
              {index < transformationSteps.length - 1 && (
                <motion.div 
                  style={{ textAlign: 'center', margin: '0.5rem 0', fontSize: '1.5rem' }}
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ↓
                </motion.div>
              )}
            </GuideItem>
          ))}
        </VisualGuide>
      </ConceptCard>
      
      <KeyPoint>
        <h4>Key Takeaway</h4>
        <p>JSX provides a familiar HTML-like syntax, but under the hood, it's all JavaScript function calls.</p>
        <p>This allows React to create a Virtual DOM and efficiently update only what needs to change.</p>
      </KeyPoint>
      
      {/* Interactive demo */}
      <h2 style={{ margin: '2rem 0 1rem' }}>Try it yourself: JSX to JavaScript Transformation</h2>
      
      <ExampleSelector>
        {Object.entries(examples).map(([key, example]) => (
          <ExampleButton
            key={key}
            active={selectedExample === key && !customJSX}
            onClick={() => {
              setSelectedExample(key);
              setCustomJSX('');
            }}
          >
            {example.name}
          </ExampleButton>
        ))}
      </ExampleSelector>
      
      <DemoSection>
        <CodePanel
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PanelTitle>
            <span className="material-icons">code</span>
            JSX Input
          </PanelTitle>
          <CodeEditor
            value={customJSX || examples[selectedExample].jsx}
            onChange={(e) => setCustomJSX(e.target.value)}
            spellCheck="false"
          />
          {/* Toggle button is now hidden through CSS */}
          <ToggleButton onClick={() => setShowHighlights(true)}>
            Show Highlights
          </ToggleButton>
        </CodePanel>
        
        <motion.div 
          style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.5rem' }}
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓
        </motion.div>
        
        <CodePanel
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PanelTitle>
            <span className="material-icons">javascript</span>
            Compiled JavaScript
          </PanelTitle>
          <OutputPanel>
            <SyntaxHighlighter 
              language="javascript" 
              style={atomDark}
              wrapLines={false}
              showLineNumbers={true}
              customStyle={{
                background: 'transparent',
                width: '100%',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}
            >
              {compiledJS}
            </SyntaxHighlighter>
          </OutputPanel>
        </CodePanel>
      </DemoSection>
      
      <VisualGuide>
        <GuideItem>
          <h4>JSX to JavaScript Transformation</h4>
          <p>Notice how JSX elements become React.createElement() calls:</p>
          <ColorLegend color="#4ecdc4">Element tags transform to createElement calls</ColorLegend>
          <ColorLegend color="#ff6b6b">Props transform to JavaScript objects</ColorLegend>
          <ColorLegend color="#667eea">Content transforms to children arguments</ColorLegend>
        </GuideItem>
        <GuideItem>
          <h4>What's happening here?</h4>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>JSX makes your code readable and intuitive</li>
            <li>Babel transforms JSX to plain JavaScript at build time</li>
            <li>The browser only sees regular JavaScript function calls</li>
            <li>React turns these function calls into DOM elements</li>
          </ol>
        </GuideItem>
      </VisualGuide>
    </Container>
  );
}

export default JSXDemo;