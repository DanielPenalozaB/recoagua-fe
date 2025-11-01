"use client";

import type React from "react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface MapboxContextType {
	isLoaded: boolean;
	accessToken: string | null;
	error: string | null;
}

const MapboxContext = createContext<MapboxContextType | undefined>(undefined);

export const MapboxProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Initialize Mapbox on component mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

			if (mapboxToken) {
				setAccessToken(mapboxToken);
				setIsLoaded(true);
				setError(null);
			} else {
				const errorMessage =
					"Mapbox access token is not set in environment variables";
				console.warn(errorMessage);
				setError(errorMessage);
				setIsLoaded(false);
			}
		}
	}, []);

	const contextValue = useMemo(
		() => ({
			isLoaded,
			accessToken,
			error,
		}),
		[isLoaded, accessToken, error],
	);

	return (
		<MapboxContext.Provider value={contextValue}>
			{children}
		</MapboxContext.Provider>
	);
};

export const useMapbox = () => {
	const context = useContext(MapboxContext);
	if (context === undefined) {
		throw new Error("useMapbox must be used within a MapboxProvider");
	}
	return context;
};
