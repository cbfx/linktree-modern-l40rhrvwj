# Contributing Guide

Welcome to the LinkTree Modern template project! This guide will help you understand how to contribute to the template development and improvement.

## 🤝 How to Contribute

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your help is appreciated.

### Ways to Contribute

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new features or improvements
- 🔧 **Code Contributions** - Submit bug fixes or new features
- 📖 **Documentation** - Improve guides, examples, and API docs
- 🎨 **Design & UX** - Enhance visual design and user experience
- 🧪 **Testing** - Help improve test coverage and reliability

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Development Setup

1. **Fork the Repository**
   ```bash
   # Go to GitHub and fork the repository
   # https://github.com/nailthelanding/template-linktree-modern
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/template-linktree-modern.git
   cd template-linktree-modern
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   - Open http://localhost:5173
   - Verify the template loads correctly
   - Test configuration changes in `src/config.json`

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Changes**
   - Follow our [coding standards](#coding-standards)
   - Add tests for new features
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run lint        # Check code quality
   npm run build       # Test production build
   npm run preview     # Test built version
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new button animation option"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR through GitHub interface
   ```

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for all data structures
- **Avoid `any` type** - use proper typing
- **Export types** for reusable interfaces

```typescript
// ✅ Good
interface LinkConfig {
  title: string;
  url: string;
  icon?: string;
}

// ❌ Avoid
const link: any = { title: "test", url: "example.com" };
```

### React Best Practices

- **Functional Components** with hooks
- **TypeScript interfaces** for all props
- **Memoization** for expensive operations
- **Accessibility** attributes (ARIA labels, semantic HTML)

```typescript
// ✅ Good
interface LinkButtonProps {
  title: string;
  url: string;
  onClick?: () => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({ title, url, onClick }) => {
  return (
    <a 
      href={url}
      className="link-button"
      aria-label={`Visit ${title}`}
      onClick={onClick}
    >
      {title}
    </a>
  );
};
```

### CSS and Styling

- **Tailwind CSS** for all styling
- **CSS custom properties** for theme variables
- **Mobile-first** responsive design
- **Dark mode** compatibility

```css
/* ✅ Good - Use CSS custom properties */
.button {
  background-color: var(--primary-color);
  color: var(--text-color);
}

/* ✅ Good - Tailwind classes */
<button className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark">
```

### Code Organization

```
src/
├── components/           # React components
│   ├── ComponentName.tsx # PascalCase for components
│   └── index.ts          # Barrel exports
├── types/               # TypeScript type definitions
│   └── config.ts        # Interface definitions
├── utils/               # Utility functions
│   ├── validation.ts    # Pure functions
│   └── analytics.ts     # Side-effect functions
└── styles/              # Global styles
    └── globals.css      # CSS custom properties
```

### Naming Conventions

- **Components**: PascalCase (`LinkButton.tsx`)
- **Files**: camelCase (`configUtils.ts`)
- **Variables**: camelCase (`primaryColor`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_THEME`)
- **CSS Classes**: kebab-case (`link-button`)

## 🧪 Testing Guidelines

### Component Testing

```typescript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('renders with correct title', () => {
    render(<LinkButton title="Test Link" url="https://example.com" />);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<LinkButton title="Test" url="https://example.com" onClick={onClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<LinkButton title="Test Link" url="https://example.com" />);
    const link = screen.getByRole('link');
    
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('aria-label', 'Visit Test Link');
  });
});
```

### Configuration Testing

```typescript
// Test configuration validation
import { validateConfig } from '../utils/validation';

describe('Configuration Validation', () => {
  it('validates correct configuration', () => {
    const config = {
      profile: {
        name: "Test User",
        bio: "Test bio",
        avatar: "https://example.com/avatar.jpg"
      },
      links: [],
      theme: { /* valid theme */ }
    };
    
    expect(validateConfig(config)).toBe(true);
  });

  it('rejects invalid URLs', () => {
    const config = {
      links: [
        { title: "Invalid", url: "not-a-url" }
      ]
    };
    
    expect(validateConfig(config)).toBe(false);
  });
});
```

### Accessibility Testing

- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
- **Color Contrast**: Verify WCAG AA compliance
- **Focus Management**: Visible focus indicators

```bash
# Run accessibility tests
npm run test:a11y
```

## 🎨 Design Guidelines

### Visual Design Principles

- **Simplicity**: Clean, uncluttered interface
- **Consistency**: Uniform spacing, typography, and colors
- **Accessibility**: High contrast, readable fonts, touch targets
- **Responsiveness**: Mobile-first, works on all screen sizes

### Theme System

- **CSS Custom Properties**: For runtime theme switching
- **Tailwind Configuration**: For build-time customization
- **Color Palette**: Support for brand colors and accessibility
- **Typography**: Web-safe fonts with Google Fonts integration

### Component Design

- **Reusability**: Components should be composable and flexible
- **Props Interface**: Clear, well-documented prop interfaces
- **Variants**: Support for different visual styles
- **States**: Hover, focus, active, disabled states

## 📖 Documentation Standards

### Code Documentation

```typescript
/**
 * LinkButton component for displaying actionable links
 * 
 * @param title - Display text for the button
 * @param url - Destination URL (must include protocol)
 * @param icon - Optional Lucide icon name
 * @param featured - Whether to apply featured styling
 * @param onClick - Optional click handler for analytics
 */
interface LinkButtonProps {
  title: string;
  url: string;
  icon?: string;
  featured?: boolean;
  onClick?: (event: LinkClickEvent) => void;
}
```

### README Updates

When adding features, update relevant documentation:

- **Configuration options** in CONFIGURATION.md
- **API changes** in DEVELOPER.md
- **Examples** with working code samples
- **Deployment notes** in DEPLOYMENT.md

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature additions
feat(theme): add new button animation options
feat(config): support custom background images

# Bug fixes
fix(validation): handle empty social media fields
fix(accessibility): improve keyboard navigation

# Documentation
docs(config): add theme customization examples
docs(api): update component prop interfaces

# Breaking changes
feat(config)!: restructure theme configuration schema
```

## 🚀 Feature Development

### Adding New Configuration Options

1. **Update Schema** (`config.schema.json`)
   ```json
   {
     "properties": {
       "newOption": {
         "type": "string",
         "title": "New Option",
         "description": "Description of the new option",
         "default": "defaultValue"
       }
     }
   }
   ```

2. **Update TypeScript Types** (`src/types/config.ts`)
   ```typescript
   interface Config {
     newOption: string;
   }
   ```

3. **Update Default Configuration** (`config.defaults.json`)
   ```json
   {
     "newOption": "defaultValue"
   }
   ```

4. **Implement Feature** in relevant components

5. **Update Documentation** with examples and explanations

### Adding New Components

1. **Create Component File**
   ```typescript
   // src/components/NewComponent.tsx
   interface NewComponentProps {
     // Define props
   }

   export const NewComponent: React.FC<NewComponentProps> = (props) => {
     // Implementation
   };
   ```

2. **Export Component** (`src/components/index.ts`)
   ```typescript
   export { NewComponent } from './NewComponent';
   ```

3. **Add Tests**
   ```typescript
   // src/components/NewComponent.test.tsx
   ```

4. **Update Documentation**

### Adding New Themes

1. **Define Theme Configuration**
   ```typescript
   interface ThemeConfig {
     newThemeOption: string;
   }
   ```

2. **Implement CSS Variables**
   ```css
   :root {
     --new-theme-property: var(--theme-value);
   }
   ```

3. **Add Tailwind Classes**
   ```javascript
   // tailwind.config.js
   theme: {
     extend: {
       colors: {
         'new-theme': 'var(--new-theme-color)'
       }
     }
   }
   ```

## 🐛 Bug Reporting

### Before Reporting

1. **Search existing issues** for duplicates
2. **Test with latest version** of the template
3. **Reproduce with minimal configuration**
4. **Check browser compatibility**

### Bug Report Template

```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Configuration
```json
{
  "relevant": "configuration"
}
```

## Environment
- Browser: Chrome 118.0
- Node.js: 18.17.0
- Template Version: 1.0.0
- Platform: macOS 13.5

## Screenshots
(If applicable)
```

## 🔒 Security Guidelines

### Security Considerations

- **Input Validation**: All user input must be validated
- **XSS Prevention**: Sanitize HTML content
- **URL Validation**: Verify protocol and format
- **Dependencies**: Keep dependencies updated

### Reporting Security Issues

For security-related issues:

1. **Do not** create public GitHub issues
2. **Email** security concerns to security@nailthelanding.com
3. **Include** detailed reproduction steps
4. **Wait** for response before public disclosure

## 📋 Pull Request Process

### PR Checklist

Before submitting a pull request:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or clearly documented)
- [ ] Accessibility requirements met
- [ ] Performance impact considered

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots
(If applicable)

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks**: GitHub Actions must pass
2. **Code Review**: At least one maintainer review
3. **Testing**: Functional and regression testing
4. **Documentation**: Verify docs are updated
5. **Merge**: Squash and merge with clean history

## 🎯 Development Roadmap

### Current Priorities

1. **Backend Integration** - Complete platform integration
2. **Testing Coverage** - Increase test coverage to 80%+
3. **Performance** - Optimize bundle size and loading
4. **Accessibility** - WCAG 2.1 AAA compliance
5. **Documentation** - Complete API documentation

### Future Enhancements

- **Template Variants** - Additional layout options
- **Advanced Analytics** - Detailed click tracking
- **Custom Domains** - Simplified domain setup
- **PWA Features** - Offline functionality
- **Internationalization** - Multi-language support

### Contributing to Roadmap

- **Feature Requests**: Submit through GitHub Issues
- **Discussions**: Use GitHub Discussions for ideas
- **Voting**: React to issues to show priority
- **Implementation**: Volunteer to implement features

## 🆘 Getting Help

### Community Support

- **GitHub Issues**: Technical questions and bug reports
- **GitHub Discussions**: General questions and ideas
- **Documentation**: Check existing docs first

### Development Questions

For development-specific questions:

1. **Check Documentation**: README, DEVELOPER.md, CONFIGURATION.md
2. **Search Issues**: Look for similar questions
3. **Create Issue**: Use question template
4. **Be Specific**: Include code samples and context

### Code Review Help

If you need help with your contribution:

1. **Create Draft PR**: Mark as work-in-progress
2. **Ask Questions**: Comment on specific lines
3. **Request Review**: Ask for early feedback
4. **Iterate**: Make changes based on feedback

## 🏆 Recognition

### Contributors

We recognize contributors in:

- **README.md**: Contributors section
- **Release Notes**: Feature attribution
- **GitHub**: Contributor badges
- **Social Media**: Feature announcements

### Becoming a Maintainer

Active contributors may be invited to become maintainers:

- **Consistent Contributions**: Regular, quality contributions
- **Community Involvement**: Helping other contributors
- **Technical Knowledge**: Deep understanding of codebase
- **Communication**: Clear, helpful communication

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LinkTree Modern! Your help makes this template better for everyone. 🙏

For questions about contributing, please create an issue or reach out through GitHub Discussions.