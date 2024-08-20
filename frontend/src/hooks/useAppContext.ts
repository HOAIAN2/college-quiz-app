import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function useAppContext() {
	return useContext(AppContext);
}
