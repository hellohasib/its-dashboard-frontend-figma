# Dark Mode Testing Guide

## Quick Start

To test the dark mode implementation:

```bash
cd traffic-system-frontend-figma
npm run dev
```

Then open http://localhost:5173 in your browser.

## Testing Checklist

### 1. Login Page
- [ ] Dark mode toggle appears in top-right corner
- [ ] Clicking toggle switches between light and dark modes
- [ ] Background, card, text, and input fields change appropriately
- [ ] Theme persists when refreshing the page

### 2. After Login - Header & Navigation
- [ ] Dark mode toggle appears next to user profile
- [ ] Header background and text colors change
- [ ] Navigation menu items (Resource Management, etc.) change colors
- [ ] Dropdown mega-menus support dark mode
- [ ] Category menus support dark mode

### 3. Sidebar
- [ ] Sidebar background changes
- [ ] Navigation icons change color
- [ ] Hover states work in both modes
- [ ] Active state indicator is visible

### 4. Main Content Area
- [ ] Page background changes
- [ ] Card components have dark backgrounds
- [ ] Text is readable in both modes

### 5. Tables
- [ ] Table headers have appropriate colors
- [ ] Table rows have proper backgrounds
- [ ] Borders are visible but subtle
- [ ] Hover states work correctly

### 6. Forms & Inputs
- [ ] Input fields have dark backgrounds
- [ ] Placeholder text is visible
- [ ] Labels are readable
- [ ] Focus states work properly

### 7. Buttons
- [ ] Primary buttons remain consistently styled
- [ ] Secondary buttons adapt to theme
- [ ] Outline buttons adapt to theme
- [ ] Hover states work in both modes

### 8. Modals & Dialogs
- [ ] Modal backgrounds are dark
- [ ] Modal headers and borders adapt
- [ ] Close button is visible
- [ ] Content inside modals is readable

### 9. User Dropdown
- [ ] Dropdown menu has dark background
- [ ] User info section is readable
- [ ] Menu items change on hover
- [ ] Borders are visible

### 10. Administration Pages (super_admin only)
Test these pages for dark mode support:
- [ ] User Management (`/users`)
- [ ] Role Management (`/roles`)
- [ ] Service Management (`/services`)
- [ ] Permission Management (`/permissions`)

### 11. Theme Persistence
- [ ] Refresh page - theme persists
- [ ] Close and reopen browser - theme persists
- [ ] Open in new tab - theme is consistent
- [ ] Logout and login - theme persists

### 12. System Preference Detection
- [ ] Change OS theme to dark - app detects it (on first load without saved preference)
- [ ] Change OS theme to light - app detects it (on first load without saved preference)
- [ ] Manual selection overrides system preference

## Browser Testing

Test in these browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

## Visual Testing

Look for:
- ✅ Smooth transitions when switching themes
- ✅ No flickering or flash of wrong theme
- ✅ All text is readable (good contrast)
- ✅ No missing styling (white boxes in dark mode)
- ✅ Borders are visible but not too prominent
- ✅ Icons are visible in both modes

## Common Issues to Check

### Text Contrast
- Verify all text has sufficient contrast in both modes
- Check gray text on gray backgrounds
- Ensure disabled states are distinguishable

### Borders & Dividers
- Make sure borders are visible in both modes
- Check that dividers don't disappear in dark mode

### Hover States
- Verify hover states are visible in both modes
- Check that hover effects provide clear feedback

### Icons & Graphics
- Ensure icons are visible in both modes
- Check that icon colors adapt appropriately

## Performance Testing

- [ ] Theme toggle is instant (no lag)
- [ ] Page load is not slower with dark mode
- [ ] No console errors related to theme

## Accessibility Testing

- [ ] Dark mode toggle has proper aria-label
- [ ] Theme change doesn't break keyboard navigation
- [ ] Screen readers announce theme changes appropriately
- [ ] Focus indicators are visible in both modes

## localStorage Testing

Open browser DevTools > Application > Local Storage:
- [ ] Check for `theme` key with value `light` or `dark`
- [ ] Delete the key and refresh - should detect system preference
- [ ] Change theme - key updates immediately

## Manual Test Scenarios

### Scenario 1: First-time User (Light System)
1. Clear localStorage
2. Set OS to light mode
3. Open app
4. Expected: App loads in light mode

### Scenario 2: First-time User (Dark System)
1. Clear localStorage
2. Set OS to dark mode
3. Open app
4. Expected: App loads in dark mode

### Scenario 3: Returning User
1. Set theme to dark
2. Close browser completely
3. Reopen and navigate to app
4. Expected: App loads in dark mode

### Scenario 4: Theme Override
1. Set OS to light mode
2. In app, switch to dark mode
3. Change OS to dark mode
4. Expected: App stays in dark mode (user preference takes precedence)

## Automated Testing (Future)

For CI/CD integration, consider adding:
- Visual regression tests (e.g., Percy, Chromatic)
- Screenshot comparison tests
- Contrast ratio validation tests

## Reporting Issues

If you find any issues, please report with:
1. Browser and version
2. OS and theme setting
3. Steps to reproduce
4. Screenshot (if visual issue)
5. Console errors (if any)

## Summary

The dark mode implementation should provide:
- ✅ Seamless theme switching
- ✅ Persistent user preference
- ✅ System preference detection
- ✅ Comprehensive component coverage
- ✅ Smooth transitions
- ✅ Good readability in both modes

