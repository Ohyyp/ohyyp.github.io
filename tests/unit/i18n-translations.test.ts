import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { describe, expect, it } from "vitest";

describe("i18n translations completeness", () => {
	it("provides non-empty zh_CN and en strings for every I18nKey", () => {
		const keys = Object.values(I18nKey);
		expect(keys.length).toBeGreaterThan(0);

		for (const key of keys) {
			const zh = i18n(key, "zh_CN");
			const en = i18n(key, "en");
			expect(typeof zh).toBe("string");
			expect(typeof en).toBe("string");
			expect(zh.trim().length, `Missing zh_CN translation for ${key}`).toBeGreaterThan(0);
			expect(en.trim().length, `Missing en translation for ${key}`).toBeGreaterThan(0);
		}
	});

	it("returns distinct localized labels for navigation keys", () => {
		expect(i18n(I18nKey.home, "zh_CN")).toBe("主页");
		expect(i18n(I18nKey.home, "en")).toBe("Home");
		expect(i18n(I18nKey.about, "zh_CN")).toBe("关于");
		expect(i18n(I18nKey.about, "en")).toBe("About");
	});
});
