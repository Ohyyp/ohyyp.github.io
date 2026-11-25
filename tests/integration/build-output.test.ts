import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { featurePagesConfig } from "@/config";

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content/posts");

function readDist(relativePath: string): string {
	return fs.readFileSync(path.join(distDir, relativePath), "utf8");
}

function existsDist(relativePath: string): boolean {
	return fs.existsSync(path.join(distDir, relativePath));
}

function collectHtmlFiles(dir: string): string[] {
	const results: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...collectHtmlFiles(fullPath));
		} else if (entry.name.endsWith(".html")) {
			results.push(fullPath);
		}
	}
	return results;
}

function listPublishedPostSlugs(localeFolder: "zh" | "en"): string[] {
	const root = path.join(contentDir, localeFolder);
	if (!fs.existsSync(root)) return [];
	const slugs: string[] = [];

	function walk(dir: string) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (/\.(md|mdx)$/i.test(entry.name)) {
				const raw = fs.readFileSync(fullPath, "utf8");
				const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
				if (fmMatch && /^draft:\s*true\s*$/m.test(fmMatch[1])) {
					continue;
				}
				const rel = path
					.relative(root, fullPath)
					.replace(/\\/g, "/")
					.replace(/\.(md|mdx)$/i, "")
					.toLowerCase();
				slugs.push(rel);
			}
		}
	}

	walk(root);
	return slugs.sort();
}

describe("built dist/ integration checks", () => {
	const zhSlugs = listPublishedPostSlugs("zh");
	const enSlugs = listPublishedPostSlugs("en");

	it("requires a completed production build in dist/", () => {
		expect(
			fs.existsSync(distDir),
			"dist/ not found; run pnpm run build first",
		).toBe(true);
	});

	it("generates all expected zh-CN, en, 404, and post HTML routes", () => {
		const expectedRoutes = [
			"index.html",
			"en/index.html",
			"404.html",
			"about/index.html",
			"en/about/index.html",
			"archive/index.html",
			"en/archive/index.html",
			"projects/index.html",
			"en/projects/index.html",
			"timeline/index.html",
			"en/timeline/index.html",
			"moments/index.html",
			"en/moments/index.html",
			...zhSlugs.map((slug) => `posts/${slug}/index.html`),
			...enSlugs.map((slug) => `en/posts/${slug}/index.html`),
		];

		for (const route of expectedRoutes) {
			expect(existsDist(route), `Missing built route ${route}`).toBe(true);
		}
	});

	it("renders bilingual html lang, Swup metadata, SEO tags, and performance attributes", () => {
		const zhHome = readDist("index.html");
		const enHome = readDist("en/index.html");
		const notFound = readDist("404.html");

		expect(zhHome).toContain('<html lang="zh-CN"');
		expect(enHome).toContain('<html lang="en"');

		expect(zhHome).toContain('id="language-switch"');
		expect(zhHome).toContain('data-alternate-url="/en/"');
		expect(zhHome).toContain('data-is-post="false"');
		expect(enHome).toContain('data-alternate-url="/"');
		expect(enHome).toContain('data-is-post="false"');

		const homeProgressClass =
			zhHome.match(/<div id="reading-progress"[^>]*class="([^"]+)"/)?.[1] ?? "";
		expect(homeProgressClass.split(/\s+/)).toContain("hidden");

		const homeImmersive =
			zhHome.match(/<button id="immersive-toggle-btn"[^>]*>/)?.[0] ?? "";
		expect(homeImmersive).not.toContain("lg:flex");

		expect(zhHome).toContain('<meta name="viewport" content="width=device-width, initial-scale=1">');
		expect(zhHome).toContain('<link rel="canonical" href="https://ohyyp.github.io/">');
		expect(zhHome).toContain('<meta property="og:image" content="https://ohyyp.github.io/');
		expect(zhHome).toContain('<link rel="alternate" hreflang="x-default" href="https://ohyyp.github.io/">');
		expect(zhHome).toContain('<link rel="alternate" hreflang="zh-CN" href="https://ohyyp.github.io/">');
		expect(zhHome).toContain('<link rel="alternate" hreflang="en" href="https://ohyyp.github.io/en/">');

		expect(zhHome).toContain('fetchpriority="high"');
		expect(zhHome).toContain('loading="eager"');
		expect(zhHome).toContain("window.__loadPagefind");
		expect(zhHome).not.toContain("document.addEventListener('DOMContentLoaded', loadPagefind)");
		expect(zhHome).toContain("CC BY-SA 4.0");
		expect(zhHome).not.toContain("All Rights Reserved.");

		expect(zhHome).toContain("hidden lg:flex");
		expect(zhHome).toContain("lg:!hidden");
		if (!featurePagesConfig.moments) {
			expect(zhHome).not.toContain('href="/moments/"');
			expect(enHome).not.toContain('href="/en/moments/"');
		}

		expect(notFound).toContain('<meta name="robots" content="noindex">');
		expect(notFound).toContain('href="/"');
		expect(notFound).toContain('href="/en/"');

		for (const slug of zhSlugs) {
			const zhPost = readDist(`posts/${slug}/index.html`);
			const hasEn = enSlugs.includes(slug);
			expect(zhPost).toContain('data-is-post="true"');
			expect(zhPost).toContain(
				`<link rel="canonical" href="https://ohyyp.github.io/posts/${slug}/">`,
			);
			expect(zhPost).toContain(
				`<link rel="alternate" hreflang="zh-CN" href="https://ohyyp.github.io/posts/${slug}/">`,
			);
			if (hasEn) {
				expect(zhPost).toContain(`data-alternate-url="/en/posts/${slug}/"`);
				expect(zhPost).toContain(
					`<link rel="alternate" hreflang="en" href="https://ohyyp.github.io/en/posts/${slug}/">`,
				);
			} else {
				expect(zhPost).toContain('data-alternate-url="/en/"');
				expect(zhPost).not.toContain('<link rel="alternate" hreflang="en"');
			}

			const postProgressClass =
				zhPost.match(/<div id="reading-progress"[^>]*class="([^"]+)"/)?.[1] ?? "";
			expect(postProgressClass.split(/\s+/)).not.toContain("hidden");

			const postImmersive =
				zhPost.match(/<button id="immersive-toggle-btn"[^>]*>/)?.[0] ?? "";
			expect(postImmersive).toContain("lg:flex");
			expect(zhPost).not.toContain('href="#"');
		}
	});

	it("generates valid localized RSS feeds without duplicate locale prefixes", () => {
		const zhRss = readDist("rss.xml");
		const enRss = readDist("en/rss.xml");

		expect(zhRss).toContain("<link>https://ohyyp.github.io/</link>");
		expect(zhRss).toContain("<language>zh-CN</language>");
		for (const slug of zhSlugs) {
			expect(zhRss).toContain(`<link>https://ohyyp.github.io/posts/${slug}/</link>`);
		}

		expect(enRss).toContain("<link>https://ohyyp.github.io/en/</link>");
		expect(enRss).toContain("<language>en</language>");
		expect(enRss).not.toContain("/en/en/");
		for (const slug of enSlugs) {
			expect(enRss).toContain(
				`<link>https://ohyyp.github.io/en/posts/${slug}/</link>`,
			);
		}
	});

	it("generates robots.txt, filtered sitemap, and bilingual Pagefind index", () => {
		expect(existsDist("sitemap-index.xml")).toBe(true);
		const sitemap = readDist("sitemap-0.xml");
		expect(sitemap).toContain("<loc>https://ohyyp.github.io/</loc>");
		expect(sitemap).toContain("<loc>https://ohyyp.github.io/en/</loc>");
		expect(sitemap).not.toContain("/404");
		for (const slug of zhSlugs) {
			expect(sitemap).toContain(
				`<loc>https://ohyyp.github.io/posts/${slug}/</loc>`,
			);
		}
		for (const slug of enSlugs) {
			expect(sitemap).toContain(
				`<loc>https://ohyyp.github.io/en/posts/${slug}/</loc>`,
			);
		}
		if (!featurePagesConfig.moments) {
			expect(sitemap).not.toContain("/moments/</loc>");
		} else {
			expect(sitemap).toContain("<loc>https://ohyyp.github.io/moments/</loc>");
		}

		const robots = readDist("robots.txt");
		expect(robots).toContain(
			"Sitemap: https://ohyyp.github.io/sitemap-index.xml",
		);

		const pagefind = JSON.parse(readDist("pagefind/pagefind-entry.json")) as {
			languages: Record<string, { page_count: number }>;
		};
		if (zhSlugs.length > 0) {
			expect(pagefind.languages["zh-cn"]?.page_count).toBeGreaterThanOrEqual(1);
		}
		if (enSlugs.length > 0) {
			expect(pagefind.languages.en?.page_count).toBeGreaterThanOrEqual(1);
		}
	});

	it("has zero broken internal href links across all built HTML pages", () => {
		const htmlFiles = collectHtmlFiles(distDir);
		expect(htmlFiles.length).toBeGreaterThan(0);

		const brokenLinks: string[] = [];
		const hrefPattern = /href="([^"]+)"/g;

		for (const file of htmlFiles) {
			const html = fs.readFileSync(file, "utf8");
			for (const match of html.matchAll(hrefPattern)) {
				const rawHref = match[1];
				if (rawHref[0] !== "/" || rawHref[1] === "/") {
					continue;
				}
				const cleanPath = decodeURIComponent(rawHref.split(/[?#]/)[0]);
				if (!cleanPath || cleanPath === "/") {
					continue;
				}
				const rel = cleanPath.replace(/^\/+/, "");
				const directTarget = path.join(distDir, rel);
				const indexTarget = path.join(distDir, rel, "index.html");
				if (!fs.existsSync(directTarget) && !fs.existsSync(indexTarget)) {
					brokenLinks.push(`${path.relative(distDir, file)} -> ${rawHref}`);
				}
			}
		}

		expect(brokenLinks).toEqual([]);
	});
});
