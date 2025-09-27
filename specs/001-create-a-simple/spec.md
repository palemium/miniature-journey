# Feature Specification: Czech National Bank Currency Exchange App

**Feature Branch**: `001-create-a-simple`
**Created**: 2025-09-27
**Status**: Draft
**Input**: User description: "Create a simple app, which:

1. When it starts, retrieve the latest currency exchange rates from the Czech National Bank.

API URL: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt

Documentation: https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/

2. Parses the downloaded data and clearly displays a list to the user in the UI.

3. Add a simple form, into which the customer can enter an amount in CZK and select a currency, and after submitting (clicking a button or in real-time) sees the amount entered in CZK converted into the selected currency."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user, I want to view current currency exchange rates from the Czech National Bank and convert Czech Koruna (CZK) amounts to other currencies, so I can quickly understand the value of my money in different currencies.

### Acceptance Scenarios
1. **Given** the app is launched, **When** the app starts, **Then** it must automatically fetch and display the latest currency exchange rates from the Czech National Bank
2. **Given** the currency exchange rates are displayed, **When** I enter an amount in CZK and select a currency, **Then** I must see the converted amount in the selected currency
3. **Given** the currency exchange rates are displayed, **When** the Czech National Bank data is unavailable, **Then** the app must display an appropriate error message to the user

### Edge Cases
- What happens when the Czech National Bank API is down or returns an error?
- How does the system handle network connectivity issues during data retrieval?
- What happens when the user enters an invalid or non-numeric amount?
- How does the system handle outdated exchange rate data?
- What happens when no currency is selected in the conversion form?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST automatically fetch the latest currency exchange rates from the Czech National Bank API when the application starts
- **FR-002**: System MUST parse the text format data from the Czech National Bank API and extract all available currency exchange rates
- **FR-003**: System MUST display a clear, readable list of all available currencies and their exchange rates to the user
- **FR-004**: System MUST provide a form where users can input an amount in Czech Koruna (CZK)
- **FR-005**: System MUST provide a currency selection dropdown containing all available currencies from the fetched exchange rates
- **FR-006**: System MUST calculate and display the converted amount when a user submits the form or in real-time as they type
- **FR-007**: System MUST handle API errors gracefully and show appropriate error messages to users
- **FR-008**: System MUST validate user input to ensure only valid numeric amounts are accepted for conversion

### Key Entities *(include if feature involves data)*
- **Currency Exchange Rate**: Represents the exchange rate between Czech Koruna (CZK) and a foreign currency, including currency code, currency name, and exchange rate value
- **Currency Conversion Request**: Represents a user's request to convert a specific CZK amount to a selected foreign currency
- **Conversion Result**: Represents the calculated result showing the original CZK amount, target currency, exchange rate used, and converted amount

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs (Constitution Principle III)
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous (Constitution Principle I)
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
