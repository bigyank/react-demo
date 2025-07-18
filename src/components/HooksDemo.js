import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  padding: 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ExplanationBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border-left: 4px solid #4ecdc4;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: #4ecdc4;
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 1rem 0 2rem 0;
`;

const DemoTitle = styled.h3`
  color: #4ecdc4;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CodeSection = styled.div`
  margin: 1.5rem 0;
  width: 100%;
`;

const CodeTitle = styled.h4`
  color: #ff6b6b;
  margin: 1rem 0 0.5rem 0;
`;

const CodeContainer = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 4px solid #4ecdc4;
  padding: 0;
  margin: 1rem 0;
  min-height: 100px;
  overflow: auto;
  width: 100%;
  
  & > pre {
    margin: 0 !important;
    padding: 1rem !important;
    width: 100%;
  }
  
  & code {
    white-space: pre !important;
    overflow-x: auto !important;
    display: block !important;
    font-family: 'Fira Code', 'Courier New', monospace !important;
  }
`;

const DemoSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 3px solid ${props => props.color || '#4ecdc4'};
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: ${props => props.active ? '#4ecdc4' : 'white'};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 25px;
  border: none;
  margin-right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 100%;
  max-width: 300px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
  }
`;

const InfoBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  border-left: 3px solid ${props => props.color || '#4ecdc4'};
`;

const RerenderIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 107, 107, 0.2);
  pointer-events: none;
  z-index: 10;
  border-radius: 8px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

// Create a context for useContext demo
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

// useReducer example
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

// Component for useContext demo
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: theme === 'dark' ? '#333' : '#f0f0f0',
        color: theme === 'dark' ? '#fff' : '#333',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      Current theme: {theme}
    </button>
  );
}

function HooksDemo() {
  const [activeHook, setActiveHook] = useState('useState');
  
  // useState demo
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // useEffect demo
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // useRef demo
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  
  // useMemo demo
  const [number, setNumber] = useState(0);
  const [dark, setDark] = useState(false);
  
  // useCallback demo
  const [callbackCount, setCallbackCount] = useState(0);
  
  // useReducer demo
  const [counterState, dispatch] = useReducer(counterReducer, { count: 0 });
  
  // useContext demo
  const [theme, setTheme] = useState('dark');
  
  // Show re-render indicator
  const [showRender, setShowRender] = useState(false);
  
  // Increment renderCount on each render
  renderCount.current++;
  
  // useEffect for timer
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  // useMemo example
  const doubleNumber = useMemo(() => {
    console.log('Computing doubled number');
    return slowFunction(number);
  }, [number]);
  
  // useCallback example
  const incrementCallbackCount = useCallback(() => {
    setCallbackCount(prevCount => prevCount + 1);
  }, []);
  
  // Slow function for useMemo demo
  function slowFunction(num) {
    // Simulate slow computation
    for (let i = 0; i < 1000000; i++) {}
    return num * 2;
  }
  
  // Focus input with useRef
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  // Toggle theme for useContext demo
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    triggerRender();
  };
  
  // Helper to show re-render indicator
  const triggerRender = () => {
    setShowRender(true);
    setTimeout(() => setShowRender(false), 500);
  };
  
  const hookInfo = {
    useState: {
      title: 'useState',
      color: '#ff6b6b',
      description: 'Adds state to functional components',
      code: `const [count, setCount] = useState(0);

// Update state
setCount(count + 1);

// Update with callback
setCount(prevCount => prevCount + 1);`,
    },
    useEffect: {
      title: 'useEffect',
      color: '#4ecdc4',
      description: 'Handles side effects in functional components',
      code: `// Runs after every render
useEffect(() => {
  document.title = \`Count: \${count}\`;
});

// Runs only when count changes
useEffect(() => {
  console.log(\`Count changed: \${count}\`);
}, [count]);

// Runs once on mount (empty deps array)
useEffect(() => {
  const subscription = subscribe();
  // Cleanup function runs before unmount
  return () => unsubscribe(subscription);
}, []);`,
    },
    useRef: {
      title: 'useRef',
      color: '#ffbe0b',
      description: 'Persists values between renders without causing re-renders',
      code: `// DOM reference
const inputRef = useRef(null);
inputRef.current.focus();

// Value that persists between renders
const renderCount = useRef(0);
renderCount.current++; // Doesn't cause re-render`,
    },
    useMemo: {
      title: 'useMemo',
      color: '#8338ec',
      description: 'Memoizes expensive calculations to optimize performance',
      code: `// Only recalculates when dependencies change
const doubleNumber = useMemo(() => {
  console.log('Computing...');
  return slowFunction(number);
}, [number]);`,
    },
    useCallback: {
      title: 'useCallback',
      color: '#3a86ff',
      description: 'Memoizes functions to prevent unnecessary re-renders',
      code: `// Function reference stays the same
// unless dependencies change
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);`,
    },
    useReducer: {
      title: 'useReducer',
      color: '#fb5607',
      description: 'Alternative to useState for complex state logic',
      code: `const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

dispatch({ type: 'increment' });`,
    },
    useContext: {
      title: 'useContext',
      color: '#06d6a0',
      description: 'Accesses context to share data without prop drilling',
      code: `// Create context
const ThemeContext = createContext('light');

// Provider in parent
<ThemeContext.Provider value={theme}>
  <ChildComponent />
</ThemeContext.Provider>

// Consumer in child
function ChildComponent() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}`,
    },
  };
  
  return (
    <Container>
      <Header>
        <BackButton to="/">← Back to Home</BackButton>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          React Hooks
        </Title>
        <p>Master the essential hooks that power modern React applications</p>
      </Header>

      <Content>
        <ExplanationBox>
          <h3>React Hooks Explained</h3>
          <p>
            Hooks are functions that let you "hook into" React state and lifecycle features from function components.
            They were introduced in React 16.8 to allow using state and other React features without writing a class.
          </p>
          <p>
            This interactive demo lets you explore the most commonly used hooks and see them in action.
            Select a hook from the tabs below to learn more and see live examples.
          </p>
        </ExplanationBox>
        
        <TabContainer>
          {Object.keys(hookInfo).map(hook => (
            <Tab
              key={hook}
              active={activeHook === hook}
              onClick={() => setActiveHook(hook)}
            >
              {hookInfo[hook].title}
            </Tab>
          ))}
        </TabContainer>
        
        <DemoCard>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHook}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoTitle style={{ color: hookInfo[activeHook].color }}>
                {hookInfo[activeHook].title}
              </DemoTitle>
              <p>{hookInfo[activeHook].description}</p>
              
              <GridContainer>
                <div>
                  <CodeSection>
                    <CodeTitle>Example Code</CodeTitle>
                    <CodeContainer>
                      <SyntaxHighlighter 
                        language="jsx" 
                        style={tomorrow} 
                        showLineNumbers={true}
                        wrapLines={true}
                        customStyle={{
                          background: 'transparent',
                          fontSize: '0.95rem',
                          padding: '1rem',
                          lineHeight: '1.5',
                          width: '100%'
                        }}
                      >
                        {hookInfo[activeHook].code}
                      </SyntaxHighlighter>
                    </CodeContainer>
                  </CodeSection>
                </div>
                
                <DemoSection color={hookInfo[activeHook].color} style={{ position: 'relative' }}>
                  {showRender && (
                    <RerenderIndicator 
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  <h4>Interactive Demo</h4>
                  
                  {activeHook === 'useState' && (
                    <div>
                      <p>Count: {count}</p>
                      <div>
                        <Button onClick={() => { setCount(count + 1); triggerRender(); }}>
                          Increment
                        </Button>
                        <Button onClick={() => { setCount(count - 1); triggerRender(); }}>
                          Decrement
                        </Button>
                        <Button onClick={() => { setCount(0); triggerRender(); }}>
                          Reset
                        </Button>
                      </div>
                      
                      <div style={{ marginTop: '1.5rem' }}>
                        <Input
                          type="text"
                          value={text}
                          onChange={(e) => { setText(e.target.value); triggerRender(); }}
                          placeholder="Type something..."
                        />
                        <p>Text: {text || '(empty)'}</p>
                      </div>
                      
                      <InfoBox>
                        <p>useState provides:</p>
                        <ul>
                          <li>A state variable to store data</li>
                          <li>A setter function to update that data</li>
                          <li>Re-rendering when data changes</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useEffect' && (
                    <div>
                      <p>Timer: {timer} seconds</p>
                      <div>
                        <Button 
                          onClick={() => { setIsRunning(!isRunning); triggerRender(); }}
                        >
                          {isRunning ? 'Pause' : 'Start'}
                        </Button>
                        <Button 
                          onClick={() => { setTimer(0); triggerRender(); }}
                          disabled={isRunning}
                        >
                          Reset
                        </Button>
                      </div>
                      
                      <InfoBox style={{ marginTop: '1.5rem' }}>
                        <p>This timer uses useEffect to:</p>
                        <ul>
                          <li>Set up an interval when the timer is running</li>
                          <li>Clean up the interval when paused or unmounted</li>
                          <li>Only re-create the effect when isRunning changes</li>
                        </ul>
                        <p>Check the console to see when the effect runs!</p>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useRef' && (
                    <div>
                      <p>This component has rendered {renderCount.current} times</p>
                      
                      <div style={{ marginTop: '1.5rem' }}>
                        <Input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => { setInputValue(e.target.value); triggerRender(); }}
                          placeholder="Type something..."
                        />
                        <Button onClick={focusInput} style={{ marginTop: '0.5rem' }}>
                          Focus Input
                        </Button>
                      </div>
                      
                      <InfoBox style={{ marginTop: '1.5rem' }}>
                        <p>useRef provides:</p>
                        <ul>
                          <li>A way to access DOM elements directly</li>
                          <li>A mutable value that persists across renders</li>
                          <li>Changes to .current don't trigger re-renders</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useMemo' && (
                    <div>
                      <p>Number: {number}</p>
                      <p>Doubled (memoized): {doubleNumber}</p>
                      
                      <div>
                        <Button onClick={() => { setNumber(number + 1); triggerRender(); }}>
                          Increment Number
                        </Button>
                        <Button 
                          onClick={() => { setDark(!dark); triggerRender(); }}
                          style={{ background: dark ? '#333' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' }}
                        >
                          Toggle Theme
                        </Button>
                      </div>
                      
                      <InfoBox style={{ marginTop: '1.5rem', background: dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)' }}>
                        <p>useMemo benefits:</p>
                        <ul>
                          <li>Avoids expensive recalculations on every render</li>
                          <li>Only recomputes when dependencies change</li>
                          <li>Notice: Changing theme doesn't recalculate the doubled number</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useCallback' && (
                    <div>
                      <p>Callback Count: {callbackCount}</p>
                      <Button onClick={() => { incrementCallbackCount(); triggerRender(); }}>
                        Increment (Memoized Function)
                      </Button>
                      
                      <InfoBox style={{ marginTop: '1.5rem' }}>
                        <p>useCallback benefits:</p>
                        <ul>
                          <li>Prevents function recreation on every render</li>
                          <li>Important for optimizing child component re-renders</li>
                          <li>Especially useful when passing callbacks to optimized components that use React.memo</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useReducer' && (
                    <div>
                      <p>Counter: {counterState.count}</p>
                      <div>
                        <Button onClick={() => { dispatch({ type: 'increment' }); triggerRender(); }}>
                          Increment
                        </Button>
                        <Button onClick={() => { dispatch({ type: 'decrement' }); triggerRender(); }}>
                          Decrement
                        </Button>
                        <Button onClick={() => { dispatch({ type: 'reset' }); triggerRender(); }}>
                          Reset
                        </Button>
                      </div>
                      
                      <InfoBox style={{ marginTop: '1.5rem' }}>
                        <p>useReducer benefits:</p>
                        <ul>
                          <li>Centralizes complex state logic outside component</li>
                          <li>More predictable state transitions</li>
                          <li>Easier testing of state logic</li>
                          <li>Helpful for managing related state values</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                  
                  {activeHook === 'useContext' && (
                    <div>
                      <ThemeContext.Provider value={{ theme, toggleTheme }}>
                        <div style={{ 
                          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                          padding: '1.5rem',
                          borderRadius: '8px',
                          color: theme === 'dark' ? 'white' : '#333',
                          transition: 'all 0.3s ease'
                        }}>
                          <h4>Parent Component (Provider)</h4>
                          <p>Current theme: {theme}</p>
                          
                          <div style={{ 
                            margin: '1rem 0',
                            padding: '1rem',
                            background: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px'
                          }}>
                            <h5>Child Component (Consumer)</h5>
                            <ThemedButton />
                          </div>
                        </div>
                      </ThemeContext.Provider>
                      
                      <InfoBox style={{ marginTop: '1.5rem' }}>
                        <p>useContext benefits:</p>
                        <ul>
                          <li>Shares data across the component tree</li>
                          <li>Avoids prop drilling through intermediate components</li>
                          <li>Centralizes state that many components need</li>
                          <li>Components re-render when context value changes</li>
                        </ul>
                      </InfoBox>
                    </div>
                  )}
                </DemoSection>
              </GridContainer>
            </motion.div>
          </AnimatePresence>
        </DemoCard>
      </Content>
    </Container>
  );
}

export default HooksDemo; 