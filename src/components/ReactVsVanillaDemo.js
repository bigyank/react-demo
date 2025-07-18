import React, { useState, useEffect, useRef } from 'react';
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

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 1rem 0;
`;

const DemoTitle = styled.h3`
  color: #4ecdc4;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const DemoArea = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  min-height: 200px;
  border: 2px solid ${props => props.active ? '#4ecdc4' : 'transparent'};
  transition: border-color 0.3s ease;
  position: relative;
  overflow: hidden;
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
  margin: 2rem 0;
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
  min-height: 200px;
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

const TaskItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  ${props => props.isUpdating && `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: rgba(78, 205, 196, 0.3);
      border: 2px solid #4ecdc4;
      border-radius: 8px;
      pointer-events: none;
      z-index: 1;
      animation: updatePulse 0.6s ease-out;
    }
  `}
  
  @keyframes updatePulse {
    0% { opacity: 0; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

const TaskText = styled.span`
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.6 : 1};
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background: #ff5252;
  }
`;

const PerformanceMetric = styled.div`
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 5px;
  margin: 0.5rem 0;
  font-size: 0.8rem;
`;

const PerformanceBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
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
    background: ${props => props.color || '#4ecdc4'};
    border-radius: 3px;
    transition: width 0.5s ease;
  }
`;

const AnimatedElement = styled(motion.div)`
  position: relative;
  
  &.updating {
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: rgba(78, 205, 196, 0.3);
      border: 2px solid #4ecdc4;
      border-radius: 8px;
      pointer-events: none;
      z-index: 1;
    }
  }
`;

const TaskFormContainer = styled.div`
  margin-bottom: 1rem;
`;

const TaskInput = styled.input`
  padding: 0.75rem;
  border-radius: 25px;
  border: none;
  margin-right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 70%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
  }
`;

const CommentBox = styled.div`
  position: absolute;
  top: ${props => props.top || '10px'};
  right: ${props => props.right || '10px'};
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #4ecdc4;
  max-width: 150px;
  z-index: 5;
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
    margin-bottom: 0;
  }
`;

function ReactVsVanillaDemo() {
  // React state management
  const [reactTasks, setReactTasks] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [reactInput, setReactInput] = useState('');
  const [reactCounter, setReactCounter] = useState(0);
  
  // Performance metrics
  const [reactRenders, setReactRenders] = useState(0);
  const [vanillaRenders, setVanillaRenders] = useState(0);
  const [updatingReactElements, setUpdatingReactElements] = useState(new Set());
  const [updatingVanillaElements, setUpdatingVanillaElements] = useState(new Set());

  // Vanilla JS refs
  const vanillaContainerRef = useRef(null);
  const vanillaInputRef = useRef(null);
  const vanillaCounterRef = useRef(null);
  const vanillaTasksRef = useRef([
    { id: 1, text: 'Learn Vanilla JS', completed: false },
    { id: 2, text: 'Understand DOM manipulation', completed: false }
  ]);
  const vanillaCounterValue = useRef(0);

  // Initialize vanilla JS functionality
  useEffect(() => {
    if (vanillaContainerRef.current) {
      renderVanillaTasks();
      updateVanillaCounter();
    }
  }, []);

  // Helper function to show targeted animation
  const showElementUpdate = (elementType, elementId = null) => {
    const key = elementId ? `${elementType}-${elementId}` : elementType;
    setUpdatingReactElements(prev => new Set([...prev, key]));
    setTimeout(() => {
      setUpdatingReactElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 600);
  };

  // React functions with targeted visual indication
  const addReactTask = () => {
    if (reactInput.trim()) {
      const newTaskId = Date.now();
      setReactRenders(prev => prev + 1);
      setReactTasks([...reactTasks, {
        id: newTaskId,
        text: reactInput,
        completed: false
      }]);
      setReactInput('');
      // Only highlight the new task, not the entire container
      showElementUpdate('task', newTaskId);
    }
  };

  const toggleReactTask = (id) => {
    showElementUpdate('task', id);
    setReactRenders(prev => prev + 1);
    setReactTasks(reactTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteReactTask = (id) => {
    showElementUpdate('task', id);
    setReactRenders(prev => prev + 1);
    // Delay the actual removal to show the highlight animation first
    setTimeout(() => {
      setReactTasks(reactTasks.filter(task => task.id !== id));
    }, 300);
  };

  // Helper function for vanilla JS animations
  const showVanillaElementUpdate = (elementType) => {
    setUpdatingVanillaElements(prev => new Set([...prev, elementType]));
    setTimeout(() => {
      setUpdatingVanillaElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(elementType);
        return newSet;
      });
    }, 600);
  };

  // Vanilla JS functions with targeted visual indication
  const renderVanillaTasks = () => {
    if (!vanillaContainerRef.current) return;
    
    showVanillaElementUpdate('vanilla-tasks');
    setVanillaRenders(prev => prev + 1);
    
    const container = vanillaContainerRef.current.querySelector('.vanilla-tasks');
    if (!container) return;

    container.innerHTML = '';
    
    vanillaTasksRef.current.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      const taskText = document.createElement('span');
      taskText.textContent = task.text;
      taskText.style.cssText = `
        text-decoration: ${task.completed ? 'line-through' : 'none'};
        opacity: ${task.completed ? '0.6' : '1'};
        cursor: pointer;
      `;
      
      taskText.onclick = () => {
        task.completed = !task.completed;
        renderVanillaTasks();
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.cssText = `
        background: #ff6b6b;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
      `;
      
      deleteBtn.onclick = () => {
        vanillaTasksRef.current = vanillaTasksRef.current.filter(t => t.id !== task.id);
        renderVanillaTasks();
      };
      
      taskElement.appendChild(taskText);
      taskElement.appendChild(deleteBtn);
      container.appendChild(taskElement);
    });
  };

  const addVanillaTask = () => {
    if (!vanillaInputRef.current || !vanillaContainerRef.current) return;
    
    const inputValue = vanillaInputRef.current.value.trim();
    if (inputValue) {
      vanillaTasksRef.current.push({
        id: Date.now(),
        text: inputValue,
        completed: false
      });
      vanillaInputRef.current.value = '';
      renderVanillaTasks();
    }
  };

  const incrementReactCounter = () => {
    showElementUpdate('counter');
    setReactRenders(prev => prev + 1);
    setReactCounter(reactCounter + 1);
  };

  const incrementVanillaCounter = () => {
    if (!vanillaCounterRef.current) return;
    
    showVanillaElementUpdate('vanilla-counter');
    setVanillaRenders(prev => prev + 1);
    
    vanillaCounterValue.current += 1;
    updateVanillaCounter();
  };

  const updateVanillaCounter = () => {
    if (!vanillaCounterRef.current) return;
    vanillaCounterRef.current.textContent = vanillaCounterValue.current;
  };

  const reactCode = `// React Component
function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    setTasks([...tasks, {
      id: Date.now(),
      text: input,
      completed: false
    }]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      {tasks.map(task => (
        <div key={task.id} onClick={() => toggleTask(task.id)}>
          {task.text}
        </div>
      ))}
    </div>
  );
}`;

  const vanillaCode = `// Vanilla JavaScript
let tasks = [];
let taskIdCounter = 0;

function addTask() {
  const input = document.getElementById('taskInput');
  if (input.value.trim()) {
    tasks.push({
      id: ++taskIdCounter,
      text: input.value,
      completed: false
    });
    input.value = '';
    renderTasks();
  }
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

function renderTasks() {
  const container = document.getElementById('tasksContainer');
  container.innerHTML = '';
  
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.textContent = task.text;
    taskElement.onclick = () => toggleTask(task.id);
    taskElement.style.textDecoration = 
      task.completed ? 'line-through' : 'none';
    container.appendChild(taskElement);
  });
}`;

  return (
    <Container>
      <Header>
        <BackButton to="/">← Back to Home</BackButton>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          React vs. Vanilla JavaScript
        </Title>
        <p>Compare the same functionality built with React and Vanilla JS</p>
      </Header>

      <Content>
        <ExplanationBox>
          <h3>Interactive Comparison Demo</h3>
          <p>
            Compare how React and vanilla JavaScript handle UI updates differently.
            Watch the performance metrics and observe how React's declarative approach
            differs from vanilla JS's imperative approach.
          </p>
        </ExplanationBox>
      
        <ComparisonContainer>
          <DemoCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DemoTitle>React Implementation</DemoTitle>
            <p>Declarative, state-driven approach with automatic UI updates</p>
            
            <PerformanceMetric>
              <span>Re-renders: {reactRenders}</span>
              <span>Only updates what's changed</span>
            </PerformanceMetric>
            <PerformanceBar value={reactRenders * 10} color="#4ecdc4" />
            
            <DemoArea active={true} style={{ position: 'relative' }}>
              <CommentBox top="50px" right="20px">
                Updates only the changed elements
              </CommentBox>
              
              <TaskFormContainer>
                <TaskInput
                  type="text"
                  value={reactInput}
                  onChange={(e) => setReactInput(e.target.value)}
                  placeholder="Add a new task..."
                />
                <Button onClick={addReactTask}>Add</Button>
              </TaskFormContainer>
              
              <div>
                <AnimatePresence mode="popLayout">
                  {reactTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: updatingReactElements.has(`task-${task.id}`) ? [1, 1.05, 1] : 1
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      layout
                      isUpdating={updatingReactElements.has(`task-${task.id}`)}
                    >
                      <TaskText 
                        completed={task.completed}
                        onClick={() => toggleReactTask(task.id)}
                      >
                        {task.text}
                      </TaskText>
                      <DeleteButton onClick={() => deleteReactTask(task.id)}>×</DeleteButton>
                    </TaskItem>
                  ))}
                </AnimatePresence>
              </div>
              
              <AnimatedElement 
                style={{ marginTop: '1rem' }}
                className={updatingReactElements.has('counter') ? 'updating' : ''}
                animate={updatingReactElements.has('counter') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <p>Counter: {reactCounter}</p>
                <Button onClick={incrementReactCounter}>Increment</Button>
              </AnimatedElement>
            </DemoArea>
            
            <CodeSection>
              <CodeTitle>React Code</CodeTitle>
              <CodeContainer>
                <SyntaxHighlighter 
                  language="jsx" 
                  style={tomorrow} 
                  showLineNumbers={true}
                  wrapLines={false}
                  customStyle={{
                    background: 'transparent',
                    fontSize: '0.95rem',
                    padding: '1rem',
                    lineHeight: '1.5',
                    width: '100%'
                  }}
                >
{`// React - Declarative approach
const [tasks, setTasks] = useState([
  { id: 1, text: 'Learn React', completed: false }
]);
const [counter, setCounter] = useState(0);

// Add task function
const addTask = () => {
  setTasks([...tasks, {
    id: Date.now(),
    text: inputValue,
    completed: false
  }]);
};

const toggleTask = (id) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  ));
};

// UI updates automatically when state changes
return (
  <div>
    {tasks.map(task => (
      <div key={task.id} onClick={() => toggleTask(task.id)}>
        <span style={{
          textDecoration: task.completed ? 'line-through' : 'none'
        }}>
          {task.text}
        </span>
        <button onClick={() => deleteTask(task.id)}>×</button>
      </div>
    ))}
    <p>Counter: {counter}</p>
    <button onClick={() => setCounter(counter + 1)}>
      Increment
    </button>
  </div>
);`}
                </SyntaxHighlighter>
              </CodeContainer>
            </CodeSection>
          </DemoCard>
          
          {/* Add a divider between the cards */}
          <div style={{ 
            width: '100%', 
            height: '2px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            margin: '1rem 0' 
          }} />
          
          <DemoCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DemoTitle>Vanilla JavaScript Implementation</DemoTitle>
            <p>Imperative approach requiring manual DOM manipulation</p>
            
            <PerformanceMetric>
              <span>Re-renders: {vanillaRenders}</span>
              <span>Rebuilds entire list each time</span>
            </PerformanceMetric>
            <PerformanceBar value={vanillaRenders * 15} color="#ff6b6b" />
            
            <DemoArea ref={vanillaContainerRef}>
              <CommentBox top="50px" right="20px">
                Recreates entire list on each change
              </CommentBox>
              
              <div>
                <TaskInput
                  ref={vanillaInputRef}
                  type="text"
                  placeholder="Add a new task..."
                />
                <Button onClick={addVanillaTask}>Add</Button>
              </div>
              
              <AnimatedElement 
                className={updatingVanillaElements.has('vanilla-tasks') ? 'updating' : ''}
                animate={updatingVanillaElements.has('vanilla-tasks') ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="vanilla-tasks" style={{ minHeight: '100px' }}></div>
              </AnimatedElement>
              
              <AnimatedElement 
                style={{ marginTop: '1rem' }}
                className={updatingVanillaElements.has('vanilla-counter') ? 'updating' : ''}
                animate={updatingVanillaElements.has('vanilla-counter') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <p>Counter: <span ref={vanillaCounterRef}>0</span></p>
                <Button onClick={incrementVanillaCounter}>Increment</Button>
              </AnimatedElement>
            </DemoArea>
            
            <CodeSection>
              <CodeTitle>Vanilla JS Code</CodeTitle>
              <CodeContainer>
                <SyntaxHighlighter 
                  language="javascript" 
                  style={tomorrow} 
                  showLineNumbers={true}
                  wrapLines={false}
                  customStyle={{
                    background: 'transparent',
                    fontSize: '0.95rem',
                    padding: '1rem',
                    lineHeight: '1.5',
                    width: '100%'
                  }}
                >
{`// Vanilla JS - Imperative approach
const tasks = [
  { id: 1, text: 'Learn Vanilla JS', completed: false }
];
let counter = 0;

// Add task function - requires full DOM update
const addTask = () => {
  tasks.push({
    id: Date.now(),
    text: inputValue,
    completed: false
  });
  renderTasks(); // Must manually update DOM
};

const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks(); // Re-render entire list
  }
};

// Must rebuild entire list every time
function renderTasks() {
  const container = document.querySelector('.tasks');
  container.innerHTML = ''; // Clear everything first
  
  tasks.forEach(task => {
    const element = document.createElement('div');
    element.textContent = task.text;
    element.style.textDecoration = 
      task.completed ? 'line-through' : 'none';
    element.onclick = () => toggleTask(task.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => deleteTask(task.id);
    element.appendChild(deleteBtn);
    
    container.appendChild(element);
  });
}

const incrementCounter = () => {
  counter++;
  document.querySelector('.counter').textContent = counter;
};`}
                </SyntaxHighlighter>
              </CodeContainer>
            </CodeSection>
          </DemoCard>
        </ComparisonContainer>
      </Content>
    </Container>
  );
}

export default ReactVsVanillaDemo;