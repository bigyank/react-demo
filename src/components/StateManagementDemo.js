import React, { useState, useReducer, createContext, useContext } from 'react';
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

const StateVisualizer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Fira Code', monospace;
`;

const ComponentBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '${props => props.name || "Component"}';
    position: absolute;
    top: -10px;
    left: 10px;
    background: #764ba2;
    padding: 0 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
`;

const FlowArrow = styled.div`
  position: relative;
  height: 40px;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 48%;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(255, 255, 255, 0.6);
    transform: translateY(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 2px;
    background: rgba(255, 255, 255, 0.6);
    transform: translateX(-50%);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

// Create context for useContext demo
const AppContext = createContext({
  count: 0,
  increment: () => {},
  decrement: () => {},
  reset: () => {}
});

// Create reducer for useReducer demo
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

// Example components for different state management approaches
function UseStateExample() {
  const [count, setCount] = useState(0);
  
  return (
    <ComponentBox name="UseStateExample">
      <h4>Counter: {count}</h4>
      <div>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <Button onClick={() => setCount(count - 1)}>Decrement</Button>
        <Button onClick={() => setCount(0)}>Reset</Button>
      </div>
      
      <StateVisualizer>
        {`{ count: ${count} }`}
      </StateVisualizer>
    </ComponentBox>
  );
}

function UseReducerExample() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <ComponentBox name="UseReducerExample">
      <h4>Counter: {state.count}</h4>
      <div>
        <Button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</Button>
        <Button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</Button>
        <Button onClick={() => dispatch({ type: 'RESET' })}>Reset</Button>
      </div>
      
      <StateVisualizer>
        {`{ count: ${state.count} }`}
      </StateVisualizer>
    </ComponentBox>
  );
}

function ContextProvider({ children }) {
  const [count, setCount] = useState(0);
  
  const contextValue = {
    count,
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
    reset: () => setCount(0)
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

function ContextConsumerA() {
  const { count, increment } = useContext(AppContext);
  
  return (
    <ComponentBox name="ConsumerA">
      <h4>Counter: {count}</h4>
      <Button onClick={increment}>Increment</Button>
      
      <StateVisualizer>
        {`{ count: ${count} }`}
      </StateVisualizer>
    </ComponentBox>
  );
}

function ContextConsumerB() {
  const { count, decrement, reset } = useContext(AppContext);
  
  return (
    <ComponentBox name="ConsumerB">
      <h4>Counter: {count}</h4>
      <div>
        <Button onClick={decrement}>Decrement</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      
      <StateVisualizer>
        {`{ count: ${count} }`}
      </StateVisualizer>
    </ComponentBox>
  );
}

function PropsDrillingExample() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <ComponentBox name="ParentComponent">
        <h4>Parent Counter: {count}</h4>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        
        <StateVisualizer>
          {`{ count: ${count} }`}
        </StateVisualizer>
        
        <FlowArrow />
        
        <ComponentBox name="ChildComponent">
          <h4>Child received: {count}</h4>
          
          <FlowArrow />
          
          <ComponentBox name="GrandchildComponent">
            <h4>Grandchild received: {count}</h4>
            <Button onClick={() => setCount(0)}>Reset from Grandchild</Button>
          </ComponentBox>
        </ComponentBox>
      </ComponentBox>
    </div>
  );
}

function StateManagementDemo() {
  const [activeTab, setActiveTab] = useState('local');
  
  const tabs = {
    local: {
      title: 'Local State',
      description: 'Component-level state management using useState and useReducer',
    },
    context: {
      title: 'React Context',
      description: 'Share state between components without prop drilling',
    },
    props: {
      title: 'Props Drilling',
      description: 'Passing state down through multiple component levels',
    },
    external: {
      title: 'External Libraries',
      description: 'Overview of popular state management libraries',
    },
  };
  
  const externalLibrariesCode = {
    redux: `// Redux setup
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

// Provider
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Component using Redux
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
    </div>
  );
}`,

    zustand: `// Zustand setup
import create from 'zustand';

// Create store
const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Component using Zustand
function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}`,

    recoil: `// Recoil setup
import { 
  RecoilRoot, 
  atom, 
  useRecoilState 
} from 'recoil';

// Define atom (piece of state)
const countState = atom({
  key: 'countState',
  default: 0
});

// Provider
function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}

// Component using Recoil
function Counter() {
  const [count, setCount] = useRecoilState(countState);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`
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
          State Management
        </Title>
        <p>Compare different approaches to managing state in React applications</p>
      </Header>

      <Content>
        <ExplanationBox>
          <h3>State Management in React</h3>
          <p>
            As React applications grow in complexity, managing state becomes increasingly challenging.
            This demo explores different state management approaches, from local component state to
            global state solutions.
          </p>
          <p>
            Understanding when to use each approach is key to building maintainable React applications.
            The right choice depends on your app's size, complexity, and specific requirements.
          </p>
        </ExplanationBox>
        
        <TabContainer>
          {Object.keys(tabs).map(tab => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tabs[tab].title}
            </Tab>
          ))}
        </TabContainer>
        
        <DemoCard>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoTitle>{tabs[activeTab].title}</DemoTitle>
              <p>{tabs[activeTab].description}</p>
              
              {activeTab === 'local' && (
                <GridContainer>
                  <div>
                    <h4>useState</h4>
                    <p>Simple state management for individual components</p>
                    <UseStateExample />
                    
                    <CodeSection>
                      <CodeContainer>
                        <SyntaxHighlighter 
                          language="jsx" 
                          style={tomorrow} 
                          showLineNumbers={true}
                          customStyle={{
                            background: 'transparent',
                            fontSize: '0.9rem',
                            padding: '1rem',
                            lineHeight: '1.5',
                            width: '100%'
                          }}
                        >
{`function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
                        </SyntaxHighlighter>
                      </CodeContainer>
                    </CodeSection>
                  </div>
                  
                  <div>
                    <h4>useReducer</h4>
                    <p>More complex state logic with actions and reducers</p>
                    <UseReducerExample />
                    
                    <CodeSection>
                      <CodeContainer>
                        <SyntaxHighlighter 
                          language="jsx" 
                          style={tomorrow} 
                          showLineNumbers={true}
                          customStyle={{
                            background: 'transparent',
                            fontSize: '0.9rem',
                            padding: '1rem',
                            lineHeight: '1.5',
                            width: '100%'
                          }}
                        >
{`function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
    </div>
  );
}`}
                        </SyntaxHighlighter>
                      </CodeContainer>
                    </CodeSection>
                  </div>
                </GridContainer>
              )}
              
              {activeTab === 'context' && (
                <div>
                  <p>React Context provides a way to share state between components without prop drilling.</p>
                  
                  <ContextProvider>
                    <ComponentBox name="ContextProvider">
                      <StateVisualizer>
                        {`{ count, increment, decrement, reset }`}
                      </StateVisualizer>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                          <ContextConsumerA />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                          <ContextConsumerB />
                        </div>
                      </div>
                    </ComponentBox>
                  </ContextProvider>
                  
                  <CodeSection>
                    <CodeTitle>Context Setup</CodeTitle>
                    <CodeContainer>
                      <SyntaxHighlighter 
                        language="jsx" 
                        style={tomorrow} 
                        showLineNumbers={true}
                        customStyle={{
                          background: 'transparent',
                          fontSize: '0.9rem',
                          padding: '1rem',
                          lineHeight: '1.5',
                          width: '100%'
                        }}
                      >
{`// Create context
const AppContext = createContext();

// Provider component
function AppProvider({ children }) {
  const [count, setCount] = useState(0);
  
  const contextValue = {
    count,
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
    reset: () => setCount(0)
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Consumer component
function Counter() {
  const { count, increment } = useContext(AppContext);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}`}
                      </SyntaxHighlighter>
                    </CodeContainer>
                  </CodeSection>
                </div>
              )}
              
              {activeTab === 'props' && (
                <div>
                  <p>Props drilling is passing state down through multiple component levels.</p>
                  
                  <PropsDrillingExample />
                  
                  <CodeSection>
                    <CodeTitle>Props Drilling Example</CodeTitle>
                    <CodeContainer>
                      <SyntaxHighlighter 
                        language="jsx" 
                        style={tomorrow} 
                        showLineNumbers={true}
                        customStyle={{
                          background: 'transparent',
                          fontSize: '0.9rem',
                          padding: '1rem',
                          lineHeight: '1.5',
                          width: '100%'
                        }}
                      >
{`function ParentComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent count={count} setCount={setCount} />
    </div>
  );
}

function ChildComponent({ count, setCount }) {
  return (
    <div>
      <p>Child received: {count}</p>
      <GrandchildComponent count={count} setCount={setCount} />
    </div>
  );
}

function GrandchildComponent({ count, setCount }) {
  return (
    <div>
      <p>Grandchild received: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`}
                      </SyntaxHighlighter>
                    </CodeContainer>
                  </CodeSection>
                </div>
              )}
              
              {activeTab === 'external' && (
                <div>
                  <p>External state management libraries provide more advanced features for complex applications.</p>
                  
                  <GridContainer>
                    <div>
                      <h4>Redux</h4>
                      <p>Predictable state container with centralized store and unidirectional data flow</p>
                      
                      <CodeSection>
                        <CodeContainer>
                          <SyntaxHighlighter 
                            language="jsx" 
                            style={tomorrow} 
                            showLineNumbers={true}
                            customStyle={{
                              background: 'transparent',
                              fontSize: '0.9rem',
                              padding: '1rem',
                              lineHeight: '1.5',
                              width: '100%'
                            }}
                          >
                            {externalLibrariesCode.redux}
                          </SyntaxHighlighter>
                        </CodeContainer>
                      </CodeSection>
                    </div>
                    
                    <div>
                      <h4>Zustand</h4>
                      <p>Simple, fast state management with minimal boilerplate</p>
                      
                      <CodeSection>
                        <CodeContainer>
                          <SyntaxHighlighter 
                            language="jsx" 
                            style={tomorrow} 
                            showLineNumbers={true}
                            customStyle={{
                              background: 'transparent',
                              fontSize: '0.9rem',
                              padding: '1rem',
                              lineHeight: '1.5',
                              width: '100%'
                            }}
                          >
                            {externalLibrariesCode.zustand}
                          </SyntaxHighlighter>
                        </CodeContainer>
                      </CodeSection>
                    </div>
                    
                    <div>
                      <h4>Recoil</h4>
                      <p>Facebook's experimental state management library with atomic model</p>
                      
                      <CodeSection>
                        <CodeContainer>
                          <SyntaxHighlighter 
                            language="jsx" 
                            style={tomorrow} 
                            showLineNumbers={true}
                            customStyle={{
                              background: 'transparent',
                              fontSize: '0.9rem',
                              padding: '1rem',
                              lineHeight: '1.5',
                              width: '100%'
                            }}
                          >
                            {externalLibrariesCode.recoil}
                          </SyntaxHighlighter>
                        </CodeContainer>
                      </CodeSection>
                    </div>
                  </GridContainer>
                  
                  <ExplanationBox style={{ marginTop: '2rem' }}>
                    <h3>When to use external libraries?</h3>
                    <ul>
                      <li><strong>Redux:</strong> Large applications with complex state, when you need time-travel debugging, middleware support, or a large ecosystem</li>
                      <li><strong>Zustand:</strong> When you want Redux-like state management with less boilerplate and simpler API</li>
                      <li><strong>Recoil:</strong> When you need fine-grained reactivity and state that can be split into smaller atoms</li>
                      <li><strong>Context + useReducer:</strong> Medium-sized applications where you don't need the extra features of external libraries</li>
                    </ul>
                  </ExplanationBox>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </DemoCard>
      </Content>
    </Container>
  );
}

export default StateManagementDemo; 