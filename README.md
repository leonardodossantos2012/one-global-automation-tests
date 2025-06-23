# One Global Automation Tests

A comprehensive automated testing suite using Playwright for the One Global application.

## 🚀 Best Practices Implemented

This project follows Playwright best practices for creating robust, maintainable, and scalable automated tests:

### 📁 Project Structure
```
one-global-automation-tests/
├── tests/
│   ├── e2e/           # End-to-end tests
│   │   └── example.e2e.spec.ts
│   ├── api/           # API tests
│   │   └── example.api.spec.ts
│   └── components/    # Component tests
├── utils/
│   ├── test.helpers.ts
│   ├── data.loader.ts
│   ├── config.loader.ts
│   └── page-objects/  # Page Object Model
│       ├── base.page.ts
│       └── login.page.ts
├── data/              # Test data files
│   └── test.data.json
├── fixtures/          # Test fixtures
├── .github/
│   └── workflows/     # CI/CD workflows
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── env.example
└── README.md
```

### 🎯 Key Best Practices

#### 1. **TypeScript Naming Conventions**
- **File naming**: Using dot notation (e.g., `test.helpers.ts`, `base.page.ts`)
- **Class naming**: PascalCase (e.g., `TestHelpers`, `BasePage`)
- **Method naming**: camelCase (e.g., `getUserByRole`, `fillLoginForm`)
- **Interface naming**: PascalCase with descriptive names (e.g., `TestUser`, `TestConfig`)

#### 2. **Page Object Model (POM)**
- Encapsulates page elements and actions
- Promotes code reusability and maintainability
- Separates test logic from page interactions
- Example: `utils/page-objects/login.page.ts`

#### 3. **Test Organization**
- Descriptive test names with clear purpose
- Proper test structure (Arrange, Act, Assert)
- Test isolation and independence
- Tagged tests for different test suites (`@smoke`, `@regression`)

#### 4. **Configuration Management**
- Environment-specific configurations
- Centralized test data management
- Flexible browser and device testing
- CI/CD ready configuration

#### 5. **Data-Driven Testing**
- External test data files
- Parameterized tests
- Dynamic test data generation
- Test data isolation

#### 6. **Error Handling & Reliability**
- Proper wait strategies
- Retry mechanisms with exponential backoff
- Comprehensive error messages
- Screenshot and video capture on failures

#### 7. **API Testing**
- RESTful API endpoint testing
- Request/response validation
- Authentication testing
- Error scenario coverage

#### 8. **Cross-Browser Testing**
- Multi-browser support (Chromium, Firefox, WebKit)
- Mobile device testing
- Responsive design validation

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd one-global-automation-tests

# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

### Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Update environment variables
# Edit .env file with your specific values
```

## 🧪 Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Test Suites
```bash
# Run smoke tests only
npm run test:smoke

# Run regression tests only
npm run test:regression

# Run API tests only
npm run test:api

# Run E2E tests only
npm run test:e2e
```

### Browser-Specific Testing
```bash
# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Mobile Testing
```bash
# Run tests on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## 📊 Test Reports

### HTML Report
```bash
# Generate and view HTML report
npm run test:report
```

### Other Report Formats
- JSON reports: `test-results/results.json`
- JUnit reports: `test-results/results.xml`
- Screenshots: `screenshots/` (on failure)
- Videos: `videos/` (on failure)
- Traces: `traces/` (for debugging)

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Parallel Execution**: Tests run in parallel for faster execution
- **Retry Logic**: Automatic retries on CI environments
- **Multiple Browsers**: Support for Chromium, Firefox, WebKit
- **Mobile Testing**: Mobile device viewports
- **Reporting**: Multiple report formats
- **Screenshots/Videos**: Captured on test failures

### Environment Variables
- `BASE_URL`: Application base URL
- `API_BASE_URL`: API endpoint base URL
- `HEADLESS`: Run tests in headless mode
- `SLOW_MO`: Slow down test execution for debugging
- `TIMEOUT`: Global timeout for tests

## 📝 Writing Tests

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/page-objects/login.page';
import { getDataLoader } from '../../utils/data.loader';
import { getConfigLoader } from '../../utils/config.loader';

test.describe('Login Functionality', () => {
  test('should login successfully with valid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dataLoader = getDataLoader();
    const configLoader = getConfigLoader();
    
    // Arrange
    await loginPage.navigateToLogin();
    
    // Act
    const userData = dataLoader.getUserByRole('regular');
    await loginPage.login(userData.username, userData.password);
    
    // Assert
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
```

### API Test Example
```typescript
import { test, expect } from '@playwright/test';
import { getDataLoader } from '../../utils/data.loader';
import { getConfigLoader } from '../../utils/config.loader';

test('should return user data', async ({ request }) => {
  const dataLoader = getDataLoader();
  const configLoader = getConfigLoader();
  
  const response = await request.get(`${configLoader.getApiBaseUrl()}/api/users/1`);
  
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
});
```

### Page Object Example
```typescript
export class LoginPage extends BasePage {
  private readonly usernameInput = '[data-testid="username"]';
  private readonly passwordInput = '[data-testid="password"]';
  
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement('[data-testid="login-button"]');
  }
}
```

## 🏗️ Best Practices Checklist

### ✅ TypeScript Conventions
- [ ] Use dot notation for file names (`test.helpers.ts`)
- [ ] Use PascalCase for classes and interfaces
- [ ] Use camelCase for methods and variables
- [ ] Use descriptive names for all identifiers

### ✅ Test Structure
- [ ] Use descriptive test names
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Keep tests independent and isolated
- [ ] Use appropriate test tags (`@smoke`, `@regression`)

### ✅ Page Objects
- [ ] Encapsulate page elements
- [ ] Provide business logic methods
- [ ] Extend base page class
- [ ] Use data-testid attributes

### ✅ Data Management
- [ ] Externalize test data
- [ ] Use environment variables
- [ ] Generate dynamic test data
- [ ] Clean up test data

### ✅ Error Handling
- [ ] Implement proper wait strategies
- [ ] Add retry mechanisms
- [ ] Capture screenshots on failure
- [ ] Provide meaningful error messages

### ✅ Configuration
- [ ] Environment-specific configs
- [ ] Cross-browser support
- [ ] Mobile device testing
- [ ] CI/CD integration

### ✅ Reporting
- [ ] HTML reports
- [ ] Screenshot capture
- [ ] Video recording
- [ ] Trace files for debugging

## 🔍 Debugging

### Debug Mode
```bash
# Run tests in debug mode
npm run test:debug
```

### Trace Viewer
```bash
# Open trace file
npx playwright show-trace trace.zip
```

### Code Generation
```bash
# Generate test code from browser actions
npm run test:codegen
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [API Testing](https://playwright.dev/docs/api-testing)
- [TypeScript Naming Conventions](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

## 🤝 Contributing

1. Follow the established project structure
2. Write tests following the best practices
3. Use appropriate test tags
4. Update documentation as needed
5. Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License.
