import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils";
import { featurePagesConfig, navBarConfig } from "@/config";
import type { Locale, LocalizedString, NavBarLink } from "@/types/config";

export const DEFAULT_LOCALE: Locale = "zh_CN";
export const SUPPORTED_LOCALES: Locale[] = ["zh_CN", "en"];

export function normalizeLocale(lang?: string | null): Locale {
	if (lang && lang.toLowerCase().startsWith("en")) {
		return "en";
	}
	return "zh_CN";
}

export function getLocaleFromPath(pathname: string): Locale {
	const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
	let stripped = pathname;
	if (base && stripped.startsWith(base)) {
		stripped = stripped.slice(base.length);
	}
	if (!stripped.startsWith("/")) {
		stripped = `/${stripped}`;
	}
	return stripped === "/en" || stripped.startsWith("/en/") ? "en" : "zh_CN";
}

export function getHtmlLang(locale: Locale): string {
	return locale === "en" ? "en" : "zh-CN";
}

export function getLocalizedPath(path: string, locale: Locale): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	if (locale === "en") {
		if (normalized === "/" || normalized === "") {
			return url("/en/");
		}
		if (normalized === "/en" || normalized.startsWith("/en/")) {
			return url(normalized);
		}
		return url(`/en${normalized}`);
	}
	if (normalized === "/en" || normalized === "/en/") {
		return url("/");
	}
	if (normalized.startsWith("/en/")) {
		return url(normalized.slice(3));
	}
	return url(normalized);
}

export function getPostSlug(rawSlug: string): string {
	return rawSlug.replace(/^(zh|en)\//, "");
}

export function getPostLocale(rawSlug: string, frontmatterLang?: string): Locale {
	if (rawSlug.startsWith("en/")) return "en";
	if (rawSlug.startsWith("zh/")) return "zh_CN";
	return normalizeLocale(frontmatterLang);
}

export function getLocalizedPostUrl(
	rawOrCleanSlug: string,
	locale: Locale,
): string {
	const clean = getPostSlug(rawOrCleanSlug);
	return getLocalizedPath(`/posts/${clean}/`, locale);
}

export function getLocalizedCategoryUrl(
	category: string | null,
	locale: Locale,
): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() ===
			i18n(I18nKey.uncategorized, locale).toLowerCase()
	) {
		return getLocalizedPath("/archive/?uncategorized=true", locale);
	}
	return getLocalizedPath(
		`/archive/?category=${encodeURIComponent(category.trim())}`,
		locale,
	);
}

export function getLocalizedTagUrl(tag: string, locale: Locale): string {
	if (!tag) return getLocalizedPath("/archive/", locale);
	return getLocalizedPath(
		`/archive/?tag=${encodeURIComponent(tag.trim())}`,
		locale,
	);
}

export function getAlternatePath(
	pathname: string,
	targetLocale: Locale,
): string {
	const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
	let stripped = pathname;
	if (base && stripped.startsWith(base)) {
		stripped = stripped.slice(base.length);
	}
	if (!stripped.startsWith("/")) {
		stripped = `/${stripped}`;
	}
	if (stripped === "/en" || stripped === "/en/") {
		stripped = "/";
	} else if (stripped.startsWith("/en/")) {
		stripped = stripped.slice(3);
	}
	if (/^\/\d+\/?$/.test(stripped)) {
		stripped = "/";
	}
	return getLocalizedPath(stripped, targetLocale);
}

export function pickLocalized(
	localized: LocalizedString | undefined,
	fallback: string,
	locale: Locale,
): string {
	if (!localized) return fallback;
	return localized[locale] || fallback;
}

export function getLocalizedNavLinks(locale: Locale): NavBarLink[] {
	const links: NavBarLink[] = [
		{ name: i18n(I18nKey.home, locale), url: getLocalizedPath("/", locale) },
	];
	if (featurePagesConfig.archive) {
		links.push({
			name: i18n(I18nKey.archive, locale),
			url: getLocalizedPath("/archive/", locale),
		});
	}
	if (featurePagesConfig.projects) {
		links.push({
			name: i18n(I18nKey.projects, locale),
			url: getLocalizedPath("/projects/", locale),
		});
	}
	if (featurePagesConfig.timeline) {
		links.push({
			name: i18n(I18nKey.timeline, locale),
			url: getLocalizedPath("/timeline/", locale),
		});
	}
	if (featurePagesConfig.moments) {
		links.push({
			name: i18n(I18nKey.moments, locale),
			url: getLocalizedPath("/moments/", locale),
		});
	}
	if (featurePagesConfig.about) {
		links.push({
			name: i18n(I18nKey.about, locale),
			url: getLocalizedPath("/about/", locale),
		});
	}
	for (const item of navBarConfig.links) {
		if (typeof item !== "number") {
			links.push(item);
		}
	}
	return links;
}
