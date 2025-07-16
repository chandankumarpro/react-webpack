# ReactJS Development Best Practices

- [Variable Declarations](#variable-declarations)
- [Function Declarations](#function-declarations)
- [useState Hook](#usestate-hook)
- [useEffect Hook](#useeffect-hook)
- [useRef Hook](#useref-hook)
- [useCallback Hook](#usecallback-hook)
- [useReducer Hook](#usereducer-hook)
- [Context API](#4context-api)
- [State management using useState vs useReducer vs Context API](#state-management-using-usestate-vs-usereducer-vs-context-api)
- [debugging in react app](#debugging-in-react-app)
- [Logging Error](#logging-error-and-response)
- [Responsiveness](#cross-browser-and-cross-device-testing)
- [Measure Performance](#measure-performance)
- [Use of HAR file](#importance-of-har-file)
- [Reasons for unnecessay re-renders](#reasons-for-unnecessay-re-renders)
- [Redux Toolkit (RTK) vs Context API with useReducer](#use-of-redux-toolkit-over-context-api-with-usereducer)

## Variable Declarations

1. Always use **`const`** for values that do not need to be reassigned.  
2. **`const`** values can be **mutated** if they are objects or arrays.  
3. Use **`let`** if the variable is block-scoped and needs to be reassigned e.g. for loop.  
4. Avoid using **`var`** — it gets **hoisted**, which can lead to bugs.
5. Use **`const`** in props destructuring:

    ```js
    const { name, age } = props;
    ```

6. Use **`const`** in state variables.

    ```js
    const [count, setCount] = useState(0);
    ```

## Function Declarations

### Arrow functions

1. For react component declaration prefer **Arrow function** (ES6 syntax).
2. If you are inside react component prefer to use **Arrow functions**, this will avoid re-rendering.
3. Avoid inline anonymous function inside JSX for better performamnce.
4. When passing functions to memoized or child components use **Arrow functions with useCallback** to avoid unnecessary re-renders.

    ```js
    const handleClick = useCallback(() => {}, []);
    ```

5. Function name should be meaningful or descriptive.
6. Avoid define functions inside useEffect.

### Named functions

1. Named functions have hoisting behavior.
2. We can use Named function in helper / reuadsable function outside component.
3. **`this`** binding works only in named functions, named functions get thier own **`this`**.

## useState Hook

1. **`useState`** is a React Hook that lets you add a state variable to your component.

    ```js
    const [state, setState] = useState(initialState)
    ```

2. Call useState at the top level of your component to declare one or more state variables.
3. Use right **`initialState`** value type.
4. Pass an updater function when state depends on previous state.

    ```js
    setCount(prev => prev + 1)
    ```

5. For **`Objects`** and **`Arrays`**, you should replace it rather than mutate your existing objects or arrays.

    ```js
    setForm({
    ...form,
    firstName: 'Taylor'
    });
    ```

    ```js
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
   ```

6. To get updated value after state change, use **`useEffect`**.

## useEffect Hook

1. **`useEffect`** is a React Hook that let us to perform side effects in functional components like:
    - **a.** Fetching Data
    - **b.** Subscribing to events
    - **c.** Timers
    - **d.** Manual interaction with DOM.

    Syntax:

    ```js
    useEffect(() => {
        //logic

        //clean up(optional)
        return () => {
            //logic
        }
    },[dependencies])
    ```

2. **`useEffect`** dependencies rule:
    - **a.** `[]` - Empty dependecy for run useEffect on components mount.
    - **b.** `[a,b]` useEffect will run on when effect a or b dependency change and on component mount.
    - **c.** No array -- Not recomended - runs of every renders.

3. We should call **`useEffect`** at top level of our component, we can't call inside loops or conditions.
4. Remove unnecessary objects and functions from dependencies.
5. For unrelated logic we can write separate use effetcs with proper dependencies.
6. don't use Async function directly.

    ```js
    // correct use of async 
    useEffect(() => {
    const fetchData = async () => { ... };
    fetchData();
    }, []);
    ```

7. Don't mutate state inside dependency, this will result infinte loop.

    ```js
    // Never mutate like this
    useEffect(() => {
    setValue(value + 1);
    }, [value]);
    ```

8. Always write cleanup function for best practices.

    ```js
    // A sample useEffect with cleanup function
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${userId}`, { signal });
                const data = await res.json();
                setUser(data);
            } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
            // Handle other errors
            }
            }
        };

        fetchUser();

        return () => {
          controller.abort();
        };
    }, [userId]);
    ```

## useRef Hook

1. Syntax

    ```js
    const ref = useRef(null)
    ```

2. We can use **`useRef`** hook to:
    - **a.** Persist value across renders without trigger re-renders.
    - **b.** Directly reference DOM element.
    - **c.** It returns a mutable object **`{current:value}`**.
3. Don't read or write **`ref.current`** during rendering.
4. Don't pass **`useRef`** to your own component like below:

    ```js
    // below code will throw error : Cannot read properties of null
    const inputRef = useRef(null);

    return <MyInput ref={inputRef} />;
    ```

5. If we need to pass ref to child component we need to wrap child component with forwardRef.

    ```js
    import {forwardRef} from 'react'
    const MyInput = forwardRef((props, ref) => {
        return (
            <div>
                <label>{props.label}</label>
                <input ref={ref} {...props} />
            </div>
        );
    });
    ```

## useCallback Hook

1. Syntax

    ```js
    const callbackFn = useCallback(() => {
    // function body
    }, [dependencies]);
    ```

2. useCallback is a React Hook that lets you cache a function definition between re-renders.
3. You should only rely on useCallback as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add useCallback back.
4. Don't use **`useCallback`** if you are not passing function to children or memoize hook.
5. Don't use **`useCallback`** if your funtion doesn't use fequently changing props and state.

## useReducer Hook

1. Syntax:

    ```js
    const [state, dispatch] = useReducer(reducerFn, initialState);
    ```

2. useReducer is a React Hook that lets you add a reducer to your component. This hook is used for managing state transitions.

3. We can use **`useReducer`** if:
    - **a.** Our State logic is complex.
    - **b.** State update depends on previous state.
    - **c.** Two of more state having same related states.

4. Example

    ```js
    const initialFormState = {
      name: '',
      email: '',
      isTouched: false
    };

    const formReducer = (state, action) => {
      switch (action.type) {
        case 'UPDATE_FIELD':
          return { ...state, [action.field]: action.value };
        case 'TOUCH':
          return { ...state, isTouched: true };
        case 'RESET':
          return { name: '', email: '', isTouched: false };
        default:
          return state;
      }
    };


    const Export default FormComponent() {
    const [state, dispatch] = useReducer(formReducer, initialFormState);

        return (
            <form>
                <input
                  value={state.name}
                  onChange={e =>
                    dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })
                  }
                />
                <input
                  value={state.email}
                  onChange={e =>
                    dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })
                  }
                />
                <button type="button" onClick={() => dispatch({ type: 'TOUCH' })}>
                  Touch
                </button>
                <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
                    Reset
                </button>
            </form>
        );
    }
    ```

5. State is read-only. Don’t modify any objects or arrays in state. Instead, always return new objects from your reducer:

    ```js
    function reducer(state, action) {
        switch (action.type) {
            case 'incremented_age': {
                return {
                ...state,// copy all properties of state
                age: state.age + 1
                };
            }
        }
    }
    ```

## State Management using useState vs useReducer vs context API

1. React offers many powerful tools for managing state in our applications. useState, useReducer, and the Context API are more commonly used and are built-in functional hooks.

2. When to use **`useState`** hook:
    - When we need state for our current component and we need not to prop drill to other components.
    - It's independent, small, and doesn't require complex updates.
    - Some examples use cases are in :
        - a counter
        - form input
        - toggle state
        - tab selection
        - modal visiblity etc.
    e.g.

    ```js
    const [count, setCount] = useState(0);

    const incrementFn = () => {
        setCount(prev => prev + 1)
    }

    <button onClick={incrementFn}>Increment</button>
    ```

3. When to use **`useReducer`** hook:
    - When we have complex state logic.
        e.g.

        ```js
        // Here state of "step" may affect "error" state or formdata
        const initialState = {
          step: 1,
          formData: {},
          error: null,
        };

        function formReducer(state, action) {
          switch (action.type) {
            case 'NEXT_STEP':
              return { ...state, step: state.step + 1 };
            case 'UPDATE_FIELD':
              return {
                ...state,
                formData: { ...state.formData, [action.field]: action.value },
              };
            case 'SET_ERROR':
              return { ...state, error: action.payload };
            default:
              return state;
          }
        }
        ```

    - When more than one state are uses for same purpose like username and email in login form.
        e.g.

        ```js
        // In this case, state of "total" is dependent on state of "item[]"
        const initialState = {
            items: [],
            total: 0,
        };

        function cartReducer(state, action) {
          switch (action.type) {
            case 'ADD_ITEM':
              const updatedItems = [...state.items, action.payload];
              const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
              return { items: updatedItems, total: updatedTotal };

            case 'REMOVE_ITEM':
              const filteredItems = state.items.filter(item => item.id !== action.payload);
              const newTotal = filteredItems.reduce((sum, item) => sum + item.price, 0);
              return { items: filteredItems, total: newTotal };

            default:
              return state;
          }
        }
        ```

    - When state action depends on previous state or other state.
        e.g.

        ```js
        // Here each "TOGGLE" action depend on state od "isOn" 
        const initialState = {
        isOn: false,
        history: [],
        };

        function toggleReducer(state, action) {
          switch (action.type) {
            case 'TOGGLE':
              return {
                isOn: !state.isOn,
                history: [...state.history, state.isOn],
              };
            case 'UNDO':
              const last = state.history.pop();
              return {
                isOn: last ?? state.isOn,
                history: [...state.history],
              };
            default:
              return state;
          }
        }
        ```

### 4.Context API

1. The Context API provides a way to pass data through the component tree without having to pass props down manually at every level (known as "prop drilling").
2. We can't over use context api, It may make components less reusable.
3. Always use contextProvider at root level of application like in app.js
4. For better performance and organization, consider breaking down your global state into smaller, more specific contexts rather than a single large context. This helps prevent unnecessary re-renders of components that only rely on a small part of the global state.  
5. Best use of context API is in simple global state management like **theme setting** and **language preference**.
6. Example of theme context

    ```js
    // ThemeContext.js
    import React, { createContext, useState, useContext } from 'react';

    const ThemeContext = createContext();

    export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const contextValue = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
          {children}
        </ThemeContext.Provider>
    );
    };

    export const useTheme = () => {
        return useContext(ThemeContext);
    };
    ```

    ```js
    import React from 'react';
    import { ThemeProvider } from './ThemeContext';
    import Header from './Header';

    function App() {
      return (
        <ThemeProvider>
            <div>
            <Header />
            // other components
            </div>
        </ThemeProvider>
      );
    }

    export default App;
    ```

    ```js
    import React from 'react';
    import { useTheme } from './ThemeContext';

    function Header() {
      const { theme, toggleTheme } = useTheme();

      return (
        <header style={{ background: theme === 'light' ? '#f0f0f0' : '#333', color: theme === 'light' ? '#333' : '#fff', padding: '10px' }}>
          <h2>Current Theme: {theme}</h2>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </header>
      );
    }

    export default Header;
    ```

7. For more complex global state logic, it's a common and powerful pattern to combine Context API with useReducer. The useReducer manages the complex state updates, and the Context API provides the state and dispatch function to the component tree.
    e.g:

    ```js
    // AuthContext.tsx
    const AuthContext = createContext();

    const initialState = { user: null, loading: false, error: null };

    function authReducer(state, action) {
      switch (action.type) {
        case 'LOGIN_START': return { ...state, loading: true };
        case 'LOGIN_SUCCESS': return { user: action.payload, loading: false };
        case 'LOGIN_FAIL': return { ...state, error: action.payload, loading: false };
        case 'LOGOUT': return initialState;
        default: return state;
      }
    }

    function AuthProvider({ children }) {
      const [state, dispatch] = useReducer(authReducer, initialState);

      return (
        <AuthContext.Provider value={{ state, dispatch }}>
          {children}
        </AuthContext.Provider>
      );
    }
    ```

    ```js
    // Usage
    const { dispatch } = useContext(AuthContext);

    const handleLogin = async () => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const user = await loginApiCall();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (err) {
        dispatch({ type: 'LOGIN_FAIL', payload: err.message });
      }
    };
    ```

## debugging in react app

1. In browser DevTools, set breakpoints inside event handlers, lifecycle methods, effects, etc.
2. Use of react developer tool Extension. It has tow section:

    - **a.** The Components tool, where you can analyse the structure of the components.
    - **b.** The Profiler tool, where you can see the time each component took to render and how they are updated.

3. Use of ESLint with React plugin and type checking like PropType. It helps to prevent bugs before runtime.
4. Use of breack points inside JSX
  e.g:

    ```js
    setTimeout(() =>{
      debugger;
      // code
    },2000)
    ```

5. These are the debugging best practice steps:
    - **a.** Start by analysing the workflow the code is following that affects a particular section of code.
    - **b.** If nothing wrong is found, we could use the React Developer Tools to analyse each component closely.
    - **c.** If that analysis is not delivering results, we could apply breakpoints at different sections in the code and see how the variables are being altered.
    - **d.** If everything else fails, just comment out pieces of code and see what happens.

## Logging error and response

1. Use console.log, console.warn, or console.error to inspect variables, props, state.
  e.g:

    ```js
    // Avoid console logs in production
    console.log("User login data:", userData);
    ```

2. In React, an **`Error Boundary`** is a component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a      fallback UI instead of crashing the whole component tree.

    Steps to use Error Boundary in functional component:
     - Install react-error-boundary

      ```bash
      npm install react-error-boundary
      ```

      ```js
      // Create Fallback component
      const ErrorFallback = ({ error }) => (
        <div role="alert" style={{ color: 'red' }}>
          <p>Something went wrong:</p>
          <pre>{error.message}</pre>
        </div>
      );

      export default ErrorFallback;
      ```

      ```js
      // Wrap root component
      import React from 'react';
      import { ErrorBoundary } from 'react-error-boundary';
      import Employee from './components/Employee';
      import ErrorFallback from './components/ErrorFallback';

      const App = () => {
      const employeeData = {
        name: 'John Doe'
      };

        return (
          <div>
            <h1>Company Portal</h1>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Employee employee={employeeData} />
            </ErrorBoundary>
          </div>
        );
      };

      export default App;
      ```

      ```js
      //Use in any component
      import React from 'react';

      const Employee = ({ employee }) => {
        if (!employee) {
          throw new Error('Employee data is not available.');
        }

        return (
          <div>
            <h3>Employee Details</h3>
            <p>Name: {employee.name}</p>
            <p>Position: {employee.position}</p>
          </div>
        );
      };

      export default Employee;
      ```

3. We can use some external tools like **Sentry**, which provide custom error boundry component for react. It automatically sends JavaScript errors within a component tree to Sentry.
4. Use an Axios interceptor to log requests, responses & timing.

## Cross Browser and Cross Device testing

1. Cross browser and cross device testing includes:
    - Different browsers like Chrome, Firefox, Safari, Edge etc.
    - Different devices like mobile, desktop, tablet etc.
    - Different screen size and resolutions.
2. We can use responsive design approach like:
    - CSS media queries
    - Resposive units like %, vw, rem etc.
3. We can use Device Emulation in browswer devtool.
4. Test responsive on incognito mode.

## Measure Performance

1. The first step in improving the performance of a React application is to measure its current performance. Some of tools to measure performance:

      - Lighthouse - Open source tool available on most of brouser extension.
      - React devtool - Helps ue to record the activity in our app an genarate report. It helps to detect render and re-render of react component.

2. We can use **`React.memo`** in functional components with some point to considered:
    - Only use if component of to expensive when re-rendering occurs.
    - Component should pure.
    - Use along with **`useMemo`** and **`useCallback`** for complex function and states.
3. Use lazy loading - It helps to load the content when needed also known as code slitting.
    e.g:

    ```js
    import React, { Suspense } from 'react';

    const LazyComponent = React.lazy(() => import('./LazyComponent'));

    function App() {
      return (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </Suspense>
        </div>
      );
    }
    ```

4. We can use **`React.lazy()`** together with React Router.

      ```js
      const Home = React.lazy(() => import('./pages/Home'));
      const About = React.lazy(() => import('./pages/About'));

      <Route path="/home" element={
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      } />
      ```

5. We can optimize Image and asset loading.
6. Optimize API calls using tools like **`React Query`** and **`SWR`**.

## Importance of HAR File

1. A HAR file is a JSON-formatted archive file that records a web browser’s interaction with a site.
2. How to generate a HAR file?

    - On Web Browser nevigate to deletools.
    - Load the page with network tab open.
    - Right clich on request list and save as HAR file.

3. HAR file contain different kind of logs. some of them are

    - HTTP requests and responses.
    - Headers
    - Cookies
    - Query String
    - Payload request/response
    - How much time taken in each request.

4. There are several instance when HAR file help us in performance optimisation like:

    - When debugging react app that is having network related issues.
    - Repoting bug to backend developer or API provider.
    - Large payload or insufficient resources.

## Reasons for unnecessay re-renders

1. **Using inline functions in JSX props:** If you pass an inline function as a prop to child components, those components will get re-rendered every time the parent component re-renders. This is because a new function is created on every render. You can optimize this by using useCallback hook to memoize the function.

2. **Using useState hook with objects:** If you use useState hook with objects, you need to make sure that you are not mutating the object. If you mutate the object, React will not be able to detect the change and will not re-render the component. You can optimize this by using useReducer hook instead of useState hook.

3. **Using useEffect hook without dependencies:** If you use useEffect hook without dependencies, it will run on every render. You can optimize this by passing an empty array as the second argument to useEffect hook.

4. **Parent Component Re-renders:** If a parent component re-renders, all its child components will also re-render. You can optimize this by using React.memo to memoize the child component where possible.

5. **Global State Changes:** If you use global state management libraries like Redux, MobX, etc., and the global state changes, all the components that use that state will re-render. You can optimize this by using useSelector hook to select only the state that you need in a component.

6. **Misusing Context:** If you use Context API to pass data to child components, and the data changes, all the child components will re-render. You can optimize this by using useContext hook to select only the data that you need in a component.
You can also use React.StrictMode to detect potential problems in your code that could cause unnecessary re-renders.

## Use of Redux Toolkit over Context API with useReducer

### 1. Better Scalability and Structure

- RTK is designed for building scalable state management architecture with predefined structure and conventions.
- Context + useReducer gets harder to maintain as your app grows—nesting multiple contexts can become cumbersome.
- RTK enforces best practices like separating logic into "slices," making large codebases easier to manage.

### 2. Boilerplate Reduction

- RTK reduces traditional Redux boilerplate through utilities like createSlice, createAsyncThunk, etc.
- Context + useReducer often requires manually writing types, reducers, actions, and dispatchers.
- RTK heps in Faster development and fewer chances for bugs due to repetitive code.

### 3. Built-in DevTools Support

- RTK integrates seamlessly with the Redux DevTools extension.
- Context + useReducer lacks built-in debugging tools and requires manual logging.
- Redux DevTools enable powerful debugging, time-travel, and state inspection.

### 4. Built-in Async Handling

- RTK offers createAsyncThunk for handling async logic with loading/error states built-in.
- Context + useReducer needs custom logic (often messy) for handling side effects.
- RTK helps to write Clean, declarative async flows save time and reduce bugs.

### 5. Middleware and Ecosystem Support

- RTK supports middleware like redux-thunk, redux-saga, or custom ones.
- Context API does not support middleware out of the box.
- Middleware helps with logging, analytics, async flows, and more.

### 6. Performance Optimization

- RTK encourages useSelector with memoization via React-Redux, avoiding unnecessary re-renders.
- Context re-renders all consumers on any change unless manually optimized using memoization or splitting contexts.
- RTK provides better performance out of the box in many cases.

### 7. Sample Example

#### 1. install npm packages

```cmd
npm install @reduxjs/toolkit
```

```cmd
npm install react-redux
```

#### 2. Create store.ts file

```js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/counter/counterSlice";


export const store = configureStore({
    reducer : {
        counter: counterReducer
    }
} )

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```js
// Use store in root component
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './App/store/store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

#### 3. Create slices e.g counterSlice

```js
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

type CounterState = {
    value: number
}

const initialState: CounterState = {
    value: 0
}

// create slice
const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => { state.value += 1},
        decrement: (state) => { state.value -= 1},
        incrementByValue: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(incrementAsync.pending, () => {console.log("incrementAsync.pending")})
        .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
            state.value += action.payload
        })
    }
})

// reducer for http requests
export const incrementAsync = createAsyncThunk(
    "counter/incrementAsync",
    async (amount:number) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return amount;
    }
)

// export reducers
export const {
    increment, 
    decrement, 
    incrementByValue,
} = counterSlice.actions;

export default counterSlice.reducer;
```

#### 4. Use slices in your components

```js
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../App/store/store"
import {
  decrement,
  increment,
  incrementAsync,
  incrementByValue,
} from "../../features/counter/counterSlice";

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch<AppDispatch>();
  return (
    <div>
        <h2>{count}</h2>
        <div>
            <button onClick={() =>dispatch(increment())}>Increment</button>
            <button onClick={() =>dispatch(decrement())}>Decrement</button>
            <button onClick={() =>dispatch(incrementByValue(2))}>incrementByValue</button>
            <button onClick={() =>dispatch(incrementAsync(20))}>incrementAsync</button>
        </div>
    </div>
  )
}
export default Counter
```
