import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	getLocalizedCategoryUrl,
	getPostLocale,
	getPostSlug,
} from "@utils/i18n-utils";
import type { Locale } from "@/types/config";

async function getRawSortedPosts(locale?: Locale) {
	const allBlogPosts = await getCollection("posts", ({ slug, data }) => {
		const isPublished = import.meta.env.PROD ? data.draft !== true : true;
		if (!isPublished) return false;
		if (!locale) return true;
		return getPostLocale(slug, data.lang) === locale;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts(locale?: Locale) {
	const sorted = await getRawSortedPosts(locale);

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

	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: getPostSlug(post.slug),
		data: post.data,
	}));

	return sortedPostsList;
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(locale?: Locale): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts(locale);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(locale?: Locale): Promise<Category[]> {
	const resolvedLocale: Locale = locale || "zh_CN";
	const allBlogPosts = await getRawSortedPosts(locale);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized, resolvedLocale);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getLocalizedCategoryUrl(c, resolvedLocale),
		});
	}
	return ret;
}
