import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Placeholder Navbar */}
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-500">AirBNB</h1>
            <nav className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/register" className="text-gray-600 hover:text-gray-900">Register</a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl mx-auto w-full p-4">
          <Routes>
            <Route path="/" element={<div className="p-8 text-2xl font-bold text-gray-800">Home Page Placeholder (Listings go here)</div>} />
            <Route path="/login" element={<div className="p-8 text-2xl font-bold text-gray-800">Login Form Placeholder</div>} />
            <Route path="/register" element={<div className="p-8 text-2xl font-bold text-gray-800">Registration Form Placeholder</div>} />
            <Route path="*" element={<div className="p-8 text-2xl font-bold text-red-600">404 - Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
