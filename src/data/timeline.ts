import type { LocalizedString } from "@/types/config";

export interface TimelineItem {
	date: string;
	title: LocalizedString;
	description: LocalizedString;
	category: LocalizedString;
	highlight?: boolean;
}

export const timelineItems: TimelineItem[] = [
	{
		date: "2026-11-24",
		title: {
			zh_CN: "个人网站正式上线",
			en: "Personal Website Launched",
		},
		description: {
			zh_CN: "网站上线第一天，正式开启这里的内容记录。",
			en: "Day one of the site, marking the start of this personal space.",
		},
		category: {
			zh_CN: "里程碑",
			en: "Milestone",
		},
		highlight: true,
	},
];
