import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import store from './store';
import Layouts from './layouts';
import { THEME_CONFIG } from './configs/AppConfig';
import './lang';
import "react-toastify/dist/ReactToastify.css";
import './assets/styles/custom-scrollbar.css';
import { ConfigProvider } from 'antd';

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
  }, [companyData, alldata]);

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

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider>
            <AppContent />
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;