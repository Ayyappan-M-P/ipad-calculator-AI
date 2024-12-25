import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import Home from './screen/index'; // Ensure the path is correct
import './index.css';

const routes = [
  {
    path: '/',
    element: <Home />, // Correct JSX syntax here
  },
];

const router = createBrowserRouter(routes); // Renamed for clarity

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
