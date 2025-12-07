import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FormPage } from "./pages/FormPage";
import { ProposalView } from "./pages/ProposalView";
import { LoginPage } from "./pages/LoginPage";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { Header } from "./components/ui/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Fixed Header */}
      <Header />

      {/* Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Main Content - Add padding for header */}
      <main className={isAuthenticated ? "pt-20" : ""}>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/proposta/:id" element={<ProposalView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <LoginPage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
