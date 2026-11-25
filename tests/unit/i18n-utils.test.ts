import {
	getAlternatePath,
	getHtmlLang,
	getLocaleFromPath,
	getLocalizedCategoryUrl,
	getLocalizedNavLinks,
	getLocalizedPath,
	getLocalizedPostUrl,
	getLocalizedTagUrl,
	getPostLocale,
	getPostSlug,
	normalizeLocale,
	pickLocalized,
} from "@utils/i18n-utils";
import { describe, expect, it } from "vitest";
import { featurePagesConfig } from "@/config";

describe("normalizeLocale", () => {
	it("maps English prefixes to en and falls back to zh_CN", () => {
		expect(normalizeLocale("en")).toBe("en");
		expect(normalizeLocale("en-US")).toBe("en");
		expect(normalizeLocale("EN_GB")).toBe("en");
		expect(normalizeLocale("zh_CN")).toBe("zh_CN");
		expect(normalizeLocale("")).toBe("zh_CN");
		expect(normalizeLocale(null)).toBe("zh_CN");
		expect(normalizeLocale(undefined)).toBe("zh_CN");
	});
});

describe("getLocaleFromPath", () => {
	it("detects /en and /en/... while treating /english/ as zh_CN", () => {
		expect(getLocaleFromPath("/")).toBe("zh_CN");
		expect(getLocaleFromPath("/posts/hello-world/")).toBe("zh_CN");
		expect(getLocaleFromPath("/english/")).toBe("zh_CN");
		expect(getLocaleFromPath("/en")).toBe("en");
		expect(getLocaleFromPath("/en/")).toBe("en");
		expect(getLocaleFromPath("/en/about/")).toBe("en");
		expect(getLocaleFromPath("en/posts/hello-world/")).toBe("en");
	});
});

describe("getHtmlLang", () => {
	it("maps internal locales to BCP 47 HTML language tags", () => {
		expect(getHtmlLang("zh_CN")).toBe("zh-CN");
		expect(getHtmlLang("en")).toBe("en");
	});
});

describe("getLocalizedPath", () => {
	it("prefixes English routes cleanly and strips /en for Chinese routes", () => {
		expect(getLocalizedPath("/", "zh_CN")).toBe("/");
		expect(getLocalizedPath("/archive/", "zh_CN")).toBe("/archive/");
		expect(getLocalizedPath("/en/", "zh_CN")).toBe("/");
		expect(getLocalizedPath("/en/about/", "zh_CN")).toBe("/about/");
		expect(getLocalizedPath("/", "en")).toBe("/en/");
		expect(getLocalizedPath("/archive/", "en")).toBe("/en/archive/");
		expect(getLocalizedPath("/en/archive/", "en")).toBe("/en/archive/");
		expect(getLocalizedPath("projects/", "en")).toBe("/en/projects/");
	});
});

describe("post locale and slug helpers", () => {
	it("strips zh/ and en/ folder prefixes from post slugs", () => {
		expect(getPostSlug("zh/hello-world")).toBe("hello-world");
		expect(getPostSlug("en/hello-world")).toBe("hello-world");
		expect(getPostSlug("nested/post")).toBe("nested/post");
	});

	it("infers post locale from slug prefix before frontmatter fallback", () => {
		expect(getPostLocale("en/hello-world", "zh_CN")).toBe("en");
		expect(getPostLocale("zh/hello-world", "en")).toBe("zh_CN");
		expect(getPostLocale("standalone-post", "en")).toBe("en");
		expect(getPostLocale("standalone-post")).toBe("zh_CN");
	});

	it("builds localized post URLs", () => {
		expect(getLocalizedPostUrl("zh/hello-world", "zh_CN")).toBe(
			"/posts/hello-world/",
		);
		expect(getLocalizedPostUrl("en/hello-world", "en")).toBe(
			"/en/posts/hello-world/",
		);
	});
});

describe("category and tag URLs", () => {
	it("handles normal, empty, null, and localized uncategorized values", () => {
		expect(getLocalizedCategoryUrl("Notes", "zh_CN")).toBe(
			"/archive/?category=Notes",
		);
		expect(getLocalizedCategoryUrl("Notes", "en")).toBe(
			"/en/archive/?category=Notes",
		);
		expect(getLocalizedCategoryUrl(null, "zh_CN")).toBe(
			"/archive/?uncategorized=true",
		);
		expect(getLocalizedCategoryUrl("  ", "en")).toBe(
			"/en/archive/?uncategorized=true",
		);
		expect(getLocalizedCategoryUrl("未分类", "zh_CN")).toBe(
			"/archive/?uncategorized=true",
		);
		expect(getLocalizedCategoryUrl("Uncategorized", "en")).toBe(
			"/en/archive/?uncategorized=true",
		);
	});

	it("encodes tags and handles empty tags", () => {
		expect(getLocalizedTagUrl("C++", "zh_CN")).toBe("/archive/?tag=C%2B%2B");
		expect(getLocalizedTagUrl("Astro", "en")).toBe("/en/archive/?tag=Astro");
		expect(getLocalizedTagUrl("", "en")).toBe("/en/archive/");
	});
});

describe("getAlternatePath", () => {
	it("switches locale paths and normalizes numbered home pagination pages", () => {
		expect(getAlternatePath("/", "en")).toBe("/en/");
		expect(getAlternatePath("/en/", "zh_CN")).toBe("/");
		expect(getAlternatePath("/about/", "en")).toBe("/en/about/");
		expect(getAlternatePath("/en/projects/", "zh_CN")).toBe("/projects/");
		expect(getAlternatePath("/2/", "en")).toBe("/en/");
		expect(getAlternatePath("/en/3/", "zh_CN")).toBe("/");
	});
});

describe("pickLocalized", () => {
	it("picks matching locale string or returns fallback", () => {
		const text = { zh_CN: "中文", en: "English" };
		expect(pickLocalized(text, "fallback", "zh_CN")).toBe("中文");
		expect(pickLocalized(text, "fallback", "en")).toBe("English");
		expect(pickLocalized(undefined, "fallback", "en")).toBe("fallback");
	});
});

describe("getLocalizedNavLinks", () => {
	it("follows featurePagesConfig toggles and appends external links per locale", () => {
		const zhLinks = getLocalizedNavLinks("zh_CN");
		const enLinks = getLocalizedNavLinks("en");
		expect(zhLinks.some((l) => l.url === "/")).toBe(true);
		expect(enLinks.some((l) => l.url === "/en/")).toBe(true);
		expect(zhLinks.some((l) => l.url === "/moments/")).toBe(
			featurePagesConfig.moments,
		);
		expect(enLinks.some((l) => l.url === "/en/moments/")).toBe(
			featurePagesConfig.moments,
		);
		expect(zhLinks.some((l) => l.external && l.name === "GitHub")).toBe(true);
		expect(enLinks.some((l) => l.external && l.name === "GitHub")).toBe(true);
	});
});
