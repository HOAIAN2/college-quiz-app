import { ReactNode, createContext, useRef, useState } from 'react';
import { UserDetail } from '../models/user';
import languageUtils from '../utils/languageUtils';

type AppContextType = ReturnType<typeof useAppContextValue>;

const init: unknown = null;
export const AppContext = createContext<AppContextType>(init as AppContextType);

function useAppContextValue() {
	const sideBarRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const [language, setLanguage] = useState(languageUtils.getLanguage());
	const [permissions, setPermissions] = useState<string[]>([]);
	const [user, setUser] = useState<UserDetail | undefined>();
	return {
		DOM: {
			sideBarRef,
			titleRef
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
			items: permissions,
			setItems: setPermissions,
			has: (permissionName: string) => permissions.includes(permissionName),
			hasAnyFormList(permissionNames: string[]) {
				return permissionNames.some(permission => permissionNames.includes(permission));
			}
		},
		setAppTitle(text: string) {
			document.title = text;
			if (titleRef.current) titleRef.current.textContent = text;
		}
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
