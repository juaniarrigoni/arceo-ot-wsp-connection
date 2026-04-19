import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';

import OTList from './pages/OTList';
import OTDetail from './pages/OTDetail';
import OTForm from './components/OTForm';
import PersonalABM from './pages/PersonalABM';
import Layout from './components/Layout';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/ot" replace />} />
                    <Route element={<Layout />}>
                        <Route path="/ot" element={<OTList />} />
                        <Route path="/ot/nueva" element={<OTForm />} />
                        <Route path="/ot/:id" element={<OTDetail />} />
                        <Route path="/personal" element={<PersonalABM />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster richColors position="top-right" />
        </QueryClientProvider>
    </StrictMode>
);
