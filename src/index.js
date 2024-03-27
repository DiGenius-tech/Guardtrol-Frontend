import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PageNotFound from './PageNotFound/PageNotFound';
import auth_routes from './modules/Auth/Auth.router';
import onboarding_routes from './modules/Onboarding/Onboarding.router';
import MuiTest from './sandbox/MuiTest/MuiTest';


const router = createBrowserRouter([
  {
    path: "sandbox",
    element: <MuiTest />
  },
  auth_routes,
  onboarding_routes,
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
