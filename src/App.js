import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import store from './store';
import history from './history';
import Layouts from './layouts';
import { THEME_CONFIG } from './configs/AppConfig';
import './lang';
import "react-toastify/dist/ReactToastify.css";
import socketService from './services/SocketService';
import './assets/styles/custom-scrollbar.css';

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

// Create a separate component for the content that needs Redux
function AppContent() {
  const alldata = useSelector((state) => state.generalsetting.generalsetting.data);
  const companyData = Array.isArray(alldata) ? alldata[0] : alldata;

  useEffect(() => {
    // Update title
    document.title = companyData?.title || 'CRM';

    // Update favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon && companyData?.favicon) {
      favicon.href = companyData.favicon;
    }

    // Update apple-touch-icon as well if needed
    const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
    if (appleIcon && companyData?.favicon) {
      appleIcon.href = companyData.favicon;
    }
  }, [companyData,alldata]);

  useEffect(() => {
    // Initialize socket connection
    const socket = socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <ThemeSwitcherProvider
      themeMap={themes}
      defaultTheme={THEME_CONFIG.currentTheme}
      insertionPoint="styles-insertion-point"
    >
      <Layouts />
    </ThemeSwitcherProvider>
  );
}

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter history={history}>
          <AppContent />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;