import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Stories from "./pages/Stories/Stories";
import Story from "./pages/Story/Story";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AddStory from "./pages/AddStory/AddStory";
import Profile from "./pages/Profile/Profile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoadingSpinner2 from "./components/Loading Spinner/LoadingSpinner2";
import CreateBook from "./pages/CreateBook/CreateBook";
import Book from "./pages/Book/Book";
import Chapter from "./pages/Chapter/Chapter";
import AddMoment from "./pages/AddMoment/AddMoment";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";



const PublicRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  if (authLoading) {
    return <LoadingSpinner2 />;
  }
  return currentUser ? <Navigate to="/" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  if (authLoading) {
    return <LoadingSpinner2 />;
  }
  return currentUser ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  useEffect(() => {
    if (!authLoading && !(currentUser && currentUser.isAdmin)) {
      toast.info("Admin access required.");
    }
  }, [authLoading, currentUser]);
  if (authLoading) {
    return <LoadingSpinner2 />;
  }
  return currentUser && currentUser.isAdmin ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
   return (
      <AuthProvider>
         <ThemeProvider>
            <Router>
               <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                     <ToastContainer theme="colored" autoClose={3000} position="top-center" />
                     <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/stories" element={<Stories />} /> */}
                        {/* <Route path="/story/:partNumber" element={<Story />} /> */}

                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        
                        {/* <Route path="/add-story" element={<AdminRoute><AddStory /></AdminRoute>} /> */}

                        {/* NEW ADDED ROUTES */}
                        <Route path="/books" element={<Book />} />
                        <Route path="/books/:bookId" element={<Book />} />
                        {/* <Route path="/book/:bookId" element={<ProtectedRoute><Book /></ProtectedRoute>} /> */}
                        <Route path="/books/:bookId/chapter/:chapterId" element={<ProtectedRoute><Chapter /></ProtectedRoute>} />

                        <Route path="/create-book" element={<AdminRoute><CreateBook /></AdminRoute>} />
                        <Route path="/books/:bookId/chapter/:chapterId/add-moment" element={<AdminRoute><AddMoment /></AdminRoute>} />
                        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                     </Routes>
                  </main>
                  <Footer />
               </div>
            </Router>
         </ThemeProvider>
      </AuthProvider>
   );
};

export default App;