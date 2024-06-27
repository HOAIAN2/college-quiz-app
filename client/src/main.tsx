import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppContextProvider } from './contexts/AppContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AppContextProvider>
			<App />
		</AppContextProvider>
	</React.StrictMode>,
);
