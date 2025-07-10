import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App component", () => {
   test('renders Webpack + React App text', () => {
    render(<App />);
    const heading = screen.getByText(/webpack \+ react/i);
    expect(heading).toBeInTheDocument();
  });
});
