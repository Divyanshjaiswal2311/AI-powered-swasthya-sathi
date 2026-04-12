# 🎯 Quick Start: Add Theme Toggle to Your App

## Step 1: Find Your Layout/Header Component

Usually located at: `client/src/components/shared/Layout/Layout.js`

## Step 2: Add Import at the Top

```javascript
import ThemeToggle from '../ThemeToggle';
```

## Step 3: Add to JSX (in Header/Navbar)

Place this in your header/navbar, typically in the top-right:

```javascript
<header className="header">
  <div className="header-content">
    {/* Your logo and navigation */}
    <nav>
      {/* Navigation items */}
    </nav>
  </div>
  
  {/* Add this line - Theme Toggle */}
  <ThemeToggle />
</header>
```

## Step 4: (Optional) Style the Header

If you want to position the toggle better, add to your Layout.css:

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-card);
  box-shadow: 0 2px 8px var(--shadow);
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2rem;
}
```

## Step 5: Test It!

1. Open your app
2. Look for the Moon/Sun icon in the header
3. Click it to toggle between light and dark modes
4. Refresh the page - your preference should be saved!

---

## 🎨 Bonus: Update Your CSS Files to Use Variables

To make other pages also support dark mode, replace hardcoded colors with variables:

### Before (Light only)
```css
.my-component {
  background: #ffffff;
  color: #2c3e50;
  border: 1px solid #ecf0f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

### After (Light & Dark)
```css
.my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow);
}
```

---

## 📚 Available CSS Variables

```
Colors:
  --bg-main              /* Main background (gradient) */
  --bg-card              /* Card/container background */
  --bg-secondary         /* Secondary background */
  --text-primary         /* Main text */
  --text-secondary       /* Secondary text */
  --text-tertiary        /* Tertiary text */
  --border-color         /* Border color */
  --accent-color         /* Primary accent color */
  --accent-dark          /* Darker accent variant */
  --shadow               /* Light shadow */
  --shadow-hover         /* Hover shadow */
```

---

## ✅ Done!

Your app now has a fully functional global light/dark mode system!

**Features:**
✅ Toggle works across all pages
✅ Theme preference is saved
✅ No flash on page load
✅ Beautiful smooth transitions
✅ Responsive on all devices

