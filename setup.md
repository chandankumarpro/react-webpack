# React setup with webapack and typescript

## 1. Create packege.json with default values

```bash
npm init -y
```

## 2. Two essential libraries for building React applications

```bash
npm install react react-dom
```

## 3. TypeScript and the necessary type definitions to work with React in a TypeScript project

1. typescript - Installs the TypeScript compiler
2. @types/react - TypeScript type definitions for React
3. @types/react-dom TypeScript type definitions for React DOM

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

## 4. Set up Webpack for a TypeScript project

1. Webpack - Bundles your JavaScript/TypeScript files into a single output file
2. webpack-cli - Command Line Interface to run Webpack (webpack or webpack serve)
3. webpack-dev-server - Spins up a local dev server with hot reloading for quick development

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
```

## 5. ts-loader is a Webpack loader that tells Webpack how to handle .ts or .tsx files

```bash
npm install --save-dev ts-loader
```

## 6. HTML Plugin Automatically creates an index.html file in the final build

6a. Injects the compiled JavaScript bundle into **script** tag inside the HTML

```bash
npm install --save-dev html-webpack-plugin
```

## Create intial folders and files

```bash
your-app/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## 7. Create a tsconfig.json file to configure TypeScript

```bash
npx tsc --init
```

## 7.a. Edit tsconfig.json

1. "target": "ES6" - Tells TypeScript to compile the output JavaScript to ECMAScript 6 (ES6).
2. "module": "ESNext" - Controls how modules are handled (like import/export).
3. "lib": ["DOM", "DOM.Iterable", "ESNext"] - Adds built-in type definitions for selected JS environments.
4. "jsx": "react-jsx" - Tells TypeScript how to transform JSX, "react-jsx" is for React 17+ versions(no need to import React in every file) and "react" for older versions.
5. "moduleResolution": "node" - Resolves modules like Node.js and required for Webpack and React projects.
6. "esModuleInterop": true - Allows default imports from CommonJS and enables compatibility between CommonJS and ES modules.
7. "skipLibCheck": true - Skips type checking of declaration files in node_modules.
8. "strict": true - Enables all strict type-checking rules.
9. "forceConsistentCasingInFileNames": true - Prevents mismatches in import paths that differ in casing eg. import MyComponent from './myComponent' vs ./MyComponent
10. "include": ["src"] - ells TypeScript to only include files from the src/ folder.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

## 8. Create webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  devServer: {
    static: "./dist",
    port: 3000,
    open: true,
    hot: true
  }
};
```

## 8. Create HTML Template - punlic/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>React TypeScript App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>

```

## 9. React source files - src/index.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);

```

## 10. src/App.tsx

```tsx

import React from "react";

const App: React.FC = () => {
  return <h1>Hello, React + TypeScript + Webpack!</h1>;
};

export default App;
```

## 11. Update package.json Scripts

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

## 12. Add SCSS (Sass) support to your Webpack + React + TypeScript setup

1. sass - Sass compiler
2. sass-loader - Loads and compiles .scss files
3. css-loader - Resolves @import and url() in CSS files
4. style-loader - Injects styles into the DOM via **style** tags

```bash
npm install --save-dev sass sass-loader css-loader style-loader
```

## 12a. Update webpack.config.js

1. style-loader - Injects styles into DOM
2. css-loader - Translates CSS into CommonJS
3. sass-loader - Compiles Sass to CSS

```js
module.exports = {
  // ...existing config
  module: {
    rules: [
      // ...existing config rules
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
        exclude: /node_modules/
      }
    ]
  },
};
```

### 12b. Create a file src/styles/main.scss

```scss
$primary-color: #007acc;

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: $primary-color;
  color: white;
}
```

### 12c. Import it into your src/index.tsx

```tsx
import "./styles/main.scss";
```

## 14. Steps to add **react router**

```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### 14a. setup basic route

```css
src/
├── App.tsx
├── pages/
│   ├── Home.tsx
│   └── About.tsx
└── index.tsx
```

### 14b. src/pages/Home.tsx

```tsx
import React from 'react';

const Home: React.FC = () => <h2>Home Page</h2>;

export default Home;
```

### 14c. src/pages/About.tsx

```tsx
import React from 'react';

const About: React.FC = () => <h2>About Page</h2>;

export default About;
```

### 14d. src/App.tsx

```tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
```

### 14d. Update webpack.config.js devserver

```js
devServer: {
  static: "./dist",
  port: 3000,
  open: true,
  hot: true,
  historyApiFallback: true,
}

```
