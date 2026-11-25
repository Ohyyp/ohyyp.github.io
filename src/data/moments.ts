import type { LocalizedString } from "@/types/config";

export interface MomentItem {
	id: string;
	date: string;
	content: LocalizedString;
	tags: string[];
}

export const moments: MomentItem[] = [];
