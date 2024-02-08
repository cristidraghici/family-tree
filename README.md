# Family tree

> Another genealogy / family tree application

## Demo

[https://cristidraghici.github.io/family-tree](https://cristidraghici.github.io/family-tree)

## Intro to genealogy trees

Creating a genealogy tree involves researching, organizing, and presenting information about your family's history. Here are some best practices to consider when creating a genealogy tree:

- Start with Yourself: begin with your own information and work backward;
- Collect information from family members, old documents, photos, and any existing family records;
- Keep track of your sources. Document where you found each piece of information, whether it's an official document, family Bible, or oral history;
- Strive for accuracy in all details. Cross-check information from different sources to ensure its reliability;
- Collaborate with other family members interested in genealogy;
- Be mindful of privacy concerns, especially for living individuals. Avoid sharing sensitive or private information without consent;
- Genealogy is an ongoing process. Regularly update your family tree as new information becomes available, and continue your research;
- Familiarize yourself with genealogical research methods, historical context, and record-keeping practices.

Remember, genealogy is a journey, and it often involves uncovering fascinating stories about your ancestors. Enjoy the process and consider joining genealogy communities for support and additional resources.

## Project details

### File structure

We will use the following convention for the structure:

- `src/components`: Contains the React components, organized by the **Atomic Design** levels:

  - `atoms` serve as the fundamental UI components in React, such as buttons, inputs, labels, and icons. They boast high reusability, minimal logic, and accept data through props. For instance, the `<Button />` atom component straightforwardly renders a `<button>` element;
  - `molecules` on the other hand, are basic combinations of atoms designed for a specific purpose. A molecule like a login form could amalgamate `<Input />` and `<Button />` atoms. Molecules may include local state and logic;
  - `organisms` integrate molecules to create intricate UI sections. For instance, a header organism might encompass logo, nav, and user menu molecules. Organisms are highly reusable and often are stateful;
  - `templates` play the role of orchestrating UI layouts. They bring together organisms into page sections and may establish designated areas for inserting content. An example is the `<DashboardTemplate />`, which organizes header, sidebar, and body organisms;
  - `Pages` represent distinct app screens or routes. They integrate templates, organisms, and other components to form comprehensive views. Components like `<HomePage />` and `<SettingsPage />` function at the page level;

- `src/utils`: Contains utility functions, such as API calls, validation functions, and other helper functions;
- `src/context`: Holds React context providers for managing global state (e.g., authentication, themes);
- `src/hooks`: Place for the custom hooks our app uses;
- `src/styles`: Contains CSS styles for your application;
- `App.tsx`: The main application component where you assemble your routing and global context providers;
- `main.tsx`: The entry point of your application.

We will store the styles in a single file, as we intend to minimally customize what [picocss](https://v2.picocss.com/docs) provides.

Our assets will mainly stay inside the `/public` folder, for better optimization during the build process with `vite`. However, we will use the `./src/assets/` folder in case we want to import the assets in javascript.

```md
src/
|-- components/
| |-- atoms/
| | |-- Button.tsx
| | |-- Input.tsx
| | |-- ...
| |-- molecules/
| | |-- LoginForm.tsx
| | |-- ...
| |-- organisms/
| | |-- Header.tsx
| | |-- ...
| |-- templates/
| | |-- DashboardTemplate.tsx
| | |-- ...
| |-- pages/
| | |-- Home.tsx
| | |-- UserProfile.tsx
| | |-- ...
|-- utils/
| |-- api/
| | |-- api.ts
| |-- helpers/
| | |-- validation.ts
| |-- ...
|-- context/
| |-- AuthContext.tsx
| |-- ThemeContext.tsx
| |-- ...
|-- hooks/
| |-- useLocalStorage.ts
| |-- ...
|-- assets/
| |-- images/
| |-- icons/
| |-- ...
|-- styles/
| |-- global.css
|-- App.tsx
|-- main.tsx
|-- ...
```

### Visual Studio Code

If you use this editor, you might want to create `./.vscode/settings.json` with the following content:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.probe": ["javascript", "javascriptreact", "vue"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": ["source.formatDocument", "source.fixAll.eslint"],

  "css.lint.unknownAtRules": "ignore",
  "scss.lint.unknownAtRules": "ignore"
}
```

### Quick UUID

To get a quick valid UUID, use the browser's console to run this command: `console.log(crypto.randomUUID())`

## Credits

- [Romanian Royal Family](https://en.wikipedia.org/wiki/Romanian_royal_family)
- [Tree icon in ./public/tree-16px.png](https://www.flaticon.com/free-icon/tree_642021?term=tree&page=1&position=28&origin=tag&related_id=642021)
- [A Friendly Guide to the Atomic File Structure in React](https://medium.com/@simo-dlamini/a-friendly-guide-to-the-atomic-file-structure-in-react-8bd33e55361c)
- [How to generate uuid()](https://stackoverflow.com/questions/49807952/how-to-generate-uuids-in-js-or-react)
