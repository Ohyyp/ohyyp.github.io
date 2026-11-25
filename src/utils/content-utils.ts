import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	getLocalizedCategoryUrl,
	getPostLocale,
	getPostSlug,
} from "@utils/i18n-utils";
import type { Locale } from "@/types/config";

export interface PostComparable {
	slug: string;
	data: {
		published: Date;
	};
}

export function comparePostsByDateDesc<T extends PostComparable>(
	a: T,
	b: T,
): number {
	const diff =
		new Date(b.data.published).getTime() - new Date(a.data.published).getTime();
	if (diff !== 0) return diff;
	return getPostSlug(a.slug).localeCompare(getPostSlug(b.slug));
}

const rawPostsCache = new Map<string, Promise<CollectionEntry<"posts">[]>>();

async function loadSortedPosts(
	locale?: Locale,
): Promise<CollectionEntry<"posts">[]> {
	const allBlogPosts = await getCollection("posts", ({ slug, data }) => {
		const isPublished = import.meta.env.PROD ? data.draft !== true : true;
		if (!isPublished) return false;
		if (!locale) return true;
		return getPostLocale(slug, data.lang) === locale;
	});

	return [...allBlogPosts].sort(comparePostsByDateDesc);
}

async function getRawSortedPosts(
	locale?: Locale,
): Promise<CollectionEntry<"posts">[]> {
	if (!import.meta.env.PROD) {
		return loadSortedPosts(locale);
	}
	const key = locale ?? "__all__";
	let pending = rawPostsCache.get(key);
	if (!pending) {
		pending = loadSortedPosts(locale);
		rawPostsCache.set(key, pending);
	}
	return pending;
}

export async function getSortedPosts(
	locale?: Locale,
): Promise<CollectionEntry<"posts">[]> {
	const raw = await getRawSortedPosts(locale);
	const sorted = raw.map((post) => ({
		...post,
		data: { ...post.data },
	}));

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = getPostSlug(sorted[i - 1].slug);
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = getPostSlug(sorted[i + 1].slug);
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};

export async function getSortedPostsList(
	locale?: Locale,
): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(locale);

	return sortedFullPosts.map((post) => ({
		slug: getPostSlug(post.slug),
		data: post.data,
	}));
}

export type Tag = {
	name: string;
	count: number;
};

export function buildTagList(
	posts: ReadonlyArray<{ data: { tags?: string[] } }>,
): Tag[] {
	const countMap: Record<string, number> = {};
	for (const post of posts) {
		const seen = new Set<string>();
		for (const rawTag of post.data.tags ?? []) {
			const trimmed = rawTag.trim();
			if (!trimmed || seen.has(trimmed)) continue;
			seen.add(trimmed);
			countMap[trimmed] = (countMap[trimmed] ?? 0) + 1;
		}
	}

	const keys = Object.keys(countMap).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export async function getTagList(locale?: Locale): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts(locale);
	return buildTagList(allBlogPosts);
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export function buildCategoryList(
	posts: ReadonlyArray<{ data: { category?: string | null } }>,
	locale: Locale = "zh_CN",
): Category[] {
	const count: Record<string, number> = {};
	const ucKey = i18n(I18nKey.uncategorized, locale);

	for (const post of posts) {
		const raw =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: post.data.category
					? String(post.data.category).trim()
					: "";
		const categoryName = raw || ucKey;
		count[categoryName] = (count[categoryName] ?? 0) + 1;
	}

	const keys = Object.keys(count).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);

	return keys.map((c) => ({
		name: c,
		count: count[c],
		url: getLocalizedCategoryUrl(c, locale),
	}));
}

export async function getCategoryList(locale?: Locale): Promise<Category[]> {
	const resolvedLocale: Locale = locale || "zh_CN";
	const allBlogPosts = await getRawSortedPosts(locale);
	return buildCategoryList(allBlogPosts, resolvedLocale);
}
