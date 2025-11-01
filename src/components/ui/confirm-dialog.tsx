"use client";

import { cn } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly title: React.ReactNode;
	readonly disabled?: boolean;
	readonly desc: React.JSX.Element | string;
	readonly cancelBtnText?: string;
	readonly confirmText?: React.ReactNode;
	readonly destructive?: boolean;
	readonly handleConfirm: () => void;
	readonly isLoading?: boolean;
	readonly className?: string;
	readonly children?: React.ReactNode;
};

export function ConfirmDialog(props: ConfirmDialogProps) {
	const {
		title,
		desc,
		children,
		className,
		confirmText,
		cancelBtnText,
		destructive,
		isLoading,
		disabled = false,
		handleConfirm,
		...actions
	} = props;
	return (
		<AlertDialog {...actions}>
			<AlertDialogContent className={cn(className)}>
				<AlertDialogHeader className="text-start">
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div>{desc}</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				{children}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{cancelBtnText ?? "Cancel"}
					</AlertDialogCancel>
					<Button
						variant={destructive ? "destructive" : "default"}
						onClick={handleConfirm}
						disabled={disabled || isLoading}
					>
						{confirmText ?? "Continue"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
