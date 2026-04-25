import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CreateContent from "./pages/CreateContent";
import EditContent from "./pages/EditContent";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="main-area">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateContent />} />
            <Route path="/edit/:id" element={<EditContent />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;