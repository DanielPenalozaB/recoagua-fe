"use client";

import React, { useMemo, useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import type { Challenge } from "@/types/challenge";

type ChallengesDialogType = "delete";

type ChallengesContextType = {
	open: ChallengesDialogType | null;
	setOpen: (str: ChallengesDialogType | null) => void;
	currentRow: Challenge | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<Challenge | null>>;
};

const ChallengesContext = React.createContext<ChallengesContextType | null>(
	null,
);

export function ChallengesProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [open, setOpen] = useDialogState<ChallengesDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Challenge | null>(null);

	const challengesContextValue = useMemo(
		() => ({
			open,
			setOpen,
			currentRow,
			setCurrentRow,
		}),
		[open, setOpen, currentRow],
	);

	return (
		<ChallengesContext value={challengesContextValue}>
			{children}
		</ChallengesContext>
	);
}

export const useChallenges = () => {
	const challengesContext = React.useContext(ChallengesContext);

	if (!challengesContext) {
		throw new Error("useChallenges has to be used within <ChallengesContext>");
	}

	return challengesContext;
};
