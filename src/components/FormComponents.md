# Form Components Documentation

This document provides comprehensive guidance on using the form input components in the Signals application. All components follow Tailwind CSS best practices and include full accessibility support.

## Components Overview

### 1. InputLabel
A flexible label component with support for required indicators, error states, and descriptions.

```tsx
import { InputLabel } from '../components';

<InputLabel
  htmlFor="email"
  required
  error={!!errors.email}
  description="We'll use this to send you important updates"
>
  Email Address
</InputLabel>
```

**Props:**
- `required?: boolean` - Shows required asterisk
- `error?: boolean` - Applies error styling
- `disabled?: boolean` - Applies disabled styling
- `size?: 'sm' | 'md' | 'lg'` - Controls text size
- `description?: string` - Helper text below the label

### 2. TextInput
A versatile text input with icon support, clear button, and full accessibility.

```tsx
import { TextInput, Icon } from '../components';

<TextInput
  id="email"
  type="email"
  value={formData.email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  error={!!errors.email}
  leftIcon={<Icon name="users" />}
  showClearButton
  onClear={() => setEmail('')}
/>
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Controls input size
- `error?: boolean` - Applies error styling
- `leftIcon?: React.ReactNode` - Icon on the left side
- `rightIcon?: React.ReactNode` - Icon on the right side
- `showClearButton?: boolean` - Shows clear button when value exists
- `onClear?: () => void` - Callback for clear button
- `fullWidth?: boolean` - Makes input full width

### 3. TextArea
A textarea with auto-resize functionality and consistent styling.

```tsx
import { TextArea } from '../components';

<TextArea
  id="bio"
  value={formData.bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="Tell us about yourself..."
  autoResize
  minRows={3}
  maxRows={8}
  error={!!errors.bio}
/>
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Controls textarea size
- `error?: boolean` - Applies error styling
- `autoResize?: boolean` - Automatically adjusts height
- `minRows?: number` - Minimum number of rows
- `maxRows?: number` - Maximum number of rows
- `fullWidth?: boolean` - Makes textarea full width

### 4. RadioGroup
A radio button group with proper accessibility and keyboard navigation.

```tsx
import { RadioGroup } from '../components';

const options = [
  { value: 'option1', label: 'Option 1', description: 'First option' },
  { value: 'option2', label: 'Option 2', description: 'Second option' },
];

<RadioGroup
  name="preferences"
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  error={!!errors.preferences}
  orientation="vertical"
/>
```

**Props:**
- `name: string` - Required name for the radio group
- `options: RadioOption[]` - Array of radio options
- `value?: string` - Currently selected value
- `onChange?: (value: string) => void` - Selection callback
- `error?: boolean` - Applies error styling
- `orientation?: 'vertical' | 'horizontal'` - Layout direction
- `size?: 'sm' | 'md' | 'lg'` - Controls radio button size

**RadioOption Interface:**
```tsx
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

### 5. SingleSelect
A dropdown select with search functionality and keyboard navigation.

```tsx
import { SingleSelect } from '../components';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
];

<SingleSelect
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select a framework"
  searchable
  clearable
  error={!!errors.framework}
/>
```

**Props:**
- `options: SelectOption[]` - Array of select options
- `value?: string` - Currently selected value
- `onChange?: (value: string) => void` - Selection callback
- `placeholder?: string` - Placeholder text
- `error?: boolean` - Applies error styling
- `searchable?: boolean` - Enables search functionality
- `clearable?: boolean` - Shows clear button
- `size?: 'sm' | 'md' | 'lg'` - Controls select size

**SelectOption Interface:**
```tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}
```

## Accessibility Features

All form components include comprehensive accessibility support:

### Keyboard Navigation
- **Tab**: Move between form elements
- **Enter/Space**: Activate buttons and select options
- **Arrow Keys**: Navigate within radio groups and select dropdowns
- **Escape**: Close dropdowns and cancel actions

### ARIA Attributes
- `aria-required`: Indicates required fields
- `aria-invalid`: Indicates validation errors
- `aria-describedby`: Links to help text and error messages
- `aria-expanded`: Indicates dropdown state
- `aria-selected`: Indicates selected options

### Screen Reader Support
- Proper labeling with `htmlFor` attributes
- Descriptive error messages
- Live regions for dynamic content
- Semantic HTML structure

## Styling Guidelines

### Error States
All components support error styling with consistent red color scheme:
- Border: `border-red-300`
- Text: `text-red-900`
- Focus ring: `focus:ring-red-500`

### Size Variants
Three size options available across all components:
- **Small (`sm`)**: Compact forms, dense layouts
- **Medium (`md`)**: Default size for most use cases
- **Large (`lg`)**: Prominent forms, touch-friendly interfaces

### Focus States
Consistent focus indicators using Tailwind's focus utilities:
- Focus ring: `focus:ring-2 focus:ring-brand-500`
- Focus offset: `focus:ring-offset-0` (for better contrast)

## Best Practices

### Form Validation
```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.email) {
    newErrors.email = 'Email is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Error Display
```tsx
{errors.email && (
  <p id="email-error" className="mt-1 text-sm text-red-600">
    {errors.email}
  </p>
)}
```

### Accessibility IDs
Always provide proper ID relationships:
```tsx
<InputLabel htmlFor="email" ariaDescribedBy="email-description">
  Email
</InputLabel>
<TextInput
  id="email"
  ariaDescribedBy={errors.email ? 'email-error' : 'email-description'}
/>
<p id="email-description">We'll use this to contact you</p>
{errors.email && <p id="email-error">{errors.email}</p>}
```

## Example Usage

See `FormExample.tsx` for a complete implementation demonstrating all form components working together with validation, error handling, and accessibility features.

## Integration with Existing Components

These form components integrate seamlessly with the existing component library:
- Use with `Button` for form actions
- Use with `Modal` for form dialogs
- Use with `Icon` for input icons
- Use with `ErrorBoundary` for error handling
