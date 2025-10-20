import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import Theme from '@/components/template/Theme';
import Layout from '@/components/layouts';
import { AuthProvider } from '@/contexts/AuthContext';
import mockServer from './mock'
import appConfig from '@/configs/app.config'
import './locales'
import { useZoom } from '@/hooks/useZoom'

const environment = process.env.NODE_ENV

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (environment !== 'production' && appConfig.enableMock) {
    mockServer({ environment })
}

function AppContent() {
    useZoom()
    return (
        <Theme>
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </Theme>
    )
}

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}

export default App
