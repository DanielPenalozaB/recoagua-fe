/** biome-ignore-all lint/a11y/noStaticElementInteractions: a11y */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: a11y */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: a11y */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Answer, QuestionType } from "@/types/block";

interface OptionsSelectProps {
	readonly options: Answer[];
	readonly questionType: QuestionType;
	readonly onSubmit: (selectedOptions: number[]) => Promise<void>;
}

export default function OptionsSelect({
	options,
	questionType,
	onSubmit,
}: OptionsSelectProps) {
	const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const isMultipleSelect = questionType === QuestionType.MULTIPLE_CHOICE;

	const handleOptionSelect = (optionId: number) => {
		if (submitted) return; // Prevent changes after submission

		if (isMultipleSelect) {
			setSelectedOptions((prev) =>
				prev.includes(optionId)
					? prev.filter((id) => id !== optionId)
					: [...prev, optionId],
			);
		} else {
			setSelectedOptions([optionId]);
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await onSubmit(selectedOptions);
			setSubmitted(true);
		} catch (error) {
			console.error("Error submitting answer:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getOptionState = (option: Answer) => {
		if (!submitted) return "default";

		if (selectedOptions.includes(option.id)) {
			return option.isCorrect ? "correct" : "incorrect";
		}

		return option.isCorrect ? "missed" : "default";
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="gap-3 grid">
				{options.map((option) => {
					const state = getOptionState(option);
					const isSelected = selectedOptions.includes(option.id);

					return (
						<div
							key={option.id}
							className={`
                p-4 rounded-xl border-2 transition-all cursor-pointer
                ${state === "default" && "border-gray-200 hover:border-gray-300"}
                ${state === "correct" && "border-green-500 bg-green-50"}
                ${state === "incorrect" && "border-red-500 bg-red-50"}
                ${state === "missed" && "border-green-500 bg-green-50"}
                ${isSelected && state === "default" && "border-blue-500 bg-blue-50"}
              `}
							onClick={() => handleOptionSelect(option.id)}
						>
							<div className="flex items-center gap-3">
								{isMultipleSelect ? (
									<div
										className={`
                    flex items-center justify-center w-6 h-6 rounded-md border-2
                    ${state === "default" && "border-gray-300"}
                    ${state === "correct" && "border-green-500 bg-green-500 text-white"}
                    ${state === "incorrect" && "border-red-500 bg-red-500 text-white"}
                    ${isSelected && state === "default" && "border-blue-500 bg-blue-500 text-white"}
                  `}
									>
										{isSelected && (
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</div>
								) : (
									<div
										className={`
                    flex items-center justify-center w-6 h-6 rounded-full border-2
                    ${state === "default" && "border-gray-300"}
                    ${state === "correct" && "border-green-500 bg-green-500 text-white"}
                    ${state === "incorrect" && "border-red-500 bg-red-500 text-white"}
                    ${isSelected && state === "default" && "border-blue-500"}
                  `}
									>
										{isSelected && state === "default" && (
											<div className="bg-blue-500 rounded-full w-3 h-3" />
										)}
									</div>
								)}
								<span className="text-gray-800">{option.text}</span>
							</div>
							{submitted && option.feedback && (
								<div
									className={`
                  mt-2 p-2 rounded-md text-sm
                  ${state === "correct" && "text-green-700"}
                  ${state === "incorrect" && "text-red-700"}
                `}
								>
									{option.feedback}
								</div>
							)}
						</div>
					);
				})}
			</div>
			<Button
				onClick={handleSubmit}
				disabled={selectedOptions.length === 0 || isSubmitting || submitted}
				className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-xl font-medium text-white text-lg disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Verificando..." : "Verificar"}
			</Button>
		</div>
	);
}
