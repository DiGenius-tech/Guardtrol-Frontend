import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import PageNotFound from './PageNotFound/PageNotFound';
import auth_routes from './modules/Auth/Auth.router';
import onboarding_routes from './modules/Onboarding/Onboarding.router';
import App from './App';
import { ToastContainer } from 'react-toastify';
import sandbox_routes from './modules/Sandbox/sandbox.router';


const router = createBrowserRouter([
  {
    path: "",
    Component: () => <Navigate to="/auth" />,
  },
  sandbox_routes,
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
    <ToastContainer />
    <App />
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
