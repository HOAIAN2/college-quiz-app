import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 3000
	},
	css: {
		modules: {
			generateScopedName: '[hash:base64]',
		}
	},
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[hash].js`,
				chunkFileNames: `assets/[hash].js`,
				assetFileNames: `assets/[hash].[ext]`
			}
		}
	}
});
