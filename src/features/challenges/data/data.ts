import {
	ChallengeDifficulty,
	ChallengeStatus,
	ChallengeType,
} from "@/types/challenge";

export const callTypes = new Map<ChallengeStatus, string>([
	[
		ChallengeStatus.ACTIVE,
		"bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
	],
	[ChallengeStatus.ARCHIVED, "bg-neutral-300/40 border-neutral-300"],
	[
		ChallengeStatus.DRAFT,
		"bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
	],
]);

export const difficultyTypes = new Map<ChallengeDifficulty, string>([
	[
		ChallengeDifficulty.EASY,
		"bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
	],
	[
		ChallengeDifficulty.MEDIUM,
		"bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
	],
	[
		ChallengeDifficulty.HARD,
		"bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200",
	],
]);

export const typeTypes = new Map<ChallengeType, string>([
	[
		ChallengeType.EDUCATIONAL,
		"bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
	],
	[
		ChallengeType.PRACTICAL,
		"bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
	],
	[
		ChallengeType.COMMUNITY,
		"bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200",
	],
]);

export const statusTypeTranslation = new Map<ChallengeStatus, string>([
	[ChallengeStatus.ACTIVE, "Activo"],
	[ChallengeStatus.ARCHIVED, "Archivado"],
	[ChallengeStatus.DRAFT, "Borrador"],
]);

export const difficultyTypeTranslation = new Map<ChallengeDifficulty, string>([
	[ChallengeDifficulty.EASY, "Fácil"],
	[ChallengeDifficulty.MEDIUM, "Medio"],
	[ChallengeDifficulty.HARD, "Difícil"],
]);

export const typeTypeTranslation = new Map<ChallengeType, string>([
	[ChallengeType.EDUCATIONAL, "Educacional"],
	[ChallengeType.PRACTICAL, "Práctica"],
	[ChallengeType.COMMUNITY, "Comunidad"],
]);
