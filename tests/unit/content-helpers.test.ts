import { describe, expect, it, vi } from "vitest";

vi.mock("astro:content", () => ({
	getCollection: async () => [],
}));

const { buildCategoryList, buildTagList, comparePostsByDateDesc } =
	await import("@utils/content-utils");

describe("comparePostsByDateDesc", () => {
	it("sorts newer dates first and breaks ties deterministically by slug", () => {
		const posts = [
			{ slug: "zh/b-post", data: { published: new Date("2026-11-24") } },
			{ slug: "zh/a-post", data: { published: new Date("2026-11-24") } },
			{ slug: "zh/newer", data: { published: new Date("2026-11-25") } },
		];

		const sorted = [...posts].sort(comparePostsByDateDesc);
		expect(sorted.map((p) => p.slug)).toEqual([
			"zh/newer",
			"zh/a-post",
			"zh/b-post",
		]);
	});
});

describe("buildTagList", () => {
	it("trims whitespace, ignores blank tags, and deduplicates tags per post", () => {
		const tags = buildTagList([
			{ data: { tags: [" Astro ", "Astro", "   ", "TypeScript"] } },
			{ data: { tags: ["TypeScript"] } },
		]);

		expect(tags).toEqual([
			{ name: "Astro", count: 1 },
			{ name: "TypeScript", count: 2 },
		]);
	});
});

describe("buildCategoryList", () => {
	it("trims categories and folds blank or null values into localized uncategorized", () => {
		const zhCategories = buildCategoryList(
			[
				{ data: { category: "  Notes " } },
				{ data: { category: "   " } },
				{ data: { category: null } },
			],
			"zh_CN",
		);

		expect(zhCategories).toEqual([
			{ name: "Notes", count: 1, url: "/archive/?category=Notes" },
			{ name: "未分类", count: 2, url: "/archive/?uncategorized=true" },
		]);

		const enCategories = buildCategoryList(
			[{ data: { category: "" } }],
			"en",
		);
		expect(enCategories).toEqual([
			{ name: "Uncategorized", count: 1, url: "/en/archive/?uncategorized=true" },
		]);
	});
});
