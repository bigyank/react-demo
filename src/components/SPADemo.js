import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
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

  @media (max-width: 768px) {
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

const DemoTitle = styled.h2`
  margin-bottom: 1rem;
  color: #4ecdc4;
`;

const MockBrowser = styled.div`
  background: #2c3e50;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
`;

const BrowserBar = styled.div`
  background: #34495e;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BrowserDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const AddressBar = styled.div`
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.3rem 1rem;
  margin-left: 1rem;
  border-radius: 15px;
  flex: 1;
  font-size: 0.9rem;
`;

const BrowserContent = styled.div`
  background: white;
  color: #2c3e50;
  padding: 2rem;
  min-height: 200px;
  position: relative;
`;

const LoadingBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: #3498db;
  border-radius: 0 3px 3px 0;
`;

const PageContent = styled(motion.div)`
  h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#2980b9' : '#bdc3c7'};
  }
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(255, 255, 255, 0.2);
    font-weight: bold;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

function SPADemo() {
  const [traditionalPage, setTraditionalPage] = useState('home');
  const [spaPage, setSpaPage] = useState('home');
  const [traditionalLoading, setTraditionalLoading] = useState(false);

  const handleTraditionalNavigation = (page) => {
    setTraditionalLoading(true);
    setTimeout(() => {
      setTraditionalPage(page);
      setTraditionalLoading(false);
    }, 1500); // Simulate page load time
  };

  const pageContent = {
    home: {
      title: 'Home Page',
      content: 'Welcome to our website! This is the home page with some introductory content.'
    },
    about: {
      title: 'About Us',
      content: 'Learn more about our company and mission. We are dedicated to providing excellent service.'
    },
    contact: {
      title: 'Contact',
      content: 'Get in touch with us! Here you can find our contact information and contact form.'
    }
  };

  return (
    <Container>
      <BackButton to="/">← Back to Home</BackButton>
      
      <Title>SPA vs Traditional Web Applications</Title>
      
      <DemoSection>
        {/* Traditional App Demo */}
        <DemoCard
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DemoTitle>Traditional Multi-Page Application</DemoTitle>
          <p>Each navigation triggers a full page reload from the server.</p>
          
          <MockBrowser>
            <BrowserBar>
              <BrowserDot color="#ff5f57" />
              <BrowserDot color="#ffbd2e" />
              <BrowserDot color="#28ca42" />
              <AddressBar>https://traditional-app.com/{traditionalPage}</AddressBar>
            </BrowserBar>
            
            <BrowserContent>
              {traditionalLoading && (
                <LoadingBar
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5 }}
                />
              )}
              
              <NavigationButtons>
                <NavButton 
                  active={traditionalPage === 'home'}
                  onClick={() => handleTraditionalNavigation('home')}
                  disabled={traditionalLoading}
                >
                  Home
                </NavButton>
                <NavButton 
                  active={traditionalPage === 'about'}
                  onClick={() => handleTraditionalNavigation('about')}
                  disabled={traditionalLoading}
                >
                  About
                </NavButton>
                <NavButton 
                  active={traditionalPage === 'contact'}
                  onClick={() => handleTraditionalNavigation('contact')}
                  disabled={traditionalLoading}
                >
                  Contact
                </NavButton>
              </NavigationButtons>
              
              {!traditionalLoading && (
                <PageContent
                  key={traditionalPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{pageContent[traditionalPage].title}</h3>
                  <p>{pageContent[traditionalPage].content}</p>
                </PageContent>
              )}
              
              {traditionalLoading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>Loading new page from server...</p>
                </div>
              )}
            </BrowserContent>
          </MockBrowser>
          
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            <strong>What happens:</strong>
            <ul>
              <li>Full page refresh on navigation</li>
              <li>Server sends complete HTML for each page</li>
              <li>Browser reloads all resources (CSS, JS, images)</li>
              <li>Slower navigation experience</li>
            </ul>
          </div>
        </DemoCard>

        {/* SPA Demo */}
        <DemoCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DemoTitle>Single Page Application (SPA)</DemoTitle>
          <p>Navigation happens instantly without page reloads.</p>
          
          <MockBrowser>
            <BrowserBar>
              <BrowserDot color="#ff5f57" />
              <BrowserDot color="#ffbd2e" />
              <BrowserDot color="#28ca42" />
              <AddressBar>https://spa-app.com/{spaPage}</AddressBar>
            </BrowserBar>
            
            <BrowserContent>
              <NavigationButtons>
                <NavButton 
                  active={spaPage === 'home'}
                  onClick={() => setSpaPage('home')}
                >
                  Home
                </NavButton>
                <NavButton 
                  active={spaPage === 'about'}
                  onClick={() => setSpaPage('about')}
                >
                  About
                </NavButton>
                <NavButton 
                  active={spaPage === 'contact'}
                  onClick={() => setSpaPage('contact')}
                >
                  Contact
                </NavButton>
              </NavigationButtons>
              
              <AnimatePresence mode="wait">
                <PageContent
                  key={spaPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>{pageContent[spaPage].title}</h3>
                  <p>{pageContent[spaPage].content}</p>
                </PageContent>
              </AnimatePresence>
            </BrowserContent>
          </MockBrowser>
          
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            <strong>What happens:</strong>
            <ul>
              <li>No page refresh - instant navigation</li>
              <li>JavaScript updates only the content that changes</li>
              <li>Resources loaded once at the beginning</li>
              <li>Smooth, app-like user experience</li>
            </ul>
          </div>
        </DemoCard>
      </DemoSection>

      <ComparisonTable>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Traditional App</th>
            <th>Single Page App (SPA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Page Loading</strong></td>
            <td>Full page reload for each navigation</td>
            <td>Initial load, then dynamic content updates</td>
          </tr>
          <tr>
            <td><strong>Performance</strong></td>
            <td>Slower navigation, repeated resource loading</td>
            <td>Faster navigation after initial load</td>
          </tr>
          <tr>
            <td><strong>User Experience</strong></td>
            <td>Page flickers, loading states</td>
            <td>Smooth, app-like experience</td>
          </tr>
          <tr>
            <td><strong>SEO</strong></td>
            <td>Better out-of-the-box SEO</td>
            <td>Requires additional setup for SEO</td>
          </tr>
          <tr>
            <td><strong>Initial Load Time</strong></td>
            <td>Faster first page load</td>
            <td>Slower initial load (downloads entire app)</td>
          </tr>
          <tr>
            <td><strong>Complexity</strong></td>
            <td>Simpler server-side architecture</td>
            <td>More complex client-side state management</td>
          </tr>
        </tbody>
      </ComparisonTable>
    </Container>
  );
}

export default SPADemo;