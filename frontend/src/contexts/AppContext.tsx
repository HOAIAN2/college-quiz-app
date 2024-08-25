import { ReactNode, createContext, useRef, useState } from 'react';
import { UserDetail } from '../models/user';
import languageUtils from '../utils/languageUtils';

type AppContextType = ReturnType<typeof useAppContextValue>;

const init: unknown = null;
export const AppContext = createContext<AppContextType>(init as AppContextType);

function useAppContextValue() {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [language, setLanguage] = useState(languageUtils.getLanguage());
	const [permissions, setPermissions] = useState<string[]>([]);
	const [user, setUser] = useState<UserDetail | undefined>();
	const [title, setTitle] = useState('');
	return {
		DOM: {
			sideBarRef: sidebarRef,
		},
		appLanguage: {
			language,
			setLanguage
		},
		user: {
			user,
			setUser
		},
		permissions: {
			permissions: permissions,
			setPermissions: setPermissions,
			has: (permissionName: string) => permissions.includes(permissionName),
			hasAnyFormList(permissionNames: string[]) {
				return permissionNames.some(permission => permissions.includes(permission));
			}
		},
		appTitle: {
			title: title,
			setAppTitle(text: string, ignoreDocumentTitle = false) {
				setTitle(text);
				if (!ignoreDocumentTitle) document.title = text;
			}
		},
	};
}

export function AppContextProvider({ children }: { children: ReactNode; }) {
	const contextValue = useAppContextValue();
	return (
		<AppContext.Provider value={contextValue}>
			{children}
		</AppContext.Provider>
	);
}
