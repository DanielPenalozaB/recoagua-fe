import { z } from "zod";

const userStatusSchema = z.union([
	z.literal("active"),
	z.literal("inactive"),
	z.literal("invited"),
	z.literal("suspended"),
]);
export type UserStatus = z.infer<typeof userStatusSchema>;
