# Dark Mode Implementation

## Overview
This document describes the dark mode implementation for the ITS Dashboard frontend application. The implementation provides a seamless theme switching experience with persistent user preferences.

## Features
- **Automatic Theme Detection**: Respects user's system preference (light/dark)
- **Manual Toggle**: Users can manually switch between light and dark modes
- **Persistent Preference**: Theme choice is saved to localStorage and persists across sessions
- **Smooth Transitions**: All theme changes include smooth CSS transitions
- **Comprehensive Coverage**: Dark mode styling applied to all components, pages, and layouts

## Architecture

### Core Components

#### 1. ThemeContext (`src/contexts/ThemeContext.tsx`)
- Manages global theme state
- Provides `theme`, `toggleTheme`, and `setTheme` functions
- Handles localStorage persistence
- Detects system preference on initial load
- Applies/removes `dark` class on document root

#### 2. DarkModeToggle (`src/components/DarkModeToggle.tsx`)
- Reusable toggle button component
- Shows moon icon in light mode, sun icon in dark mode
- Located in header (authenticated pages) and top-right (login page)

### Configuration

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
darkMode: 'class'
```
This enables class-based dark mode, controlled by the `dark` class on the root element.

#### CSS Variables (`index.css`)
```css
:root {
  color-scheme: light;
  --shadow-card: 0 1px 3px 0 rgba(166, 175, 195, 0.4);
}

.dark {
  color-scheme: dark;
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
}
```

## Color Palette

### Light Mode
- Background: `#F9FAFB` (gray)
- Card/Surface: `#FFFFFF` (white)
- Text Primary: `#111928` (dark)
- Text Secondary: `#637381` (primary-text)
- Border: `#DFE4EA` (stroke)

### Dark Mode
- Background: `#111928` (dark)
- Card/Surface: `#111928` (dark) / `#374151` (dark-dark3)
- Text Primary: `#E5E7EB` (gray-200)
- Text Secondary: `#9CA3AF` (gray-400)
- Border: `#374151` (gray-700)

## Component Updates

All major components have been updated with dark mode support:

### Layout Components
- `MainLayout`: Background and text colors
- `Header`: Background, borders, menu dropdowns, navigation items
- `Sidebar`: Background, borders, navigation items

### UI Components
- `Card`: Background, border, title color
- `Button`: All variants (primary, secondary, outline)
- `Input`: Background, border, text, placeholder colors
- `Table`: Headers, rows, borders, hover states
- `Modal`: Background, border, header, close button

### Feature Components
- `UserDropdown`: Dropdown menu, user info section, menu items
- `DarkModeToggle`: Theme toggle button (added to header)
- Badge components: StatusBadge, RoleBadge, PermissionBadge (already color-coded)

### Pages
- `Login`: Full dark mode support with theme toggle
- All other pages inherit dark mode from layout components

## Usage

### For Developers

#### Adding Dark Mode to New Components
Use Tailwind's `dark:` variant for dark mode styles:

```tsx
<div className="bg-white dark:bg-dark text-dark dark:text-gray-200">
  <h1 className="text-xl font-bold">Hello World</h1>
  <button className="bg-gray-100 dark:bg-dark-dark3 hover:bg-gray-200 dark:hover:bg-gray-700">
    Click Me
  </button>
</div>
```

#### Common Dark Mode Classes
- Backgrounds: `dark:bg-dark`, `dark:bg-dark-dark3`
- Text: `dark:text-gray-200`, `dark:text-gray-400`
- Borders: `dark:border-gray-700`
- Hover states: `dark:hover:bg-dark-dark3`

#### Using Theme Context
```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Force Dark</button>
    </div>
  );
};
```

### For Users

#### Switching Theme
1. **After Login**: Click the moon/sun icon in the top-right of the header
2. **On Login Page**: Click the moon/sun icon in the top-right corner

#### Theme Persistence
Your theme preference is automatically saved and will be remembered:
- Across browser sessions
- When you log out and log back in
- On different tabs of the same browser

## Technical Details

### localStorage Key
```javascript
localStorage.getItem('theme') // 'light' or 'dark'
```

### Theme Detection Priority
1. Saved preference in localStorage
2. System preference (`prefers-color-scheme`)
3. Default: light mode

### CSS Transitions
All color transitions use: `transition-colors` or `transition: background-color 0.2s ease-in-out`

## Testing Checklist

- [x] Theme toggle works in header
- [x] Theme toggle works on login page
- [x] Theme persists across page refreshes
- [x] Theme persists after logout/login
- [x] System preference detection works
- [x] All pages support dark mode
- [x] All components support dark mode
- [x] Modal dialogs support dark mode
- [x] Dropdown menus support dark mode
- [x] Forms and inputs support dark mode
- [x] Tables support dark mode
- [x] Badges and status indicators work in both modes

## Browser Compatibility

Dark mode is supported in all modern browsers that support:
- CSS custom properties (CSS variables)
- localStorage API
- Media queries (`prefers-color-scheme`)

## Performance

- **Initial Load**: Theme is applied synchronously on mount, no flash of wrong theme
- **Toggle Speed**: Instant, with smooth CSS transitions
- **Memory Impact**: Minimal (single state value + event listeners)

## Future Enhancements

Potential improvements for future versions:
- [ ] Auto-switch based on time of day
- [ ] Multiple theme options (beyond light/dark)
- [ ] Theme customization (accent colors)
- [ ] High contrast mode
- [ ] Theme preview before switching

## Troubleshooting

### Theme Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and try again: `localStorage.clear()`

### Flash of Wrong Theme
- Ensure ThemeProvider wraps the entire app in `main.tsx`
- Check that theme application in ThemeContext runs synchronously

### Styling Issues
- Verify all custom components use `dark:` variants
- Check for hardcoded colors that don't respect theme
- Use browser DevTools to inspect element classes in dark mode

## Related Files

### Core Implementation
- `/src/contexts/ThemeContext.tsx` - Theme state management
- `/src/components/DarkModeToggle.tsx` - Toggle button component
- `/src/main.tsx` - ThemeProvider wrapper
- `/tailwind.config.js` - Dark mode configuration
- `/src/index.css` - Dark mode CSS variables

### Updated Components
See the "Component Updates" section above for a comprehensive list.

## Support

For issues or questions about dark mode implementation, please contact the development team or create an issue in the project repository.

