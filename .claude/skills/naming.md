# Naming Conventions Skill

Every name must answer "Why does this exist?" without a comment.

## Variables

- Full descriptive nouns — no abbreviations: `err`→`validationError`, `res`→`serverResponse`, `data`→`animalListData`, `item`→`selectedAnimal`, `cb`→`onFormSubmit`
- Booleans start with `is`/`has`/`should`/`can`/`did`/`will`: `loading`→`isLoadingAnimals`, `open`→`isModalOpen`
- Module-level constants: `UPPER_SNAKE_CASE` + domain noun: `TIMEOUT`→`REQUEST_TIMEOUT_MS`

## Functions

- Verb + noun: `get()`→`fetchAnimalById()`, `handle()`→`handleLoginFormSubmit()`, `check()`→`validateEmailFormat()`
- Event handlers: `handle` + source + event: `handleSubmitButtonClick`, `handleSearchInputChange`
- Async data fetchers start with `fetch`: `loadAnimals()`→`fetchAnimalList()`

## Components

PascalCase specific nouns: `Card`→`AnimalProfileCard`, `Modal`→`DeleteConfirmationModal`, `Item`→`AnimalListItem`

## Hooks

`use` + descriptive phrase: `useData()`→`useAnimalListData()`, `useFetch()`→`useAnimalDetailsFetch()`

## TypeScript types

- No `I` prefix, no `Type` suffix: `IAnimal`→`Animal`, `AnimalType`→`Animal`, `Data`→`AnimalListResponse`
- `Props` suffix only on component prop types: `AnimalCardProps`
- Always `type`, never `interface`

## Files

`kebab-case` matching primary export: `utils.ts`→`animal-name-formatter.ts`

## Always forbidden

Single-letter names · generic words alone (`data`, `info`, `item`, `obj`, `result`) · abbreviations (except: `url`, `id`, `html`, `api`, `http`, `css`, `ui`) · misleading names · `Manager`/`Processor`/`Handler` without domain noun
