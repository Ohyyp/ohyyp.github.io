import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	base: "/",
	resolve: {
		alias: {
			"@components": fileURLToPath(new URL("./src/components", import.meta.url)),
			"@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
			"@constants": fileURLToPath(new URL("./src/constants", import.meta.url)),
			"@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
			"@i18n": fileURLToPath(new URL("./src/i18n", import.meta.url)),
			"@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		include: ["tests/**/*.test.ts"],
		environment: "node",
	},
});
