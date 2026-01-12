"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Level } from "@/types/level";
import { Sparkles } from "lucide-react";

interface LevelUpModalProps {
  level: Level | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelUpModal({
  level,
  open,
  onOpenChange,
}: Readonly<LevelUpModalProps>) {
  if (!level) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center !bg-white">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Sparkles className="w-12 h-12 text-yellow-600 animate-pulse" />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-teal-600">
            ¡Subiste de Nivel!
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            Ahora eres un{" "}
            <span className="font-bold text-teal-600">{level.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* If level has an image, it could go here */}
          <p className="text-neutral-600">{level.description}</p>
          {level.rewards && (
            <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-sm font-semibold text-neutral-500">
                Recompensas desbloqueadas:
              </p>
              <p className="text-teal-600 font-medium">{level.rewards}</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto !text-white"
          >
            ¡Genial!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
