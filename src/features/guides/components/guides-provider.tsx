"use client";

import React, { useMemo, useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import type { Guide } from "@/types/guide";

type GuidesDialogType = "delete";

type GuidesContextType = {
	open: GuidesDialogType | null;
	setOpen: (str: GuidesDialogType | null) => void;
	currentRow: Guide | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<Guide | null>>;
};

const GuidesContext = React.createContext<GuidesContextType | null>(null);

export function GuidesProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [open, setOpen] = useDialogState<GuidesDialogType>(null);
	const [currentRow, setCurrentRow] = useState<Guide | null>(null);

	const guidesContextValue = useMemo(
		() => ({
			open,
			setOpen,
			currentRow,
			setCurrentRow,
		}),
		[open, setOpen, currentRow],
	);

	return <GuidesContext value={guidesContextValue}>{children}</GuidesContext>;
}

export const useGuides = () => {
	const guidesContext = React.useContext(GuidesContext);

	if (!guidesContext) {
		throw new Error("useGuides has to be used within <GuidesContext>");
	}

	return guidesContext;
};
