import PageNotFound from './PageNotFound/PageNotFound';
import auth_routes from './modules/Auth/Auth.routes';
import onboarding_routes from './modules/Onboarding/Onboarding.routes';
import "./App.scss";
import { Navigate, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './shared/Context/AuthContext';
import sandbox_routes from './modules/Sandbox/sandbox.routes';
import LoadingSpinner from './shared/LoadingSpinner/LoadingSpinner';
import patrol_route_configuration from './modules/PatrolRouteConfiguration/patrol-route-configuration.routes';
import PrivateRoute from './shared/RouteGuard/PrivateRoute';

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState([null])
  const [isLoading, setIsLoading] = useState(true)


  const login = useCallback((data) => {
    setToken(data.token)
    setUser(data)
    
  
    localStorage.setItem('userData', JSON.stringify(data))

    return true

  }, [])
  const loading = useCallback((load) => {
    setTimeout(() => {
      setIsLoading(load)
    }, 200);
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('userData')
    window.location.href = "/"
  }, [])

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('userData'))

    if (savedData && savedData.token) {
      
      login(savedData)
    }

    loading(false)

 }, [login, loading])
 
 const router =  createBrowserRouter([
  {
    path: "",
    Component: () => <Navigate to={"/auth"} />,
  },
  sandbox_routes,
  onboarding_routes,
  patrol_route_configuration,
  auth_routes ,
  {
    path: "*",
    element: <PageNotFound />,
  },
])

 return (
  
  <AuthContext.Provider value={{
      isLoggedIn: !!token,
      user: user,
      token: token,
      login: login,
      logout: logout,
      loading: loading,
      isloading: isLoading
  }} >
    {isLoading && <LoadingSpinner/>}
  
    <RouterProvider router={router} />
  </AuthContext.Provider>
   
 )
}

export default App;
