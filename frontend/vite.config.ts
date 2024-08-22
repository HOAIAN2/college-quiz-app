import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
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
	},
	define: {
		__APP_VERSION__: JSON.stringify('1.0.0'),
		__APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
	}
});
