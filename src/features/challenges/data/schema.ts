import { z } from "zod";

const challengeStatusSchema = z.union([
	z.literal("active"),
	z.literal("archived"),
	z.literal("draft"),
]);

export type UserStatus = z.infer<typeof challengeStatusSchema>;
