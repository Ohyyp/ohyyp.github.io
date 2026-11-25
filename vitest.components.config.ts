import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		include: ["tests/components/**/*.test.ts"],
		environment: "node",
	},
});
