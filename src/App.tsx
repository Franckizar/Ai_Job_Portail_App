@@ .. @@
 import React from 'react';
-import { AuthModal } from './components/auth/AuthModal';
+import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
+import { ThemeProvider } from './contexts/ThemeContext';
+import { AuthProvider } from './components/auth/AuthContext';
+import { Layout } from './components/layout/Layout';
+import { Home } from './pages/Home';
import { Companies } from './pages/Companies';
import { Resume } from './pages/Resume';
import { Analytics } from './pages/Analytics';
+import { Jobs } from './pages/Jobs';
 import './App.css';
 
 function App() {
   return (
-    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
-      <div className="max-w-md w-full">
-        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
-          Welcome to JobPortal AI
-        </h1>
-        <AuthModal isOpen={true} onClose={() => {}} />
-      </div>
              <Route path="companies" element={<Companies />} />
              <Route path="resume" element={<Resume />} />
              <Route path="analytics" element={<Analytics />} />
-    </div>
+    <ThemeProvider>
+      <AuthProvider>
+        <Router>
+          <Routes>
+            <Route path="/" element={<Layout />}>
+              <Route index element={<Home />} />
+              <Route path="jobs" element={<Jobs />} />
+            </Route>
+          </Routes>
+        </Router>
+      </AuthProvider>
+    </ThemeProvider>
   );
 }