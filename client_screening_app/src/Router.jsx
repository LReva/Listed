import App from './App';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import Screening from './Pages/Screening';
import ScreeningResult from './Pages/ScreeningResult';
import ScreeningHistory from './Pages/ScreeningHistory';

const Router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
      {
          index: true,
          element: <HomePage/>
      },
      {
          path:"/about-us/",
          element: <AboutUs />
      },
      {
          path:"/sign-up/",
          element: <SignUp />
      },
      {
          path:"/log-in/",
          element: <LogIn />
      },
      {
          path:"/screening/",
          element: <Screening />
      },
      {
          path:"/screening-result/",
          element:<ScreeningResult/>
      },
      {
          path:"/screening-history/",
          element:<ScreeningHistory/>
      }
  ]
}])

export default Router;