import { Button } from '@synanetics/syn-library'
import './App.scss'

// This is the starting point for a new prototype built from
// synanetics-applications-prototype-template.
//
// It deliberately does almost nothing yet -- just enough to prove the
// Synanetics stack (React + TypeScript + Vite + SCSS + @synanetics/syn-library)
// is wired up correctly: `npm run dev` should show this page, and the button
// below should render with real design-system styling, not an unstyled
// HTML button.
//
// Replace everything in this file with your prototype's actual screens.
function App() {
  return (
    <div className="App">
      <header className="App__header">
        <h1>New prototype</h1>
        <p>Rename this in index.html and package.json, then start building.</p>
      </header>
      <main className="App__main">
        <p>
          If the button below looks like a styled Synanetics button (not a plain browser button), the design system is
          loading correctly.
        </p>
        {/* variant/modifier values below are a starting guess -- check the library's own docs/Storybook
            for the current set of valid variants before relying on this for a real prototype. */}
        <Button variant="primary" modifier="standard" onClick={() => alert('@synanetics/syn-library is working')}>
          It works
        </Button>
      </main>
    </div>
  )
}

export default App
