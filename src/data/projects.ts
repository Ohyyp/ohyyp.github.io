import type { LocalizedString } from "@/types/config";

export interface ProjectItem {
	id: string;
	title: LocalizedString;
	summary: LocalizedString;
	status: LocalizedString;
	techStack: string[];
	repoUrl?: string;
	liveUrl?: string;
	featured?: boolean;
}

export const projects: ProjectItem[] = [
	{
		id: "ohyyp-site",
		title: {
			zh_CN: "ohyyp.github.io 个人主页",
			en: "ohyyp.github.io Personal Site",
		},
		summary: {
			zh_CN: "我的个人主页与博客，用于记录思考、分享项目与日常兴趣。",
			en: "My personal homepage and blog for sharing notes, projects, and interests.",
		},
		status: {
			zh_CN: "持续迭代",
			en: "Active",
		},
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		repoUrl: "https://github.com/Ohyyp/ohyyp.github.io",
		liveUrl: "https://ohyyp.github.io",
		featured: true,
	},
];
