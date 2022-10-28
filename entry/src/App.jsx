import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Dashboard() {
  return <div>
    <p>Dashboard</p>
    todo - content - widget - router
  </div>
}
function About() {
  return <div>
    <p>About</p>
    todo - content - widget - router
  </div>
}

function loadWidgets() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {name: 'xx', path: '/xx', file: '/widgets/xxx'},
        {name: 'yy', path: '/yy', file: '/widgets/yyy'},
      ])
    }, 1000);
  });
}

export function App() {
  const [widgets, setWidgets] = useState([]);
  useEffect(() => {
    loadWidgets().then((widgets) => {
      setWidgets(widgets);
    })
  }, []);
  return (
    <BrowserRouter>
      <header>
        <h1>Header</h1>
        <nav>
          <Link to="/">Home</Link>
          {/* todo - dynamic link */}
          {
            widgets.map((widget) => <Link key={widget.path} to={widget.path}><p>{widget.name}</p></Link>)
          }
          <Link to="/about">About</Link>
        </nav>
      </header>

      <Suspense fallback={<div>loading...</div>}>
          <Routes>
            <Route path='/' component={Dashboard}></Route>
            {/* todo - dynamic routes */}
            {
              widgets.map((widget) => (
                <Route
                  key={widget.path}
                  path={widget.path}
                  component={lazy(() => import(widget.file))}
                  />
              ))
            }
            <Route path='/about' component={About}></Route>
          </Routes>
      </Suspense>

      <footer>
        <h1>Footer</h1>
      </footer>
    </BrowserRouter>
  )
}
