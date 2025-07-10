import React from "react";
import "./styles/main.scss";
import "./App.scss";
import webpackLogo from "./assets/webpack.svg";
import reactLogo from "./assets/react.svg";

const App: React.FC = () => {
  return (
    <div>
       <a href="https://webpack.js.org/guides/typescript/" target="_blank">
          <img height="50px" width="50px" src={webpackLogo} className="logo" alt="webpack logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      <h1>Webpack + React App</h1>
    </div>
  );
};

export default App;
