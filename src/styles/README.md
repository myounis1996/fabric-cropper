# CSS Architecture

This directory contains the modular CSS structure for the Fabric.js Cropper.

## File Structure

```
src/styles/
├── main.css              # Main entry point - imports all other files
├── variables.css         # CSS custom properties and base styles
├── layout.css           # Layout and typography styles
├── crop-panel.css       # Crop settings panel styles
├── buttons.css          # Button component styles
├── upload-panel.css     # Image upload panel styles
├── loading.css          # Loading states and animations
├── responsive.css       # Responsive design rules
└── README.md           # This file
```

## Import Order

The `main.css` file imports the CSS files in a specific order to ensure proper cascading:

1. **variables.css** - CSS custom properties and base styles
2. **layout.css** - Layout and typography
3. **crop-panel.css** - Crop settings panel
4. **buttons.css** - Button components
5. **upload-panel.css** - Upload functionality
6. **loading.css** - Loading states and animations
7. **responsive.css** - Responsive design (last to override)

## CSS Custom Properties

All colors, spacing, and other design tokens are defined in `variables.css` using CSS custom properties:

- **Colors**: Primary blue, success green, text colors, backgrounds
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl, xxxl)
- **Border Radius**: Consistent radius scale
- **Shadows**: Predefined shadow values
- **Transitions**: Standard transition timings

## Component Structure

Each component file follows a consistent structure:

1. **Component container** styles
2. **Child elements** styles
3. **Interactive states** (hover, focus, active)
4. **Animations** and transitions
5. **Responsive adjustments** (if needed)

## Adding New Styles

When adding new styles:

1. **New component**: Create a new file (e.g., `new-component.css`)
2. **New variables**: Add to `variables.css`
3. **Responsive rules**: Add to `responsive.css`
4. **Import**: Add the new file to `main.css` 