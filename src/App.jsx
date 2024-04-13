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
import client_routes from './modules/Client/client.routes';
import { toast } from "react-toastify";
import { SubscriptionContext } from './shared/Context/SubscriptionContext';
import useHttpRequest from './shared/Hooks/HttpRequestHook';

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState([null])
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const { error, responseData, sendRequest } = useHttpRequest();


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
    // setToken(null)
    // setUser(null)
    localStorage.clear()
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
  client_routes,
  patrol_route_configuration,
  auth_routes ,
  {
    path: "*",
    element: <PageNotFound />,
  },
])
useEffect(()=> {
  const getSub = async () => {
    loading(true)
    const data = await sendRequest(
        `http://localhost:5000/api/users/getsubscription/${user.userid}`,
        'GET',
          null,
          {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          }
        )
    if(data && data.status){
      await setCurrentSubscription(data.subscription)
    }else{
      toast.warn("You are not currently Subscribed to any Plan")
    }

    loading(false)

  }
  if (user && token) {
    getSub()
  }
}, [user, token])
const setCurrentSubscription = async (data) => {
  return setSubscription(data)
 
  
  
}

useEffect(() => {
  if (error) {
    toast.error(error)
  }
}, [error])

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
  <SubscriptionContext.Provider value={{
    isSubscribed: !!subscription,
    currentSubscription: subscription,
    setCurrentSubscription:setCurrentSubscription,
  }} >
    {isLoading && <LoadingSpinner/>}
  
    <RouterProvider router={router} />
    </SubscriptionContext.Provider>
  </AuthContext.Provider>
   
 )
}

export default App;
