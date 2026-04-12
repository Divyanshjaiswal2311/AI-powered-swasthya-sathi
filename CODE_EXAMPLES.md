# 💻 Code Examples - How to Use Global Theme

## Example 1: Add Toggle to Header Component

**File:** `client/src/components/shared/Layout/Layout.js`

```javascript
import React from 'react';
import ThemeToggle from '../ThemeToggle';  // ADD THIS
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <>
      {/* Header with Theme Toggle */}
      <header className="header">
        <div className="header-left">
          <h1>Swasthya Sathi</h1>
          <nav>
            {/* Navigation items */}
          </nav>
        </div>
        
        {/* ADD THEME TOGGLE HERE */}
        <div className="header-right">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
```

---

## Example 2: Use Theme Hook in Component

**File:** `client/src/pages/SomePage.js`

```javascript
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';  // ADD THIS
import './SomePage.css';

const SomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();  // ADD THIS

  return (
    <div className="page">
      <h1>My Page</h1>
      
      {/* Show current mode */}
      <p>Current Theme: {isDarkMode ? '🌙 Dark' : '☀️ Light'}</p>
      
      {/* Custom toggle button */}
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      {/* Conditional rendering based on theme */}
      {isDarkMode && (
        <p style={{ color: 'var(--accent-color)' }}>
          You're using dark mode!
        </p>
      )}
    </div>
  );
};

export default SomePage;
```

---

## Example 3: Update CSS to Use Variables

**Before (Old - Light only):**
```css
.dashboard {
  background: #f5f7fa;
  color: #2c3e50;
  padding: 20px;
}

.dashboard-card {
  background: #ffffff;
  border: 1px solid #ecf0f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #2c3e50;
}

.dashboard-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dashboard h2 {
  color: #2c3e50;
}

.dashboard p {
  color: #7f8c8d;
}

.dashboard button {
  background: #3498db;
  color: white;
}

.dashboard button:hover {
  background: #2980b9;
}
```

**After (New - Light & Dark):**
```css
.dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  padding: 20px;
  transition: all 0.3s ease;  /* Smooth theme transition */
}

.dashboard-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 8px 24px var(--shadow-hover);
}

.dashboard h2 {
  color: var(--text-primary);
}

.dashboard p {
  color: var(--text-secondary);
}

.dashboard button {
  background: var(--accent-color);
  color: white;
}

.dashboard button:hover {
  background: var(--accent-dark);
}
```

---

## Example 4: Styled Header Layout

**File:** `client/src/styles/Layout.css`

```css
/* Header Styling */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.header-left h1 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Navigation */
.header nav {
  display: flex;
  gap: 2rem;
}

.header nav a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.header nav a:hover {
  color: var(--accent-color);
}

/* Main Content */
.main-content {
  background: var(--bg-main);
  color: var(--text-primary);
  transition: all 0.3s ease;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-left {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .header nav {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

---

## Example 5: All Available CSS Variables

```css
/* Use any of these in your CSS */
background: var(--bg-main);
background: var(--bg-card);
background: var(--bg-secondary);

color: var(--text-primary);
color: var(--text-secondary);
color: var(--text-tertiary);

border-color: var(--border-color);

background-color: var(--accent-color);
background-color: var(--accent-dark);

box-shadow: 0 2px 8px var(--shadow);
box-shadow: 0 8px 24px var(--shadow-hover);
```

---

## Example 6: Complex Component with Theme Support

**File:** `client/src/pages/Dashboard.js`

```javascript
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/shared/ThemeToggle';
import './Dashboard.css';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats] = useState([
    { title: 'Users', value: 1234 },
    { title: 'Donors', value: 567 },
    { title: 'Hospitals', value: 89 },
  ]);

  return (
    <div className="dashboard">
      {/* Header with toggle */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Theme Indicator */}
      <div className="theme-info">
        <p>
          Current Theme: <strong>{isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</strong>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
```

**CSS for Dashboard:**
```css
.dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  padding: 2rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 8px 24px var(--shadow-hover);
  transform: translateY(-4px);
}

.stat-card h3 {
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-value {
  color: var(--accent-color);
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.theme-info {
  background: var(--bg-card);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
  color: var(--text-primary);
}

.theme-info strong {
  color: var(--accent-color);
}
```

---

## Quick Copy-Paste Snippets

### Add to Any Page
```javascript
import { useTheme } from '../contexts/ThemeContext';

const { isDarkMode, toggleTheme } = useTheme();
```

### Add to Any CSS
```css
background: var(--bg-card);
color: var(--text-primary);
border: 1px solid var(--border-color);
box-shadow: 0 2px 8px var(--shadow);
```

### Add to Any Header
```javascript
import ThemeToggle from '../components/shared/ThemeToggle';

<ThemeToggle />
```

---

**That's it! Now your entire app supports light/dark mode! 🎉**

