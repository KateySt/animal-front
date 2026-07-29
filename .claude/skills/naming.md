# Naming Conventions Skill

You are applying strict naming conventions based on Clean Code principles.
Follow every rule below without exception for this project.

---

## Core principle

Every name must answer the question **"Why does this exist / what does it do?"**
A name that needs a comment to explain it is a bad name.

---

## Rules

### Variables and constants

- Use full descriptive nouns or noun phrases — never abbreviations.
  - `err` → `validationError`, `authenticationError`
  - `res` → `serverResponse`, `userListResponse`
  - `req` → `incomingRequest`, `loginRequest`
  - `val` → `inputValue`, `selectedOptionValue`
  - `tmp` / `temp` → `temporaryToken`, `cachedUserData`
  - `i`, `j`, `k` → `animalIndex`, `pageNumber`, `retryCount`
  - `data` alone → `animalListData`, `userProfileData`
  - `item` alone → `selectedAnimal`, `currentCartItem`
  - `obj` → name the actual entity: `userProfile`, `animalDetails`
  - `cb` → `onUploadSuccess`, `onFormSubmit`
  - `fn` → `validateEmail`, `formatAnimalName`

- Boolean variables must start with `is`, `has`, `should`, `can`, `did`, or `will`:
  - `loading` → `isLoadingAnimals`
  - `error` → `hasValidationError`
  - `open` → `isModalOpen`
  - `auth` → `isUserAuthenticated`
  - `logged` → `isUserLoggedIn`
  - `disabled` → `isSubmitButtonDisabled`

- Constants (module-level, `UPPER_SNAKE_CASE`) must describe what the value represents:
  - `URL` → `ANIMALS_API_BASE_URL`
  - `TIMEOUT` → `REQUEST_TIMEOUT_MS`
  - `MAX` → `MAX_ANIMAL_NAME_LENGTH`

---

### Functions and methods

- Functions must be named with a **verb + noun** that describe the action and the target:
  - `get()` → `fetchAnimalById()`, `getAuthenticatedUser()`
  - `set()` → `updateAnimalStatus()`, `setUserPreferences()`
  - `handle()` → `handleLoginFormSubmit()`, `handleAnimalCardClick()`
  - `check()` → `validateEmailFormat()`, `verifyUserPermissions()`
  - `calc()` → `calculatePaginationOffset()`, `computeFilteredAnimalCount()`
  - `format()` → `formatAnimalBirthDate()`, `formatCurrencyValue()`
  - `init()` → `initializeAuthSession()`, `initializeAnimalFilters()`
  - `proc()` / `process()` → `processUploadedImage()`, `processPaymentResponse()`

- Event handlers must be prefixed with `handle` + event source + event type:
  - `onClick` prop callback → `handleSubmitButtonClick`
  - `onChange` prop callback → `handleSearchInputChange`
  - `onSubmit` prop callback → `handleLoginFormSubmit`

- Async functions that fetch data must start with `fetch`:
  - `loadAnimals()` → `fetchAnimalList()`
  - `getUser()` → `fetchAuthenticatedUserProfile()`

---

### React components

- Component names must be full, specific PascalCase nouns — no generic words alone:
  - `Card` → `AnimalProfileCard`
  - `List` → `AnimalSearchResultList`
  - `Modal` → `DeleteConfirmationModal`
  - `Form` → `UserRegistrationForm`
  - `Button` → (acceptable if truly generic; otherwise `SubmitLoginButton`)
  - `Item` → `AnimalListItem`
  - `Page` → `AnimalDetailsPage`

---

### React hooks

- Custom hooks must start with `use` + descriptive noun phrase:
  - `useData()` → `useAnimalListData()`
  - `useAuth()` → (acceptable if the hook manages the entire auth state; otherwise `useAuthenticatedUser()`)
  - `useFetch()` → `useAnimalDetailsFetch()`
  - `useForm()` → `useLoginFormState()`

---

### TypeScript types and interfaces

- Interface names must be specific nouns — no `I` prefix, no `Type` suffix:
  - `IAnimal` → `Animal`
  - `AnimalType` → `Animal`
  - `Data` → `AnimalListResponse`
  - `Props` → `AnimalProfileCardProps`
  - `Params` → `FetchAnimalListParams`

- `Props` suffix is allowed **only** on component prop interfaces:
  - `AnimalCardProps`, `DeleteModalProps`

---

### Files and folders

- File names must reflect their primary export, in `kebab-case`:
  - `utils.ts` → `animal-name-formatter.ts`, `date-format-utils.ts`
  - `helpers.ts` → `pagination-helpers.ts`
  - `index.ts` — allowed as barrel exports only

---

### What is always forbidden

- Single-letter names outside of math/geometry contexts.
- Generic words alone: `data`, `info`, `item`, `thing`, `stuff`, `value`, `obj`, `arr`, `list`, `result`, `response` (always add the domain noun).
- Misleading names: a function named `getUser` that also saves to DB.
- Noise words that add no meaning: `Manager`, `Processor`, `Handler` alone without a domain noun.
- Abbreviations that are not universal acronyms (universally accepted: `url`, `id`, `html`, `api`, `http`, `css`, `ui`).

---

## How to apply this skill

When writing or reviewing any code in this project:
1. Read every name you produce.
2. Ask: "Does this name answer WHY this exists without needing a comment?"
3. Ask: "Is there any abbreviation or generic word here?"
4. If yes to either question — rename before finishing.

Do not wait for the user to ask for better names. Apply these rules proactively on every identifier you write.
