import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/app/documents",
	plugins: [vue()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // 将 '@' 别名指向 'src' 目录
		},
	},
});
