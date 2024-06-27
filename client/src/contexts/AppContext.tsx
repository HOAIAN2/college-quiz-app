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
			has: (name: string) => permissions.includes(name),
			hasAnyFormList(permissionsToCheck: string[]) {
				return permissionsToCheck.some(permission => permissions.includes(permission));
			}
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
