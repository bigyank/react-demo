import React, { useState, useContext } from 'react';
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const DemoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ComponentBox = styled(motion.div)`
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.borderColor || 'rgba(255, 255, 255, 0.3)'};
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem;
  text-align: center;
  position: relative;
  box-shadow: ${props => props.highlight ? '0 0 15px 5px rgba(255, 255, 255, 0.3)' : 'none'};
  transition: all 0.3s ease;
`;

const PropArrow = styled(motion.div)`
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid #ff6b6b;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  z-index: 10;
`;

const PropPath = styled(motion.div)`
  position: absolute;
  background-color: transparent;
  border-right: 3px dashed #ff6b6b;
  border-bottom: 3px dashed #ff6b6b;
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '100%'};
  right: -20px;
  top: 50%;
  z-index: 5;
`;

const PropLabel = styled(motion.div)`
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff6b6b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
  white-space: nowrap;
`;

const ControlPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  margin: 0.5rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 0.95rem;
  margin: 1rem 0;
  line-height: 1.5;
  max-height: 500px;
  border-left: 4px solid #4ecdc4;
  font-family: 'Fira Code', 'Courier New', monospace;
  white-space: pre;
  width: 100%;
  
  /* Add horizontal scrolling with visible scrollbar */
  &::-webkit-scrollbar {
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

const ExplanationBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-left: 4px solid #4ecdc4;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 5px 5px 0;
`;

const ContextBubble = styled(motion.div)`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 15;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ContextConnector = styled(motion.div)`
  position: absolute;
  border: 2px dashed #667eea;
  z-index: 5;
  ${props => props.position};
`;

const PropValue = styled(motion.div)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: #4ecdc4;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 10;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
`;

const SolutionTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? '#4ecdc4' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Component hierarchy for props drilling demo
const GrandParent = ({ userName, userAge, onUpdateUser, showProps, highlightComponent }) => (
  <ComponentBox 
    color="rgba(255, 107, 107, 0.2)" 
    borderColor="#ff6b6b"
    highlight={highlightComponent === 'grandparent'}
    animate={highlightComponent === 'grandparent' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👴 GrandParent Component</h3>
    <p>Has user data: {userName}, {userAge}</p>
    <Input 
      value={userName} 
      onChange={(e) => onUpdateUser(e.target.value, userAge)}
      placeholder="Update name"
    />
    <Input 
      type="number"
      value={userAge} 
      onChange={(e) => onUpdateUser(userName, parseInt(e.target.value) || 0)}
      placeholder="Update age"
    />
    
    <Parent userName={userName} userAge={userAge} onUpdateUser={onUpdateUser} showProps={showProps} highlightComponent={highlightComponent} />
    
    {showProps && (
      <>
        <PropArrow 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        <PropLabel
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          userName, userAge, onUpdateUser
        </PropLabel>
        <PropValue
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          name: "{userName}", age: {userAge}
        </PropValue>
      </>
    )}
  </ComponentBox>
);

const Parent = ({ userName, userAge, onUpdateUser, showProps, highlightComponent }) => (
  <ComponentBox 
    color="rgba(76, 201, 196, 0.2)" 
    borderColor="#4ecdc4"
    highlight={highlightComponent === 'parent'}
    animate={highlightComponent === 'parent' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👨‍👩‍👧‍👦 Parent Component</h3>
    <p>Just passes props down (doesn't use them)</p>
    
    <Child userName={userName} userAge={userAge} onUpdateUser={onUpdateUser} showProps={showProps} highlightComponent={highlightComponent} />
    
    {showProps && (
      <>
        <PropArrow 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        />
        <PropLabel
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          userName, userAge, onUpdateUser
        </PropLabel>
        <PropValue
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          ⬇️ passing through ⬇️
        </PropValue>
      </>
    )}
  </ComponentBox>
);

const Child = ({ userName, userAge, onUpdateUser, showProps, highlightComponent }) => (
  <ComponentBox 
    color="rgba(255, 193, 7, 0.2)" 
    borderColor="#ffc107"
    highlight={highlightComponent === 'child'}
    animate={highlightComponent === 'child' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👶 Child Component</h3>
    <p>Also just passes props down</p>
    
    <GrandChild userName={userName} userAge={userAge} onUpdateUser={onUpdateUser} showProps={showProps} highlightComponent={highlightComponent} />
    
    {showProps && (
      <>
        <PropArrow 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.0 }}
        />
        <PropLabel
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          userName, userAge, onUpdateUser
        </PropLabel>
        <PropValue
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          ⬇️ passing through ⬇️
        </PropValue>
      </>
    )}
  </ComponentBox>
);

const GrandChild = ({ userName, userAge, onUpdateUser, showProps, highlightComponent }) => (
  <ComponentBox 
    color="rgba(156, 39, 176, 0.2)" 
    borderColor="#9c27b0"
    highlight={highlightComponent === 'grandchild'}
    animate={highlightComponent === 'grandchild' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👼 GrandChild Component</h3>
    <p>Finally uses the data!</p>
    <p><strong>Hello {userName}!</strong></p>
    <p>You are {userAge} years old</p>
    <Button onClick={() => onUpdateUser(userName, userAge + 1)}>
      🎂 Happy Birthday!
    </Button>
    
    {showProps && (
      <PropValue
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        name: "{userName}", age: {userAge}
      </PropValue>
    )}
  </ComponentBox>
);

// Context solution components
const UserContext = React.createContext();

const ContextGrandParent = ({ userName, userAge, onUpdateUser, showContext, highlightComponent }) => (
  <UserContext.Provider value={{ userName, userAge, onUpdateUser }}>
    <ComponentBox 
      color="rgba(255, 107, 107, 0.2)" 
      borderColor="#ff6b6b"
      highlight={highlightComponent === 'context-grandparent'}
      animate={highlightComponent === 'context-grandparent' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <h3>👴 GrandParent (with Context)</h3>
      <p>Provides context to all children</p>
      <Input 
        value={userName} 
        onChange={(e) => onUpdateUser(e.target.value, userAge)}
        placeholder="Update name"
      />
      <Input 
        type="number"
        value={userAge} 
        onChange={(e) => onUpdateUser(userName, parseInt(e.target.value) || 0)}
        placeholder="Update age"
      />
      
      <ContextParent showContext={showContext} highlightComponent={highlightComponent} />
      
      {showContext && (
        <>
          <ContextBubble
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            C
          </ContextBubble>
          <PropValue
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Creating UserContext.Provider
          </PropValue>
        </>
      )}
    </ComponentBox>
  </UserContext.Provider>
);

const ContextParent = ({ showContext, highlightComponent }) => (
  <ComponentBox 
    color="rgba(76, 201, 196, 0.2)" 
    borderColor="#4ecdc4"
    highlight={highlightComponent === 'context-parent'}
    animate={highlightComponent === 'context-parent' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👨‍👩‍👧‍👦 Parent Component</h3>
    <p>No props! Just passes children through</p>
    
    <ContextChild showContext={showContext} highlightComponent={highlightComponent} />
    
    {showContext && (
      <PropValue
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        No props needed! 🎉
      </PropValue>
    )}
  </ComponentBox>
);

const ContextChild = ({ showContext, highlightComponent }) => (
  <ComponentBox 
    color="rgba(255, 193, 7, 0.2)" 
    borderColor="#ffc107"
    highlight={highlightComponent === 'context-child'}
    animate={highlightComponent === 'context-child' ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 0.5 }}
  >
    <h3>👶 Child Component</h3>
    <p>No props! Just renders children</p>
    
    <ContextGrandChild showContext={showContext} highlightComponent={highlightComponent} />
    
    {showContext && (
      <PropValue
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        No props needed! 🎉
      </PropValue>
    )}
  </ComponentBox>
);

const ContextGrandChild = ({ showContext, highlightComponent }) => {
  // Access context directly
  const { userName, userAge, onUpdateUser } = useContext(UserContext);
  
  return (
    <ComponentBox 
      color="rgba(156, 39, 176, 0.2)" 
      borderColor="#9c27b0"
      highlight={highlightComponent === 'context-grandchild'}
      animate={highlightComponent === 'context-grandchild' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <h3>👼 GrandChild Component</h3>
      <p>Uses context directly!</p>
      <p><strong>Hello {userName}!</strong></p>
      <p>You are {userAge} years old</p>
      <Button onClick={() => onUpdateUser(userName, userAge + 1)}>
        🎂 Happy Birthday!
      </Button>
      
      {showContext && (
        <>
          <ContextBubble
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            C
          </ContextBubble>
          <PropValue
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            useContext(UserContext) ✨
          </PropValue>
        </>
      )}
    </ComponentBox>
  );
};

function PropsDrillingDemo() {
  const [userName, setUserName] = useState('John');
  const [userAge, setUserAge] = useState(30);
  const [showProps, setShowProps] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [activeTab, setActiveTab] = useState('props');
  const [highlightComponent, setHighlightComponent] = useState(null);

  const updateUser = (name, age) => {
    setUserName(name);
    setUserAge(age);
  };
  
  const simulatePropsFlow = () => {
    // Clear any existing highlight
    setHighlightComponent(null);
    
    // Sequence through highlighting each component
    setTimeout(() => setHighlightComponent('grandparent'), 500);
    setTimeout(() => setHighlightComponent('parent'), 1500);
    setTimeout(() => setHighlightComponent('child'), 2500);
    setTimeout(() => setHighlightComponent('grandchild'), 3500);
    setTimeout(() => setHighlightComponent(null), 4500);
  };
  
  const simulateContextFlow = () => {
    // Clear any existing highlight
    setHighlightComponent(null);
    
    // Sequence through highlighting provider and consumer
    setTimeout(() => setHighlightComponent('context-grandparent'), 500);
    setTimeout(() => setHighlightComponent('context-grandchild'), 1500);
    setTimeout(() => setHighlightComponent(null), 2500);
  };

  return (
    <Container>
      <BackButton to="/">&larr; Back to Home</BackButton>
      
      <Title>Props Drilling vs. Context API</Title>
      
      <DemoCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>The Props Drilling Problem</h3>
        <p>Props drilling occurs when you pass props through multiple intermediate components that don't use those props.</p>
        
        <SolutionTabs>
          <Tab 
            active={activeTab === 'props'} 
            onClick={() => {
              setActiveTab('props');
              setHighlightComponent(null);
            }}
          >
            Props Drilling Example
          </Tab>
          <Tab 
            active={activeTab === 'context'} 
            onClick={() => {
              setActiveTab('context');
              setHighlightComponent(null);
            }}
          >
            Context API Solution
          </Tab>
        </SolutionTabs>
        
        <ControlPanel>
          {activeTab === 'props' ? (
            <>
              <Button onClick={() => setShowProps(!showProps)}>
                {showProps ? 'Hide Props Flow' : 'Show Props Flow'}
              </Button>
              <Button onClick={simulatePropsFlow}>
                Simulate Props Flow Animation
              </Button>
              <ExplanationBox>
                <p>In this example, user data is passed through Parent and Child components, even though they don't use it.</p>
                <p>The GrandChild component is the only one that actually needs the data.</p>
              </ExplanationBox>
              <div style={{ overflowX: 'auto', width: '100%', padding: '1rem 0' }}>
                <GrandParent 
                  userName={userName} 
                  userAge={userAge} 
                  onUpdateUser={updateUser}
                  showProps={showProps}
                  highlightComponent={highlightComponent}
                />
              </div>
            </>
          ) : (
            <>
              <Button onClick={() => setShowContext(!showContext)}>
                {showContext ? 'Hide Context Flow' : 'Show Context Flow'}
              </Button>
              <Button onClick={simulateContextFlow}>
                Simulate Context Flow Animation
              </Button>
              <ExplanationBox>
                <p>With Context API, the data is stored in a context at the top level.</p>
                <p>Components that need the data can consume it directly without props passing through intermediates.</p>
              </ExplanationBox>
              <div style={{ overflowX: 'auto', width: '100%', padding: '1rem 0' }}>
                <ContextGrandParent 
                  userName={userName} 
                  userAge={userAge} 
                  onUpdateUser={updateUser}
                  showContext={showContext}
                  highlightComponent={highlightComponent}
                />
              </div>
            </>
          )}
        </ControlPanel>
        
        <CodeBlock>
          {activeTab === 'props' ? (
`// Props Drilling Example

// Data must flow through every component level
function GrandParent({ userData, updateUser }) {
  // GrandParent has the data
  return (
    <div>
      <h3>GrandParent Component</h3>
      <Parent userData={userData} updateUser={updateUser} />
    </div>
  );
}

function Parent({ userData, updateUser }) {
  // Parent doesn't need the data, but must pass it down
  return (
    <div>
      <h3>Parent Component</h3>
      <Child userData={userData} updateUser={updateUser} />
    </div>
  );
}

function Child({ userData, updateUser }) {
  // Child doesn't need the data either, but must pass it down
  return (
    <div>
      <h3>Child Component</h3>
      <GrandChild userData={userData} updateUser={updateUser} />
    </div>
  );
}

function GrandChild({ userData, updateUser }) {
  // Finally uses the data!
  return (
    <div>
      <h3>GrandChild Component</h3>
      <p>Hello {userData.name}!</p>
      <button onClick={() => updateUser({...userData, age: userData.age + 1})}>
        Birthday
      </button>
    </div>
  );
}`
          ) : (
`// Context API Solution

// Create a context
const UserContext = React.createContext();

function GrandParent({ userData, updateUser }) {
  // GrandParent provides the context
  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      <div>
        <h3>GrandParent Component</h3>
        <Parent />
      </div>
    </UserContext.Provider>
  );
}

function Parent() {
  // Parent has no props to pass!
  return (
    <div>
      <h3>Parent Component</h3>
      <Child />
    </div>
  );
}

function Child() {
  // Child has no props to pass!
  return (
    <div>
      <h3>Child Component</h3>
      <GrandChild />
    </div>
  );
}

function GrandChild() {
  // Directly accesses the context
  const { userData, updateUser } = useContext(UserContext);
  
  return (
    <div>
      <h3>GrandChild Component</h3>
      <p>Hello {userData.name}!</p>
      <button onClick={() => updateUser({...userData, age: userData.age + 1})}>
        Birthday
      </button>
    </div>
  );
}`
          )}
        </CodeBlock>
      </DemoCard>
    </Container>
  );
}

export default PropsDrillingDemo;