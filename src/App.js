import './App.css';
import { ViewProvider } from "./context/ViewContext";
import ProductPage from './pages/ProductPage';

function App() {
  return (
       <ViewProvider>
    <ProductPage/>
    </ViewProvider>
  );
}

export default App;
