import { formatDateToYYYYMMDD } from "@utils/date-utils";
import {
	getCategoryUrl,
	getDir,
	getPostUrlBySlug,
	getTagUrl,
	pathsEqual,
	url,
} from "@utils/url-utils";
import { describe, expect, it } from "vitest";

describe("pathsEqual", () => {
	it("compares paths ignoring leading/trailing slashes and case", () => {
		expect(pathsEqual("/", "/")).toBe(true);
		expect(pathsEqual("/en/", "/en")).toBe(true);
		expect(pathsEqual("Posts/Hello-World/", "/posts/hello-world")).toBe(true);
		expect(pathsEqual("/about/", "/archive/")).toBe(false);
	});
});

describe("getDir", () => {
	it("extracts parent directory path with trailing slash", () => {
		expect(getDir("zh/hello-world.md")).toBe("zh/");
		expect(getDir("a/b/c.md")).toBe("a/b/");
		expect(getDir("root.md")).toBe("/");
	});
});

describe("url builders", () => {
	it("builds normalized site-relative URLs", () => {
		expect(url("/")).toBe("/");
		expect(url("/posts/hello-world/")).toBe("/posts/hello-world/");
		expect(getPostUrlBySlug("hello-world")).toBe("/posts/hello-world/");
		expect(getTagUrl("Astro")).toBe("/archive/?tag=Astro");
		expect(getTagUrl("")).toBe("/archive/");
		expect(getCategoryUrl("Tech")).toBe("/archive/?category=Tech");
		expect(getCategoryUrl(null)).toBe("/archive/?uncategorized=true");
	});
});

describe("formatDateToYYYYMMDD", () => {
	it("formats UTC Date instances cleanly", () => {
		expect(formatDateToYYYYMMDD(new Date("2026-11-24T00:00:00Z"))).toBe(
			"2026-11-24",
		);
	});
});
