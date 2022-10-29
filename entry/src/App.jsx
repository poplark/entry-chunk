import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Dashboard() {
  return <div>
    <p>Dashboard</p>
    todo - content - widget - router
  </div>
}

const About = lazy(() => import('./About'));

function loadWidgets() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {name: 'WA', path: 'wa', file: '/widget/wa.js'},
        {name: 'yy', path: 'yy', file: '/widgets/yyy'},
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
    <Router>
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

      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        {/* todo - dynamic routes */}
        {
          widgets.map((widget) => {
            // const Comp = lazy(() => import(`${widget.file}`));
            // const Comp = (0,react__WEBPACK_IMPORTED_MODULE_0__.lazy)(function () {
            //   return __webpack_require__.e(/*! import() */ widget.file).then(__webpack_require__.bind(__webpack_require__, /*! ./About */ widget.file));
            // });
            const Comp = lazy(function () {
              return __webpack_require__.e(widget.file).then(__webpack_require__.bind(__webpack_require__, widget.file));
            });
            return <Route
              key={widget.path}
              path={widget.path}
              element={<Suspense fallback={<div>loading...</div>}><Comp/></Suspense>}
              />
          })
        }
        <Route path='/about' element={
          <Suspense fallback={<div>loading...</div>}>
            <About/>
          </Suspense>
        }></Route>
      </Routes>

      <footer>
        <h1>Footer</h1>
      </footer>
    </Router>
  )
}
