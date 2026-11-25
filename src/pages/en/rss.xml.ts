import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import {
	getHtmlLang,
	getLocalizedPostUrl,
	pickLocalized,
} from "@utils/i18n-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function isValidXmlChar(code: number): boolean {
	return (
		code === 0x09 ||
		code === 0x0a ||
		code === 0x0d ||
		(code >= 0x20 && code <= 0xd7ff) ||
		(code >= 0xe000 && code <= 0xfffd) ||
		(code >= 0x10000 && code <= 0x10ffff)
	);
}

function stripInvalidXmlChars(str: string): string {
	let result = "";
	for (const ch of str) {
		const code = ch.codePointAt(0);
		if (code !== undefined && isValidXmlChar(code)) {
			result += ch;
		}
	}
	return result;
}

export async function GET(context: APIContext) {
	const locale = "en";
	const blog = await getSortedPosts(locale);

	return rss({
		title: siteConfig.title,
		description: pickLocalized(
			siteConfig.subtitleI18n,
			siteConfig.subtitle || "No description",
			locale,
		),
		site: new URL("/en/", context.site ?? "https://ohyyp.github.io").toString(),
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: getLocalizedPostUrl(post.slug, locale),
				content: sanitizeHtml(parser.render(cleanedContent), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${getHtmlLang(locale)}</language>`,
	});
}
