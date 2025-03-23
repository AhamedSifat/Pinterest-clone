import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import HomePage from './pages/homepage/HomePage.jsx';
// import CreatePage from './pages/createpage/CreatePage';
// import PostPage from './pages/postpage/PostPage';
// import AuthPage from './pages/authpage/AuthPage';
// import ProfilePage from './pages/profilepage/ProfilePage';
// import SearchPage from './pages/searchpage/SearchPage';
import MainLayout from './pages/layout/MainLayout.jsx';
import { lazy } from 'react';

const queryClient = new QueryClient();

const HomePage = lazy(() => import('./pages/homepage/HomePage.jsx'));
const CreatePage = lazy(() => import('./pages/createpage/CreatePage'));
const PostPage = lazy(() => import('./pages/postpage/PostPage'));
const AuthPage = lazy(() => import('./pages/authpage/AuthPage'));
const ProfilePage = lazy(() => import('./pages/profilepage/ProfilePage'));
const SearchPage = lazy(() => import('./pages/searchpage/SearchPage'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreatePage />} />
            <Route path='/pin/:id' element={<PostPage />} />

            <Route path='/:username' element={<ProfilePage />} />
            <Route path='/search' element={<SearchPage />} />
          </Route>
          <Route path='/auth' element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
