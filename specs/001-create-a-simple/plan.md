
# Implementation Plan: Czech National Bank Currency Exchange App

**Branch**: `001-create-a-simple` | **Date**: 2025-09-27 | **Spec**: `/workspaces/miniature-journey/specs/001-create-a-simple/spec.md`
**Input**: Feature specification from `/specs/001-create-a-simple/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A React-based currency exchange application that fetches daily exchange rates from the Czech National Bank API, displays them in a user-friendly interface, and provides real-time CZK to foreign currency conversion functionality.

## Technical Context
**Language/Version**: TypeScript 5.0+
**Primary Dependencies**: React 18+, React Query, Styled Components
**Storage**: N/A (client-side only, data fetched from CNB API)
**Testing**: Jest + React Testing Library + @testing-library/user-event
**Target Platform**: Web browser (WASM/JavaScript)
**Project Type**: Single web application (frontend-only)
**Performance Goals**: API response <200ms, UI interactions <100ms (Constitution Principle III)
**Constraints**: Must handle CNB text format parsing, real-time conversion, offline error handling
**Scale/Scope**: Single page application, ~10 components, 50-100 currency rates

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Test-First Development**: TDD approach required with complete test coverage (Jest + React Testing Library)
- [x] **Code Quality & Consistency**: Adherence to coding standards and SOLID principles (TypeScript, React patterns)
- [x] **Performance & User Experience**: Meets performance benchmarks and UX standards (<200ms API, <100ms UI)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/
│   ├── CurrencyList/
│   ├── ConversionForm/
│   ├── ErrorMessage/
│   └── LoadingSpinner/
├── hooks/
│   ├── useCurrencyRates.ts
│   └── useCurrencyConversion.ts
├── services/
│   └── cnbApi.ts
├── types/
│   └── currency.ts
├── utils/
│   └── parsers.ts
├── App.tsx
└── index.tsx

tests/
├── __mocks__/
├── components/
├── hooks/
├── services/
└── utils/

public/
├── index.html
└── favicon.ico

package.json
tsconfig.json
jest.config.js
```

**Structure Decision**: Single React web application with component-based architecture, custom hooks for state management, and comprehensive test coverage following React best practices.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- CNB API contract → API service tests and implementation
- Component contracts → component tests and implementation
- Data model entities → TypeScript type definitions
- User stories → integration tests and acceptance tests

**Key Task Categories**:
1. **Setup**: Project initialization, dependencies, tooling configuration
2. **Tests First**: Contract tests, component tests, integration tests (TDD approach)
3. **Core Implementation**: Types, utilities, API services, custom hooks
4. **UI Components**: CurrencyList, ConversionForm, ConversionResult, etc.
5. **Integration**: App component, state management, error handling
6. **Polish**: Accessibility, performance optimization, documentation

**Ordering Strategy**:
- TDD order: All tests written before implementation (Constitution Principle I)
- Dependency order: Types → Utilities → Services → Hooks → Components → App
- Parallel execution: Independent files marked with [P]
- Performance tasks: Performance testing and optimization

**Constitution Compliance**:
- Test-First Development: All implementation tasks have corresponding test tasks
- Code Quality: TypeScript, ESLint, Prettier, accessibility requirements
- Performance: React Query caching, <100ms UI interactions, <200ms API responses

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.1 - See `/memory/constitution.md`*
