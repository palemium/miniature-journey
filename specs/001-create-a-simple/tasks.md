# Tasks: Czech National Bank Currency Exchange App

**Input**: Design documents from `/specs/001-create-a-simple/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract test scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: types, utilities, services, hooks, components
   → Integration: app component, state management, error handling
   → Polish: unit tests, performance, docs, accessibility
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All components implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single React project**: `src/`, `tests/` at repository root
- Paths follow the structure defined in plan.md

## Phase 3.1: Setup
- [ ] T001 Create React project structure per implementation plan with src/components, src/hooks, src/services, src/types, src/utils directories
- [ ] T002 Initialize React 18+ project with TypeScript, Vite, and dependencies (React, React Query, Styled Components, Jest, React Testing Library)
- [ ] T003 [P] Configure development tools (ESLint, Prettier, TypeScript config, Vitest config, Styled Components)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation (Constitution Principle I)**

### Contract Tests
- [ ] T004 [P] Contract test CNB API text parsing in tests/contract/test-cnb-api-parsing.ts
- [ ] T005 [P] Contract test CNB API error handling in tests/contract/test-cnb-api-errors.ts
- [ ] T006 [P] Contract test currency conversion calculation in tests/contract/test-currency-conversion.ts

### Component Tests
- [ ] T007 [P] Component test CurrencyList rendering and interactions in tests/components/test-CurrencyList.tsx
- [ ] T008 [P] Component test ConversionForm validation and submission in tests/components/test-ConversionForm.tsx
- [ ] T009 [P] Component test ConversionResult display in tests/components/test-ConversionResult.tsx
- [ ] T010 [P] Component test ErrorMessage display and interactions in tests/components/test-ErrorMessage.tsx

### Hook Tests
- [ ] T011 [P] Hook test useCurrencyRates data fetching in tests/hooks/test-useCurrencyRates.ts
- [ ] T012 [P] Hook test useCurrencyConversion calculation in tests/hooks/test-useCurrencyConversion.ts

### Service Tests
- [ ] T013 [P] Service test CNB API data fetching in tests/services/test-cnbApi.ts
- [ ] T014 [P] Service test currency parsing utilities in tests/services/test-parsers.ts

### Integration Tests
- [ ] T015 [P] Integration test app startup with CNB API in tests/integration/test-app-startup.tsx
- [ ] T016 [P] Integration test currency conversion workflow in tests/integration/test-conversion-workflow.tsx
- [ ] T017 [P] Integration test error handling scenarios in tests/integration/test-error-handling.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Types and Interfaces
- [ ] T018 [P] Currency types in src/types/currency.ts (CurrencyRate, ConversionRequest, ConversionResult, ExchangeRateData)
- [ ] T019 [P] Component props interfaces in src/types/components.ts (all component prop types)
- [ ] T020 [P] Application state interfaces in src/types/app.ts (AppState, UI state interfaces)

### Utilities and Parsers
- [ ] T021 [P] CNB text parser in src/utils/parsers.ts (parseExchangeRates, validateCurrencyData)
- [ ] T022 [P] Currency calculation utilities in src/utils/calculations.ts (calculateConversion, formatCurrency)
- [ ] T023 [P] Date and formatting utilities in src/utils/formatters.ts (formatDate, formatNumber)

### Services and API
- [ ] T024 CNB API service in src/services/cnbApi.ts (fetchExchangeRates, handleApiErrors)
- [ ] T025 React Query configuration in src/services/reactQuery.ts (queryClient, QueryProvider)
- [ ] T026 Error handling service in src/services/errorHandling.ts (error types, error messages)

### Custom Hooks
- [ ] T027 [P] useCurrencyRates hook in src/hooks/useCurrencyRates.ts (fetch rates, loading states, error handling)
- [ ] T028 [P] useCurrencyConversion hook in src/hooks/useCurrencyConversion.ts (conversion logic, validation)
- [ ] T029 [P] useDebounce hook in src/hooks/useDebounce.ts (for search input debouncing)

### UI Components
- [ ] T030 [P] LoadingSpinner component in src/components/LoadingSpinner/index.tsx (loading states, animations)
- [ ] T031 [P] ErrorMessage component in src/components/ErrorMessage/index.tsx (error display, retry functionality)
- [ ] T032 [P] CurrencyList component in src/components/CurrencyList/index.tsx (display rates, search, sort)
- [ ] T033 [P] ConversionForm component in src/components/ConversionForm/index.tsx (input validation, currency selection)
- [ ] T034 [P] ConversionResult component in src/components/ConversionResult/index.tsx (result display, formatting)

## Phase 3.4: Integration

### Application Assembly
- [ ] T035 App component in src/App.tsx (main layout, state management, component orchestration)
- [ ] T036 Application entry point in src/index.tsx (React root, providers, error boundaries)
- [ ] T037 Global styles and theme in src/styles/theme.ts (Styled Components theme, global styles)

### State Management
- [ ] T038 Application context in src/contexts/AppContext.tsx (global state, dispatch functions)
- [ ] T039 Currency search context in src/contexts/SearchContext.tsx (search state, filters)
- [ ] T040 Conversion context in src/contexts/ConversionContext.tsx (conversion state, results)

### Performance Optimization
- [ ] T041 React Query optimization in src/services/reactQuery.ts (cache configuration, stale time)
- [ ] T042 Component memoization in src/components/memoizedComponents.ts (React.memo, useMemo optimization)
- [ ] T043 Virtual scrolling for CurrencyList in src/components/CurrencyList/VirtualizedList.tsx (performance for large lists)

## Phase 3.5: Polish

### Unit Tests and Coverage
- [ ] T044 [P] Unit tests for utilities in tests/utils/test-calculations.ts (conversion calculations, edge cases)
- [ ] T045 [P] Unit tests for formatters in tests/utils/test-formatters.ts (number formatting, date formatting)
- [ ] T046 [P] Unit tests for hooks in tests/hooks/test-useDebounce.ts (debounce functionality, timing)

### Accessibility
- [ ] T047 [P] Accessibility tests for CurrencyList in tests/accessibility/test-CurrencyList-a11y.tsx (keyboard navigation, screen reader)
- [ ] T048 [P] Accessibility tests for ConversionForm in tests/accessibility/test-ConversionForm-a11y.tsx (form accessibility, ARIA labels)
- [ ] T049 [P] Accessibility tests for ErrorMessage in tests/accessibility/test-ErrorMessage-a11y.tsx (error announcements, focus management)

### Performance Testing
- [ ] T050 Performance test API response times (meet <200ms target per Constitution Principle III)
- [ ] T051 Performance test UI interactions (meet <100ms target per Constitution Principle III)
- [ ] T052 Performance test large dataset handling (50+ currencies with search/sort)

### Documentation and Quality
- [ ] T053 [P] Update package.json scripts and documentation in package.json (build, test, dev scripts)
- [ ] T054 [P] Create README with setup instructions in README.md (project overview, setup guide)
- [ ] T055 [P] Update TypeScript configuration for strict mode in tsconfig.json (type safety, compiler options)
- [ ] T056 [P] Configure testing setup for coverage in vitest.config.ts (coverage thresholds, reporting)

### Final Validation
- [ ] T057 Run manual testing scenarios from quickstart.md (development workflow, build process, deployment)
- [ ] T058 [P] Validate all constitutional requirements (test coverage, code quality, performance targets)
- [ ] T059 [P] Final accessibility audit and compliance check (WCAG 2.1 AA, keyboard navigation)
- [ ] T060 End-to-end testing of complete user workflow (app startup → fetch rates → convert currency → error handling)

## Dependencies
- **Phase Order**: Setup (T001-T003) → Tests (T004-T017) → Core Implementation (T018-T034) → Integration (T035-T043) → Polish (T044-T060)
- **TDD Requirement**: All tests (T004-T017) must be written and failing before any implementation (T018+)
- **Parallel Tasks**: [P] tasks can be executed simultaneously as they work on independent files
- **Sequential Dependencies**: Non-[P] tasks must be executed in order as they may modify the same files

### Key Dependencies
- T018 (Currency types) blocks T021-T028 (implementation tasks using types)
- T024 (CNB API service) blocks T027 (useCurrencyRates hook)
- T027-T029 (hooks) block T030-T034 (components using hooks)
- T030-T034 (components) block T035 (App component assembly)
- All implementation blocks T044-T060 (polish and testing tasks)

## Parallel Execution Examples

### Setup Phase (Parallel)
```
# Launch T001-T003 together:
Task: "Create React project structure per implementation plan"
Task: "Initialize React 18+ project with TypeScript and dependencies"
Task: "Configure development tools (ESLint, Prettier, TypeScript config)"
```

### Tests First Phase (Parallel Groups)
```
# Group 1 - Contract Tests:
Task: "Contract test CNB API text parsing in tests/contract/test-cnb-api-parsing.ts"
Task: "Contract test CNB API error handling in tests/contract/test-cnb-api-errors.ts"
Task: "Contract test currency conversion calculation in tests/contract/test-currency-conversion.ts"

# Group 2 - Component Tests:
Task: "Component test CurrencyList rendering and interactions in tests/components/test-CurrencyList.tsx"
Task: "Component test ConversionForm validation and submission in tests/components/test-ConversionForm.tsx"
Task: "Component test ConversionResult display in tests/components/test-ConversionResult.tsx"
Task: "Component test ErrorMessage display and interactions in tests/components/test-ErrorMessage.tsx"
```

### Core Implementation Phase (Parallel Groups)
```
# Group 1 - Types and Utilities:
Task: "Currency types in src/types/currency.ts"
Task: "Component props interfaces in src/types/components.ts"
Task: "Application state interfaces in src/types/app.ts"

# Group 2 - Utilities and Parsers:
Task: "CNB text parser in src/utils/parsers.ts"
Task: "Currency calculation utilities in src/utils/calculations.ts"
Task: "Date and formatting utilities in src/utils/formatters.ts"

# Group 3 - UI Components:
Task: "LoadingSpinner component in src/components/LoadingSpinner/index.tsx"
Task: "ErrorMessage component in src/components/ErrorMessage/index.tsx"
Task: "CurrencyList component in src/components/CurrencyList/index.tsx"
```

## Notes
- **TDD Compliance**: All test tasks (T004-T017) MUST be written and MUST FAIL before implementation tasks (T018+)
- **Constitutional Compliance**: Tasks align with three constitutional principles (Test-First, Code Quality, Performance)
- **File Independence**: [P] tasks work on different files and can be executed in parallel
- **Incremental Development**: Commit after each task to maintain progress tracking
- **Performance Targets**: All UI interactions must meet <100ms, API responses <200ms (Constitution Principle III)

## Task Generation Rules Applied

### From Contracts
- CNB API contract → T004, T005 (contract tests) + T024 (API service)
- Component contracts → T007-T010 (component tests) + T032-T034 (component implementation)

### From Data Model
- CurrencyRate entity → T018 (type definition) + T021 (parser)
- ConversionRequest/Result entities → T018 (types) + T022 (calculations)
- ExchangeRateData entity → T018 (types) + T021 (parser)

### From User Stories (Spec)
- Fetch rates on startup → T015 (integration test) + T027 (hook) + T035 (App component)
- Convert CZK to currency → T016 (integration test) + T028 (hook) + T033 (form)
- Handle errors gracefully → T017 (integration test) + T031 (error component)

### From Quickstart Scenarios
- Development workflow → T057 (manual testing)
- Performance targets → T050-T052 (performance testing)
- Accessibility requirements → T047-T049, T059 (accessibility testing)

## Validation Checklist ✅
- [x] All contracts have corresponding tests
- [x] All entities have model/type tasks
- [x] All tests come before implementation (TDD)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Constitutional requirements addressed (Test-First, Code Quality, Performance)
- [x] Task count matches estimated scope (60 tasks for React SPA with 10 components)