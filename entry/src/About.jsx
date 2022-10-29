import { Suspense, lazy } from "react";

const Detail = lazy(() => import('./AboutDetail'));

export default function About() {
  return <div>
    <p>About</p>
    <Suspense fallback={<div>loading detail...</div>}>
      <Detail></Detail>
    </Suspense>
  </div>
}
