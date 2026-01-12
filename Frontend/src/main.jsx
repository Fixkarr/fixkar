import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import { ToastContainer } from 'react-toastify'
  import {HelmetProvider} from 'react-helmet-async'

  if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => {
        console.log("SW registered:", reg.scope);
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  });
}

createRoot(document.getElementById('root')).render(
 <HelmetProvider>
   <AuthProvider>
    <BrowserRouter>
     <Provider store={store}>
       <ToastContainer   
        position="top-right"  // You can change to "bottom-left", etc.
        autoClose={3000}      // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
  />
       <App />
     </Provider>
    </BrowserRouter>
  </AuthProvider>

 </HelmetProvider>
)
