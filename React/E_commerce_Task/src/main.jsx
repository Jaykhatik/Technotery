import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/app/store.js';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Provider>
)
