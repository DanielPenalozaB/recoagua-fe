"use client";

import React, { useMemo, useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import type { City } from "@/types/city";

type CitiesDialogType = "delete";

type CitiesContextType = {
	open: CitiesDialogType | null;
	setOpen: (str: CitiesDialogType | null) => void;
	currentRow: City | null;
	setCurrentRow: React.Dispatch<React.SetStateAction<City | null>>;
};

const CitiesContext = React.createContext<CitiesContextType | null>(null);

export function CitiesProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const [open, setOpen] = useDialogState<CitiesDialogType>(null);
	const [currentRow, setCurrentRow] = useState<City | null>(null);

	const citiesContextValue = useMemo(
		() => ({
			open,
			setOpen,
			currentRow,
			setCurrentRow,
		}),
		[open, setOpen, currentRow],
	);

	return <CitiesContext value={citiesContextValue}>{children}</CitiesContext>;
}

export const useCities = () => {
	const citiesContext = React.useContext(CitiesContext);

	if (!citiesContext) {
		throw new Error("useCities has to be used within <CitiesContext>");
	}

	return citiesContext;
};
