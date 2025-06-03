import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


// FOR USERS AND PUBLIC
import LoadingSpinner2 from "./components/Loading Spinner/LoadingSpinner2";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Books from "./pages/Books/Books";
import Book from "./pages/Book/Book";
import Chapter from "./pages/Chapter/Chapter";



import Stories from "./pages/Stories/Stories";
import Story from "./pages/Story/Story";
import AddStory from "./pages/AddStory/AddStory";
import CreateBook from "./pages/CreateBook/CreateBook";
import AddMoment from "./pages/AddMoment/AddMoment";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";


// FOR ADMIN PANEL
import AdminLayout     from './layouts/AdminLayout';
import Dashboard       from './pages/AdminPages/Dashboard/Dashboard';
import BooksList           from './pages/AdminPages/BooksList/BooksList';
import UsersList           from './pages/AdminPages/UsersList/UsersList';
import HeroesList          from './pages/AdminPages/HeroesList/HeroesList';
import PaymentsList        from './pages/AdminPages/PaymentsList/PaymentsList';
import NotificationsList   from './pages/AdminPages/NotificationsList/NotificationsList';
import BookDetails from "./pages/AdminPages/BookDetails/BookDetails";
import ChapterMoments from "./pages/AdminPages/ChapterMoments/ChapterMoments";




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
      toast.info("Admin Access Required!");
    }
  }, [authLoading, currentUser]);

  if (authLoading) {
    return <LoadingSpinner2 />;
  }

  return currentUser && currentUser.isAdmin ? ( children ) : ( <Navigate to="/" replace /> );

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

                {/* Public Routes -------------------------------------------------- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />


                {/* Protected Routes for Users -------------------------------------------------- */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                <Route path="/books" element={<Books />} />
                <Route path="/books/:bookId" element={<Book />} />
                <Route path="/books/:bookId/chapter/:chapterId" element={<ProtectedRoute><Chapter /></ProtectedRoute>} />
                {/* <Route path="/stories" element={<Stories />} /> */}
                {/* <Route path="/story/:partNumber" element={<Story />} /> */}



                {/* Admin Routes -------------------------------------------------- */}
                <Route path="/admin/*" element={ <AdminRoute> <AdminLayout /> </AdminRoute> }>
                  <Route index            element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="books"     element={<BooksList />} />
                  <Route path="users"     element={<UsersList />} />
                  <Route path="heroes"    element={<HeroesList />} />
                  <Route path="payments"  element={<PaymentsList />} />
                  <Route path="notifications" element={<NotificationsList />} />

                  {/* extra admin utilities */}
                  {/* <Route path="create-book" element={<CreateBook />} /> */}
                  <Route path="books/:bookId" element={<BookDetails />} />
                  {/* <Route path="books/:slug" element={<BookDetails />} /> */}
                  <Route path="books/:bookId/:chapterNumber" element={<ChapterMoments />} />
                  {/* <Route path="books/:bookId/chapter/:chapterId/add-moment" element={<AddMoment />} /> */}
                  {/* <Route path="add-story" element={<AdminRoute><AddStory /></AdminRoute>} /> */}
                </Route>


                  {/* fallback */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

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