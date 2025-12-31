# Family tree

> A modern genealogy and family tree application built with React and HTML5 Canvas.

## Demo

[https://cristidraghici.github.io/family-tree](https://cristidraghici.github.io/family-tree)

## Features

- **Interactive Canvas**: Drag and drop persons, pan and zoom the viewport.
- **Smart Connections**: Automatically draws blood and spouse relationships.
- **Easy Creation**: Double-click on any empty space on the canvas to add a new person at that location.
- **Robust Validation**: Uses **Zod** and **React Hook Form** for reliable data entry and error handling.
- **Local Storage**: Your tree is automatically saved to your browser's local storage.
- **Auto Layout**: Built-in algorithm to automatically organize your family tree.
- **Search & Highlight**: Quickly find persons in your tree with real-time highlighting.

## Tech Stack

- **React** (Hooks, Context API)
- **TypeScript**
- **HTML5 Canvas** (Custom rendering engine)
- **Zod** (Schema validation)
- **React Hook Form**
- **Vite** (Build tool)
- **Pico CSS** (Minimal styling)

## Intro to genealogy trees

Creating a genealogy tree involves researching, organizing, and presenting information about your family's history. Here are some best practices:

- **Start with Yourself**: Begin with your own information and work backward.
- **Gather Evidence**: Collect information from family members, old documents, photos, and records.
- **Document Sources**: Keep track of where you found each piece of information.
- **Collaborate**: Families are collaborative; share findings with relatives to uncover more stories.
- **Privacy First**: Be mindful of sharing sensitive information about living individuals.

## Project details

### File structure

The project follows **Atomic Design** principles for components:

- `src/components/atoms`: Fundamental UI elements (buttons, inputs, icons).
- `src/components/molecules`: Simple combinations of atoms (form fields, modal headers).
- `src/components/organisms`: Complex UI sections (navigation bar, persons modal).
- `src/pages`: Full screen views and route handlers.
- `src/utils/canvas`: A modular canvas engine separated into managers and utilities.
- `src/schemas.ts`: Centralized Zod schemas for the entire application.

```md
src/
|-- components/      # Atomic design components
|-- contexts/        # React context (PersonContext)
|-- hooks/           # Custom hooks (Registry logic, storage)
|-- pages/           # Application pages
|-- utils/
|   |-- canvas/      # Custom Canvas engine logic
|   |-- persons/     # Genealogy calculation helpers
|-- schemas.ts       # Zod data schemas
|-- types.ts         # TypeScript definitions
|-- style/           # Global CSS
```

### Quick UUID

To get a quick valid UUID for manual data editing, run in browser console: `crypto.randomUUID()`

## Features to be added

- [ ] Add print / PDF export support.
- [ ] Multi-language support (i18n).
- [ ] Import/Export via GEDCOM files.
- [ ] Support for uploading profile pictures.
- [ ] Improved mobile touch interactions.

## GitHub Pages Routing
 
Since GitHub Pages handles single-page applications (SPAs) by returning a 404 for unknown routes (like `/graph`), we use a workaround to maintain clean URLs with `BrowserRouter` instead of `HashRouter`.
 
1.  **`public/404.html`**: Catches the 404 error and redirects to the index page with the original path as a query parameter (e.g., `/?p=/graph`).
2.  **`src/utils/GitHubPages.ts`**: Runs on app initialization to detect this query parameter and restores the correct path using `history.replaceState`.
 
This ensures that refreshing on deep links works correctly while hosted on `github.io`.
 
## Credits

- [Romanian Royal Family](https://en.wikipedia.org/wiki/Romanian_royal_family) (Demo data)
- [Tree icon](https://www.flaticon.com/free-icon/tree_642021)
- [Pico CSS](https://picocss.com/)
