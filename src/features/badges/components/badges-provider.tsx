"use client";

import React, { useMemo, useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import type { Badge } from "@/types/badge";

type BadgesDialogType = "delete";

type BadgesContextType = {
	open: BadgesDialogType | null;
	setOpen: (str: BadgesDialogType | null) => void;
	currentRow: Badge | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<Badge | null>>;
};

const BadgesContext = React.createContext<BadgesContextType | null>(null);

export function BadgesProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [open, setOpen] = useDialogState<BadgesDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Badge | null>(null);

	const badgesContextValue = useMemo(
		() => ({
			open,
			setOpen,
			currentRow,
			setCurrentRow,
		}),
		[open, setOpen, currentRow],
	);

	return <BadgesContext value={badgesContextValue}>{children}</BadgesContext>;
}

export const useBadges = () => {
	const badgesContext = React.useContext(BadgesContext);

	if (!badgesContext) {
		throw new Error("useBadges has to be used within <BadgesContext>");
	}

	return badgesContext;
};
