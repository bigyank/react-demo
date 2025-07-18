import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import './App.css';

// Import our learning modules
import SPADemo from './components/SPADemo';
import JSXDemo from './components/JSXDemo';
import VirtualDOMDemo from './components/VirtualDOMDemo';
import ReactVsVanillaDemo from './components/ReactVsVanillaDemo';
import StatePassingDemo from './components/StatePassingDemo';
import ControlledUncontrolledDemo from './components/ControlledUncontrolledDemo';
import PropsDrillingDemo from './components/PropsDrillingDemo';
import ComponentLifecycleDemo from './components/ComponentLifecycleDemo';
import HooksDemo from './components/HooksDemo';
import StateManagementDemo from './components/StateManagementDemo';

const AppContainer = styled.div`
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
  font-size: 3rem;
  margin: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0;
  opacity: 0.9;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
`;

const NavCard = styled(motion(Link))`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-decoration: none;
  color: white;
  min-width: 200px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

function HomePage() {
  const modules = [
    {
      path: '/react-vs-vanilla',
      title: '1. React vs Vanilla JS',
      description: 'Compare React with plain JavaScript to see the benefits of using a framework'
    },
    {
      path: '/spa-demo',
      title: '2. SPA vs Traditional Apps',
      description: 'Learn the difference between Single Page Applications and traditional multi-page websites'
    },
    {
      path: '/jsx-demo',
      title: '3. JSX Under the Hood',
      description: 'Discover how JSX transforms into JavaScript and why it makes React development easier'
    },
    {
      path: '/component-lifecycle',
      title: '4. Component Lifecycle',
      description: 'Explore React component lifecycle methods and how useEffect works in functional components'
    },
    {
      path: '/state-passing-demo',
      title: '5. State Passing & Re-rendering',
      description: 'Learn how state flows between components and triggers re-renders with visual feedback'
    },
    {
      path: '/controlled-uncontrolled-demo',
      title: '6. Controlled vs Uncontrolled',
      description: 'Understand the difference between controlled and uncontrolled components with interactive examples'
    },
    {
      path: '/props-drilling-demo',
      title: '7. Props Drilling Problem',
      description: 'See the props drilling problem in action and learn solutions like Context API'
    },
    {
      path: '/hooks-demo',
      title: '8. React Hooks',
      description: 'Master essential hooks like useState, useEffect, useContext, useMemo, and useCallback'
    },
    {
      path: '/state-management',
      title: '9. State Management',
      description: 'Compare built-in state management with external solutions like Redux and Zustand'
    }
  ];

  return (
    <>
      <Header>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          React Learning Lab
        </Title>
        <Subtitle>Interactive Visual Learning for React Fundamentals</Subtitle>
      </Header>
      
      <Navigation>
        {modules.map((module, index) => (
          <NavCard
            key={module.path}
            to={module.path}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </NavCard>
        ))}
      </Navigation>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spa-demo" element={<SPADemo />} />
          <Route path="/jsx-demo" element={<JSXDemo />} />
          <Route path="/virtual-dom-demo" element={<VirtualDOMDemo />} />
          <Route path="/react-vs-vanilla" element={<ReactVsVanillaDemo />} />
          <Route path="/state-passing-demo" element={<StatePassingDemo />} />
          <Route path="/controlled-uncontrolled-demo" element={<ControlledUncontrolledDemo />} />
          <Route path="/props-drilling-demo" element={<PropsDrillingDemo />} />
          <Route path="/component-lifecycle" element={<ComponentLifecycleDemo />} />
          <Route path="/hooks-demo" element={<HooksDemo />} />
          <Route path="/state-management" element={<StateManagementDemo />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
