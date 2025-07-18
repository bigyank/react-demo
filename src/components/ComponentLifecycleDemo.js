import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 1rem 0;
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
`;

const EventLog = styled.div`
  max-height: 400px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const EventItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  border-left: 3px solid #4ecdc4;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#4ecdc4' : 'transparent'};
  color: white;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CodeContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 4px solid #4ecdc4;
  margin: 1rem 0;
  overflow: auto;
  
  & > pre {
    margin: 0 !important;
    padding: 1rem !important;
  }
`;

const ComponentContainer = styled.div`
  padding: 1.5rem;
  background: ${props => props.$type === 'class' 
    ? 'rgba(255, 107, 107, 0.1)' 
    : 'rgba(78, 205, 196, 0.1)'};
  border: 2px solid ${props => props.$type === 'class' 
    ? 'rgba(255, 107, 107, 0.3)' 
    : 'rgba(78, 205, 196, 0.3)'};
  border-radius: 12px;
  margin: 1rem 0;
  
  h4 {
    margin: 0 0 1rem 0;
    color: ${props => props.$type === 'class' ? '#ff6b6b' : '#4ecdc4'};
  }
  
  div {
    margin: 0.5rem 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const EventCounter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  span {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const PhaseIndicator = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.5rem;
  background: ${props => {
    switch(props.$phase) {
      case 'constructor': return '#ff6b6b';
      case 'componentDidMount':
      case 'useEffect[]': return '#ffbe0b';
      case 'componentDidUpdate':
      case 'useEffect[count]':
      case 'useEffect[data]': return '#8338ec';
      case 'componentWillUnmount':
      case 'useEffect[] cleanup': return '#fb5607';
      default: return '#4ecdc4';
    }
  }};
  color: white;
`;

// Event Logger Context
const EventLoggerContext = React.createContext();

// Custom hook for logging events
const useEventLogger = () => {
  const context = React.useContext(EventLoggerContext);
  if (!context) {
    throw new Error('useEventLogger must be used within EventLoggerProvider');
  }
  return context;
};

// Class Component Demo
class ClassLifecycleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      count: 0,
      data: null,
      error: null
    };
    this.logEvent('constructor', 'Component instance created');
  }
  
  logEvent = (phase, message) => {
    this.props.logger.addEvent('Class Component', phase, message);
  };
  
  componentDidMount() {
    this.logEvent('componentDidMount', 'Component mounted to DOM');
    
    // Simulate API call
    setTimeout(() => {
      this.setState({ data: 'Loaded data from API' });
    }, 1000);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      this.logEvent('componentDidUpdate', `Count changed from ${prevState.count} to ${this.state.count}`);
    }
    if (prevState.data !== this.state.data && this.state.data) {
      this.logEvent('componentDidUpdate', 'Data loaded successfully');
    }
  }
  
  componentWillUnmount() {
    this.logEvent('componentWillUnmount', 'Cleaning up before unmount');
  }
  
  handleIncrement = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }));
  };
  
  handleError = () => {
    this.setState({ error: 'Simulated error occurred' });
  };
  
  render() {
    const { count, data, error } = this.state;
    
    return (
      <ComponentContainer $type="class">
        <h4>Class Component</h4>
        <div>Count: {count}</div>
        <div>Data: {data || 'Loading...'}</div>
        {error && <div style={{ color: '#ff6b6b' }}>Error: {error}</div>}
        <ButtonGroup>
          <Button onClick={this.handleIncrement}>Increment</Button>
          <Button onClick={this.handleError}>Trigger Error</Button>
        </ButtonGroup>
      </ComponentContainer>
    );
  }
}

// Functional Component Demo
function FunctionalLifecycleComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { addEvent } = useEventLogger();
  
  const logEvent = useCallback((phase, message) => {
    addEvent('Functional Component', phase, message);
  }, [addEvent]);
  
  // Mount effect
  useEffect(() => {
    logEvent('useEffect[]', 'Component mounted');
    
    // Simulate API call
    const timer = setTimeout(() => {
      setData('Loaded data from API');
    }, 1000);
    
    return () => {
      logEvent('useEffect[] cleanup', 'Cleaning up mount effect');
      clearTimeout(timer);
    };
  }, [logEvent]);
  
  // Count effect
  useEffect(() => {
    if (count > 0) {
      logEvent('useEffect[count]', `Count updated to ${count}`);
    }
  }, [count, logEvent]);
  
  // Data effect
  useEffect(() => {
    if (data) {
      logEvent('useEffect[data]', 'Data loaded successfully');
    }
  }, [data, logEvent]);
  
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  const handleError = () => {
    setError('Simulated error occurred');
  };
  
  return (
    <ComponentContainer $type="functional">
      <h4>Functional Component</h4>
      <div>Count: {count}</div>
      <div>Data: {data || 'Loading...'}</div>
      {error && <div style={{ color: '#ff6b6b' }}>Error: {error}</div>}
      <ButtonGroup>
        <Button onClick={handleIncrement}>Increment</Button>
        <Button onClick={handleError}>Trigger Error</Button>
      </ButtonGroup>
    </ComponentContainer>
  );
}

function ComponentLifecycleDemo() {
  const [events, setEvents] = useState([]);
  const [showClass, setShowClass] = useState(false);
  const [showFunc, setShowFunc] = useState(false);
  const [activeTab, setActiveTab] = useState('demo');
  const eventIdRef = useRef(0);
  
  // Stable event logger
  const eventLogger = {
    addEvent: useCallback((componentType, phase, message) => {
      const newEvent = {
        id: ++eventIdRef.current,
        componentType,
        phase,
        message,
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString()
      };
      
      setEvents(prevEvents => [newEvent, ...prevEvents.slice(0, 19)]);
    }, [])
  };
  
  const clearEvents = () => {
    setEvents([]);
    eventIdRef.current = 0;
  };
  
  const getEventStats = () => {
    const classEvents = events.filter(e => e.componentType === 'Class Component').length;
    const funcEvents = events.filter(e => e.componentType === 'Functional Component').length;
    return { classEvents, funcEvents, total: events.length };
  };

  const classCode = `class LifecycleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      count: 0,
      data: null,
      error: null
    };
    // Constructor: Component instance created
    this.logEvent('constructor', 'Component instance created');
  }
  
  componentDidMount() {
    // Mount: Component added to DOM
    this.logEvent('componentDidMount', 'Component mounted to DOM');
    
    // Perfect place for API calls
    this.fetchData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    // Update: Component re-rendered due to state/props change
    if (prevState.count !== this.state.count) {
      this.logEvent('componentDidUpdate', 
        \`Count changed from \${prevState.count} to \${this.state.count}\`);
    }
  }
  
  componentWillUnmount() {
    // Unmount: Component about to be removed
    this.logEvent('componentWillUnmount', 'Cleaning up before unmount');
    // Clean up timers, subscriptions, etc.
  }
  
  fetchData = async () => {
    try {
      const data = await api.getData();
      this.setState({ data });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <p>Data: {this.state.data || 'Loading...'}</p>
        <button onClick={() => this.setState(prev => ({ 
          count: prev.count + 1 
        }))}>
          Increment
        </button>
      </div>
    );
  }
}`;

  const functionalCode = `function LifecycleComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Mount Effect (componentDidMount + componentWillUnmount)
  useEffect(() => {
    console.log('Component mounted');
    
    // API call on mount
    fetchData();
    
    // Cleanup function (componentWillUnmount equivalent)
    return () => {
      console.log('Component will unmount');
      // Clean up subscriptions, timers, etc.
    };
  }, []); // Empty deps = runs once on mount
  
  // Count Effect (componentDidUpdate for count)
  useEffect(() => {
    if (count > 0) {
      console.log(\`Count updated to \${count}\`);
    }
  }, [count]); // Runs when count changes
  
  // Data Effect (componentDidUpdate for data)
  useEffect(() => {
    if (data) {
      console.log('Data loaded successfully');
    }
  }, [data]); // Runs when data changes
  
  const fetchData = async () => {
    try {
      const result = await api.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Data: {data || 'Loading...'}</p>
      <button onClick={() => setCount(prev => prev + 1)}>
        Increment
      </button>
    </div>
  );
}`;

  return (
    <Container>
      <Header>
        <BackButton to="/">&larr; Back to Home</BackButton>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Component Lifecycle
        </Title>
        <p>Understanding React component lifecycle methods and hooks</p>
      </Header>

      <Content>
        <TabContainer>
          <Tab $active={activeTab === 'demo'} onClick={() => setActiveTab('demo')}>
            Interactive Demo
          </Tab>
          <Tab $active={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')}>
            Lifecycle Phases
          </Tab>
          <Tab $active={activeTab === 'code'} onClick={() => setActiveTab('code')}>
            Code Examples
          </Tab>
        </TabContainer>
        
        <AnimatePresence mode="wait">
          {activeTab === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventLoggerContext.Provider value={eventLogger}>
                <DemoCard>
                  <h3>Interactive Lifecycle Demo</h3>
                  <p>Mount and unmount components to see their lifecycle events in real-time. Each component demonstrates different lifecycle phases and effects.</p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <Button onClick={() => setShowClass(!showClass)}>
                      {showClass ? 'Unmount' : 'Mount'} Class Component
                    </Button>
                    <Button onClick={() => setShowFunc(!showFunc)}>
                      {showFunc ? 'Unmount' : 'Mount'} Functional Component
                    </Button>
                    <Button onClick={clearEvents}>Clear Events</Button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <h4>Class Component Demo</h4>
                      <AnimatePresence>
                        {showClass && (
                          <motion.div
                            key="class"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ClassLifecycleComponent logger={eventLogger} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!showClass && (
                        <ComponentContainer $type="class" style={{ opacity: 0.5, textAlign: 'center' }}>
                          <h4>Class Component</h4>
                          <div>Component not mounted</div>
                          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                            Click "Mount Class Component" to see lifecycle events
                          </div>
                        </ComponentContainer>
                      )}
                    </div>
                    
                    <div>
                      <h4>Functional Component Demo</h4>
                      <AnimatePresence>
                        {showFunc && (
                          <motion.div
                            key="func"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FunctionalLifecycleComponent />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!showFunc && (
                        <ComponentContainer $type="functional" style={{ opacity: 0.5, textAlign: 'center' }}>
                          <h4>Functional Component</h4>
                          <div>Component not mounted</div>
                          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                            Click "Mount Functional Component" to see useEffect hooks
                          </div>
                        </ComponentContainer>
                      )}
                    </div>
                  </div>
                  
                  <h4>Lifecycle Events Log</h4>
                  <EventCounter>
                    <span>Total Events: {getEventStats().total}</span>
                    <span>Class: {getEventStats().classEvents} | Functional: {getEventStats().funcEvents}</span>
                  </EventCounter>
                  
                  <EventLog>
                    <AnimatePresence>
                      {events.map(event => (
                        <EventItem
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <PhaseIndicator $phase={event.phase}>
                              {event.phase}
                            </PhaseIndicator>
                            <strong>[{event.componentType}]</strong> {event.message}
                          </div>
                          <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{event.time}</div>
                        </EventItem>
                      ))}
                    </AnimatePresence>
                    {events.length === 0 && (
                      <div style={{ textAlign: 'center', opacity: 0.7, padding: '2rem 0' }}>
                        No events yet. Mount a component to see lifecycle events.
                      </div>
                    )}
                  </EventLog>
                </DemoCard>
              </EventLoggerContext.Provider>
            </motion.div>
          )}
          
          {activeTab === 'explanation' && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoCard>
                <h3>React Component Lifecycle Phases</h3>
                <p>Understanding when and why lifecycle methods are called is crucial for building efficient React applications.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'rgba(255, 190, 11, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '2px solid rgba(255, 190, 11, 0.3)' }}>
                    <h4 style={{ color: '#ffbe0b', margin: '0 0 1rem 0' }}>🚀 Mounting Phase</h4>
                    <p>When a component is being created and inserted into the DOM for the first time.</p>
                    
                    <h5 style={{ color: '#ff6b6b', marginTop: '1rem' }}>Class Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>constructor()</strong> - Initialize state and bind methods</li>
                      <li><strong>render()</strong> - Return JSX to describe UI</li>
                      <li><strong>componentDidMount()</strong> - Component is now in DOM</li>
                    </ul>
                    
                    <h5 style={{ color: '#4ecdc4', marginTop: '1rem' }}>Functional Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>useEffect(() =&gt; {}, [])</strong> - Runs once after mount</li>
                      <li>Perfect for API calls, subscriptions, DOM manipulation</li>
                    </ul>
                  </div>
                  
                  <div style={{ background: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
                    <h4 style={{ color: '#8338ec', margin: '0 0 1rem 0' }}>🔄 Updating Phase</h4>
                    <p>When a component's props or state change, causing a re-render.</p>
                    
                    <h5 style={{ color: '#ff6b6b', marginTop: '1rem' }}>Class Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>render()</strong> - Re-render with new data</li>
                      <li><strong>componentDidUpdate()</strong> - After update is applied</li>
                      <li>Access to previous props/state for comparison</li>
                    </ul>
                    
                    <h5 style={{ color: '#4ecdc4', marginTop: '1rem' }}>Functional Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>useEffect(() =&gt; {}, [deps])</strong> - Runs when dependencies change</li>
                      <li>Separate effects for different state/props</li>
                    </ul>
                  </div>
                  
                  <div style={{ background: 'rgba(251, 86, 7, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '2px solid rgba(251, 86, 7, 0.3)' }}>
                    <h4 style={{ color: '#fb5607', margin: '0 0 1rem 0' }}>💀 Unmounting Phase</h4>
                    <p>When a component is being removed from the DOM.</p>
                    
                    <h5 style={{ color: '#ff6b6b', marginTop: '1rem' }}>Class Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>componentWillUnmount()</strong> - Cleanup before removal</li>
                      <li>Cancel timers, subscriptions, network requests</li>
                    </ul>
                    
                    <h5 style={{ color: '#4ecdc4', marginTop: '1rem' }}>Functional Components:</h5>
                    <ul style={{ margin: '0.5rem 0' }}>
                      <li><strong>useEffect cleanup function</strong> - Return function from useEffect</li>
                      <li>Automatically called when component unmounts</li>
                    </ul>
                  </div>
                </div>
                
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 1rem 0' }}>💡 Best Practices</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h5>✅ Do:</h5>
                      <ul>
                        <li>Use componentDidMount/useEffect[] for API calls</li>
                        <li>Clean up subscriptions in componentWillUnmount/cleanup</li>
                        <li>Compare previous state/props before making changes</li>
                        <li>Use multiple useEffect hooks for different concerns</li>
                      </ul>
                    </div>
                    <div>
                      <h5>❌ Don't:</h5>
                      <ul>
                        <li>Call setState in componentDidUpdate without conditions</li>
                        <li>Forget to clean up timers and subscriptions</li>
                        <li>Make API calls in render method</li>
                        <li>Use componentWillMount (deprecated)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DemoCard>
            </motion.div>
          )}
          
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DemoCard>
                <h3>Code Examples</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4>Class Component</h4>
                    <CodeContainer>
                      <SyntaxHighlighter 
                        language="jsx" 
                        style={tomorrow} 
                        showLineNumbers={true}
                        customStyle={{
                          background: 'transparent',
                          fontSize: '0.9rem',
                          padding: '1rem'
                        }}
                      >
                        {classCode}
                      </SyntaxHighlighter>
                    </CodeContainer>
                  </div>
                  
                  <div>
                    <h4>Functional Component</h4>
                    <CodeContainer>
                      <SyntaxHighlighter 
                        language="jsx" 
                        style={tomorrow} 
                        showLineNumbers={true}
                        customStyle={{
                          background: 'transparent',
                          fontSize: '0.9rem',
                          padding: '1rem'
                        }}
                      >
                        {functionalCode}
                      </SyntaxHighlighter>
                    </CodeContainer>
                  </div>
                </div>
              </DemoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Content>
    </Container>
  );
}

export default ComponentLifecycleDemo;