import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type Locale = "zh_CN" | "en";

export type LocalizedString = {
	zh_CN: string;
	en: string;
};

export type SiteConfig = {
	title: string;
	subtitle: string;
	subtitleI18n?: LocalizedString;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type FeaturePagesConfig = {
	archive: boolean;
	projects: boolean;
	timeline: boolean;
	moments: boolean;
	about: boolean;
	portfolio: boolean;
};

export type CommentsConfig = {
	enable: boolean;
	provider: "giscus";
	giscus: {
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping: string;
		reactionsEnabled: "0" | "1";
		emitMetadata: "0" | "1";
		inputPosition: "top" | "bottom";
	};
};

export type PostFeatureConfig = {
	showLastModified: boolean;
	outdatedThresholdDays: number;
	readingProgress: boolean;
	immersiveReading: boolean;
	mobileToc: boolean;
	listLayoutSwitch: boolean;
	categoryBar: boolean;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	bioI18n?: LocalizedString;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};
