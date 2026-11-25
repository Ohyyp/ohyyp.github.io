import type {
	CommentsConfig,
	ExpressiveCodeConfig,
	FeaturePagesConfig,
	LicenseConfig,
	NavBarConfig,
	PostFeatureConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Ohyyp",
	subtitle: "记录技术、代码与思考",
	subtitleI18n: {
		zh_CN: "记录技术、代码与思考",
		en: "Notes, Code & Thoughts",
	},
	lang: "zh_CN",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/demo-banner.png",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const featurePagesConfig: FeaturePagesConfig = {
	archive: true,
	projects: true,
	timeline: true,
	moments: false,
	about: true,
	portfolio: false,
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Ohyyp",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png",
	name: "Ohyyp",
	bio: "记录技术、思考与折腾。",
	bioI18n: {
		zh_CN: "记录技术、思考与折腾。",
		en: "Notes, code, and experiments.",
	},
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Ohyyp",
		},
	],
};

export const commentsConfig: CommentsConfig = {
	enable: false,
	provider: "giscus",
	giscus: {
		repo: "Ohyyp/ohyyp.github.io",
		repoId: "",
		category: "Announcements",
		categoryId: "",
		mapping: "pathname",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
	},
};

export const postFeatureConfig: PostFeatureConfig = {
	showLastModified: true,
	outdatedThresholdDays: 180,
	readingProgress: true,
	immersiveReading: true,
	mobileToc: true,
	listLayoutSwitch: true,
	categoryBar: true,
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-SA 4.0",
	url: "https://creativecommons.org/licenses/by-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
