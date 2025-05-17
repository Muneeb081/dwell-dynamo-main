import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import NotFound from './pages/NotFound';
import AddPropertyPage from './pages/AddPropertyPage';
import MessagesPage from './pages/MessagesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ChatPage from './pages/ChatPage';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';
import EditPropertyPage from "@/pages/EditPropertyPage";
import GoogleCallbackPage from './pages/GoogleCallbackPage';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/add-property" element={<AddPropertyPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/edit-property/:id" element={<EditPropertyPage/>}/>
              <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
