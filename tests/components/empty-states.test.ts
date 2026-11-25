import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import EmptyState from "@components/custom/EmptyState.astro";
import MomentsView from "@components/custom/MomentsView.astro";
import ProjectsView from "@components/custom/ProjectsView.astro";
import TimelineView from "@components/custom/TimelineView.astro";
import { featurePagesConfig } from "@/config";

describe("EmptyState and view empty-state rendering", () => {
	it("renders EmptyState message and optional action link", async () => {
		const container = await AstroContainer.create();
		const html = await container.renderToString(EmptyState, {
			props: {
				message: "Nothing here",
				actionLabel: "Go Home",
				actionHref: "/",
			},
		});
		expect(html).toContain("Nothing here");
		expect(html).toContain("Go Home");
		expect(html).toContain('href="/"');
	});

	it("renders ProjectsView empty state when items is empty", async () => {
		const container = await AstroContainer.create();
		const zhHtml = await container.renderToString(ProjectsView, {
			props: { lang: "zh_CN", items: [] },
		});
		const enHtml = await container.renderToString(ProjectsView, {
			props: { lang: "en", items: [] },
		});
		if (featurePagesConfig.projects) {
			expect(zhHtml).toContain("暂无项目");
			expect(enHtml).toContain("No projects yet");
		} else {
			expect(zhHtml).toContain("该页面暂未开启");
			expect(enHtml).toContain("This page is currently disabled");
		}
	});

	it("renders TimelineView empty state and sorts items newest first", async () => {
		const container = await AstroContainer.create();
		const emptyZh = await container.renderToString(TimelineView, {
			props: { lang: "zh_CN", items: [] },
		});
		const emptyEn = await container.renderToString(TimelineView, {
			props: { lang: "en", items: [] },
		});
		if (featurePagesConfig.timeline) {
			expect(emptyZh).toContain("暂无动态");
			expect(emptyEn).toContain("Nothing here yet");

			const sortedHtml = await container.renderToString(TimelineView, {
				props: {
					lang: "en",
					items: [
						{
							date: "2024-01-01",
							title: { zh_CN: "旧事件", en: "Older Event" },
							description: { zh_CN: "d1", en: "d1" },
							category: { zh_CN: "c", en: "c" },
						},
						{
							date: "2026-11-24",
							title: { zh_CN: "新事件", en: "Newer Event" },
							description: { zh_CN: "d2", en: "d2" },
							category: { zh_CN: "c", en: "c" },
						},
					],
				},
			});
			expect(sortedHtml.indexOf("Newer Event")).toBeLessThan(
				sortedHtml.indexOf("Older Event"),
			);
		} else {
			expect(emptyZh).toContain("该页面暂未开启");
			expect(emptyEn).toContain("This page is currently disabled");
		}
	});

	it("renders MomentsView safely when items is empty", async () => {
		const container = await AstroContainer.create();
		const html = await container.renderToString(MomentsView, {
			props: { lang: "en", items: [] },
		});
		if (featurePagesConfig.moments) {
			expect(html).toContain("No moments yet.");
		} else {
			expect(html).toContain("This page is currently disabled");
		}
	});
});
