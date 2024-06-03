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
			generateScopedName: 'x[hash:base64:6]'
		}
	},
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[hash:20].js`,
				chunkFileNames: `assets/[hash:20].js`,
				assetFileNames: `assets/[hash:20].[ext]`
			}
		}
	}
});
