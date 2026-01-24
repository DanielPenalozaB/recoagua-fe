"use client";

import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useState } from "react";
import OptionsSelect from "@/components/citizen/modules/options-select";
import RelationalPairsBlock from "@/components/citizen/modules/relational-pairs-block";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea"; // Added Import
import { useModule } from "@/hooks/use-modules";
import { type Block, QuestionType } from "@/types/block"; // Added QuestionType
import type { Module } from "@/types/module";
import type { Level } from "@/types/level";
import { toast } from "sonner";
import {
  userBlockResponseService,
  type BlockSubmissionResult,
} from "@/services/user-block-response.service";
import { useRouter } from "next/navigation";
import { LevelUpModal } from "@/components/citizen/gamification/level-up-modal";

// Block rendering components
const TextBlock = ({ block }: { block: Block }) => {
  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{block.description}</p>
      </div>
    </div>
  );
};

const VideoBlock = ({ block }: { block: Block }) => {
  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // For direct video URLs, return as is
    return url;
  };

  return (
    <div className="space-y-4">
      {block.description && (
        <p className="text-gray-700">{block.description}</p>
      )}
      <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-neutral-200">
        {block.resourceUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
          <video
            src={block.resourceUrl}
            controls
            className="w-full h-full object-contain bg-black"
          >
            <track
              kind="captions"
              src={block.resourceUrl || "data:text/vtt;charset=utf-8,WEBVTT"}
              srcLang="es"
              label="Español"
              default
            />
            Tu navegador no soporta el elemento de video.
          </video>
        ) : (
          <iframe
            src={getEmbedUrl(block.resourceUrl || "")}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={block.statement}
          />
        )}
      </div>
    </div>
  );
};

const ImageBlock = ({ block }: { block: Block }) => (
  <div className="space-y-4">
    {block.description && <p className="text-gray-700">{block.description}</p>}
    <div className="overflow-hidden rounded-lg border-2 border-neutral-200">
      <img
        src={block.resourceUrl || ""}
        alt={block.statement}
        className="w-full h-auto object-contain max-h-[600px] mx-auto"
      />
    </div>
  </div>
);

const QuestionBlock = ({
  block,
  answerState,
  onStateChange,
  isSubmitted,
}: {
  block: Block;
  answerState: {
    selectedOptions: number[];
    customAnswer: string;
    relationalPairs: number[];
  };
  onStateChange: (key: string, value: any) => void;
  isSubmitted: boolean;
}) => {
  if (block.questionType === QuestionType.OPEN_ENDED) {
    return (
      <div className="space-y-4">
        {block.description && (
          <p className="text-gray-600 mb-4">{block.description}</p>
        )}
        <div className="space-y-4">
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={answerState.customAnswer}
            onChange={(e) => onStateChange("customAnswer", e.target.value)}
            disabled={isSubmitted}
            className="min-h-[120px] border border-neutral-200 rounded-lg !text-neutral-600"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {block.description && (
        <p className="text-gray-600 mb-4">{block.description}</p>
      )}
      <OptionsSelect
        options={block.answers}
        questionType={block.questionType}
        selectedOptions={answerState.selectedOptions}
        onOptionSelect={(selected) =>
          onStateChange("selectedOptions", selected)
        }
        submitted={isSubmitted}
      />
    </div>
  );
};

const InteractiveBlock = ({ block }: { block: Block }) => (
  <div className="space-y-4">
    {block.description && <p className="text-gray-700">{block.description}</p>}
    <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <p className="text-center text-blue-800 font-medium">
        🎮 Actividad interactiva: {block.dynamicType}
      </p>
      <p className="text-center text-sm text-blue-600 mt-2">
        Este tipo de bloque requiere implementación específica según el tipo
        dinámico.
      </p>
    </div>
  </div>
);

const QuizBlock = ({
  block,
  answerState,
  onStateChange,
  isSubmitted,
}: {
  block: Block;
  answerState: {
    selectedOptions: number[];
  };
  onStateChange: (key: string, value: any) => void;
  isSubmitted: boolean;
}) => (
  <div className="space-y-4">
    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
      <p className="text-sm font-medium text-purple-900">📋 Quiz</p>
      {block.description && (
        <p className="text-sm text-purple-700 mt-1">{block.description}</p>
      )}
    </div>
    <OptionsSelect
      options={block.answers}
      questionType={block.questionType}
      selectedOptions={answerState.selectedOptions}
      onOptionSelect={(selected) => onStateChange("selectedOptions", selected)}
      submitted={isSubmitted}
    />
  </div>
);

// Main component
export default function GuideModulePage({
  params,
}: {
  params: Promise<{ module_id: string }>;
}) {
  const { module_id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useModule(Number(module_id));
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified Block Interaction State
  const [blockInteractionState, setBlockInteractionState] = useState<{
    selectedOptions: number[];
    customAnswer: string;
    relationalPairs: number[];
  }>({
    selectedOptions: [],
    customAnswer: "",
    relationalPairs: [],
  });

  // Reset state when block changes
  const [lastBlockIndex, setLastBlockIndex] = useState(0);
  if (currentBlockIndex !== lastBlockIndex) {
    setBlockInteractionState({
      selectedOptions: [],
      customAnswer: "",
      relationalPairs: [],
    });
    setLastBlockIndex(currentBlockIndex);
  }

  const handleStateChange = (key: string, value: any) => {
    setBlockInteractionState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRelationalPairsChange = useCallback((pairs: number[]) => {
    setBlockInteractionState((prev) => ({
      ...prev,
      relationalPairs: pairs,
    }));
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  // Reset submitted state when block changes
  if (currentBlockIndex !== lastBlockIndex) {
    setIsSubmitted(false);
  }

  // Gamification state
  const [levelUpData, setLevelUpData] = useState<Level | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto p-6 container">
        <Skeleton className="flex justify-between items-center gap-4 bg-neutral-200! p-4 rounded-xl h-20">
          <div className="flex items-center gap-4 text-white">
            <Skeleton className="size-10 bg-neutral-100!" />
            <div className="flex flex-col">
              <Skeleton className="bg-neutral-100! w-32 h-8" />
              <Skeleton className="bg-neutral-100! w-24 h-6" />
            </div>
          </div>
          <Skeleton className="w-12 h-9 bg-neutral-100!" />
        </Skeleton>
        <div className="space-y-4 mt-6">
          <Skeleton className="w-full h-8 bg-neutral-200!" />
          <Skeleton className="w-3/4 h-6 bg-neutral-200!" />
          <div className="space-y-3 mt-8">
            <Skeleton className="w-full h-16 bg-neutral-200!" />
            <Skeleton className="w-full h-16 bg-neutral-200!" />
            <Skeleton className="w-full h-16 bg-neutral-200!" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="font-bold text-red-600 text-2xl">Error</h2>
          <p className="text-gray-600">No se pudo cargar el módulo</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="font-bold text-gray-600 text-2xl">
            Módulo no encontrado
          </h2>
        </div>
      </div>
    );
  }

  const handleGamificationFeedback = (result: BlockSubmissionResult) => {
    // Check for badges
    if (result.awardedBadges && result.awardedBadges.length > 0) {
      result.awardedBadges.forEach((badge) => {
        toast("¡Nueva insignia desbloqueada!", {
          description: badge.name,
          icon: badge.imageUrl ? (
            <img
              src={badge.imageUrl}
              alt={badge.name}
              className="w-8 h-8 object-contain rounded-full bg-neutral-100 p-1"
            />
          ) : (
            <span className="text-2xl">🏆</span>
          ),
          duration: 5000,
        });
      });
    }

    // Check for level up
    if (result.leveledUp && result.newLevel) {
      setLevelUpData(result.newLevel);
      setShowLevelUpModal(true);
      // Play level up sound if desired (reuse feedback sound logic or new one)
    }
  };

  const recordInteraction = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const result = await userBlockResponseService.submitResponse(payload);

      // Handle gamification feedback immediately after successful response
      if (result.data) {
        handleGamificationFeedback(result.data);
      }

      return result;
    } catch (err) {
      console.error("Integration Error:", err);
      toast.error("No se pudo guardar el progreso");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const playFeedbackSound = (type: "success" | "error") => {
    const audio = new Audio(
      type === "success" ? "/success-sound.mp3" : "/error-sound.mp3",
    );
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  const handleAnswerSubmit = async () => {
    if (!currentBlock) return;

    setIsSubmitting(true);
    try {
      // Determine correctness locally for Open Ended (always correct)
      if (currentBlock.questionType === "open_ended") {
        // Proceed to record interaction but treat as success
      }

      const payload: any = {
        blockId: currentBlock.id,
      };

      if (
        currentBlock.type === "interactive" &&
        currentBlock.dynamicType === "matching"
      ) {
        payload.relationalPairIds = blockInteractionState.relationalPairs;
      } else if (
        currentBlock.type === "question" &&
        currentBlock.questionType === "open_ended"
      ) {
        payload.customAnswer = blockInteractionState.customAnswer;
      } else {
        // Standard questions/quizzes
        payload.selectedAnswerIds = blockInteractionState.selectedOptions;
      }

      const result = await recordInteraction(payload);

      if (result) {
        setIsSubmitted(true); // Mark as submitted to disable inputs and show result UI

        if (
          result.data.isCorrect ||
          currentBlock.questionType === "open_ended" ||
          (currentBlock.dynamicType === "matching" &&
            blockInteractionState.relationalPairs.length ===
              (currentBlock.relationalPairs?.length || 0))
        ) {
          playFeedbackSound("success");
          const pointsToShow = result.data.earnedPoints || currentBlock.points;
          toast.success(
            currentBlock.questionType === "open_ended"
              ? "Respuesta guardada"
              : `¡Correcto! +${pointsToShow} puntos`,
          );
        } else {
          playFeedbackSound("error");
          toast.error("Esa no es la respuesta correcta");
        }
      }
    } catch (err) {
      toast.error("Error al enviar la respuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerContentStep = async () => {
    if (!currentBlock) return;

    // Content types that register progress when clicking "Next"
    const contentTypes = ["video", "image", "interactive", "text"];
    if (contentTypes.includes(currentBlock.type)) {
      try {
        const result = await userBlockResponseService.submitResponse({
          blockId: currentBlock.id,
          resourceViewed: true,
        });

        if (result.data) {
          handleGamificationFeedback(result.data);
        }
      } catch (err) {
        console.error("Failed to register content view", err);
      }
    }
  };

  const handleNextBlock = async () => {
    const isLastBlock = currentBlockIndex === moduleData.blocks.length - 1;

    // Only register content view if not already submitted (interactive blocks submit earlier)
    if (!isSubmitted) {
      await registerContentStep();
    }

    setIsSubmitted(false); // Reset for next block
    setBlockInteractionState({
      selectedOptions: [],
      customAnswer: "",
      relationalPairs: [],
    });

    if (isLastBlock) {
      toast.success("¡Módulo completado!", {
        description: `Has terminado ${moduleData.name}. Volviendo a la guía...`,
      });

      // Delay slightly so the user can read the toast and backend can finish
      setTimeout(() => {
        router.push(`/guides/${data.data.guide.id}`);
      }, 1500);
    } else {
      // Move to next block
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const moduleData: Module = data?.data;
  const currentBlock = moduleData?.blocks[currentBlockIndex];
  const isContentBlock = ["video", "image", "interactive", "text"].includes(
    currentBlock?.type || "",
  );
  const isLastBlock =
    currentBlockIndex === (moduleData?.blocks.length || 0) - 1;

  // Render appropriate block component based on type
  const renderBlock = () => {
    switch (currentBlock.type) {
      case "text":
        return <TextBlock block={currentBlock} />;
      case "video":
        return <VideoBlock block={currentBlock} />;
      case "image":
        return <ImageBlock block={currentBlock} />;
      case "question":
        return (
          <QuestionBlock
            block={currentBlock}
            answerState={blockInteractionState}
            onStateChange={handleStateChange}
            isSubmitted={isSubmitted}
          />
        );
      case "quiz":
        return (
          <QuizBlock
            block={currentBlock}
            answerState={blockInteractionState}
            onStateChange={handleStateChange}
            isSubmitted={isSubmitted}
          />
        );
      case "interactive":
        if (currentBlock.dynamicType === "matching") {
          return (
            <RelationalPairsBlock
              block={currentBlock}
              onChange={handleRelationalPairsChange}
              isSubmitted={isSubmitted}
            />
          );
        }
        return <InteractiveBlock block={currentBlock} />;
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Tipo de bloque no soportado: {currentBlock.type}
            </p>
          </div>
        );
    }
  };

  // Get block type icon
  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return "📝";
      case "video":
        return "🎥";
      case "image":
        return "🖼️";
      case "question":
        return "❓";
      case "interactive":
        return "🎮";
      case "quiz":
        return "📋";
      default:
        return "📄";
    }
  };

  return (
    <div className="mx-auto p-6 container">
      <LevelUpModal
        level={levelUpData}
        open={showLevelUpModal}
        onOpenChange={setShowLevelUpModal}
      />

      <div className="flex justify-between items-center gap-4 bg-white mb-6 p-4 border-2 border-neutral-200 rounded-xl">
        <div className="flex items-center gap-4 text-neutral-600">
          <Link
            title="Regresar a las guías"
            href={`/guides/${data.data.guide.id}`}
            className="flex justify-center items-center hover:bg-neutral-300/50 rounded-md size-10 text-neutral-400"
          >
            <CornerUpLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-1">
            <h1 className="w-full font-bold text-2xl whitespace-nowrap">
              {data.data.name}
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center gap-1 border-2 border-neutral-200 rounded-lg min-w-10 size-10 font-semibold text-neutral-500">
          <span className="text-teal-500">{currentBlockIndex + 1}</span>/
          <span>{data.data.blocks.length}</span>
        </div>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
        {/* Block header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {getBlockTypeIcon(currentBlock.type)}
            </span>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              {currentBlock.type}
            </span>
          </div>
          <h2 className="font-bold text-neutral-800 text-xl">
            {currentBlock.statement}
          </h2>
        </div>

        {/* Block content */}
        {renderBlock()}

        {/* Feedback section */}
        {currentBlock.feedback && (
          <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-500 rounded">
            <p className="text-sm font-medium text-teal-900">
              💡 Retroalimentación
            </p>
            <p className="text-sm text-teal-700 mt-1">
              {currentBlock.feedback}
            </p>
          </div>
        )}

        {/* Points indicator */}
        {currentBlock.points > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="px-3 py-1 bg-neutral-100 rounded-full text-sm font-medium text-neutral-700">
              ⭐ {currentBlock.points} puntos
            </div>
          </div>
        )}
      </div>

      {/* Navigation between blocks */}

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePrevBlock}
          disabled={currentBlockIndex === 0 || isSubmitting}
          variant="outline"
        >
          Anterior
        </Button>

        {/* Render "Verify" or "Continue" logic */}
        {(() => {
          const needsVerification = [
            "question",
            "quiz",
            "interactive",
          ].includes(currentBlock.type);
          const canSubmit =
            (currentBlock.type === "question" &&
              currentBlock.questionType === "open_ended" &&
              blockInteractionState.customAnswer.trim().length > 0) ||
            (currentBlock.type === "question" &&
              currentBlock.questionType !== "open_ended" &&
              blockInteractionState.selectedOptions.length > 0) ||
            (currentBlock.type === "quiz" &&
              blockInteractionState.selectedOptions.length > 0) ||
            (currentBlock.dynamicType === "matching" &&
              blockInteractionState.relationalPairs.length > 0); // Logic: Pairs block validates itself? No, we used to check if all matched. Ideally we check if pairs count == expected.

          // For matching, we might want to ensure ALL items are paired.
          // But let's simplify check: can submit if there's anything in relationalPairs?
          // Actually, previously RelationalPairsBlock prevented submit if not fully matched.
          // We can check block.relationalPairs.length (pairs count) vs state pairs count.
          // If block.relationalPairs is available.
          const isMatchingComplete =
            currentBlock.dynamicType === "matching"
              ? blockInteractionState.relationalPairs.length ===
                (currentBlock.relationalPairs?.length || 0)
              : true;

          const isReadyToSubmit = canSubmit && isMatchingComplete;

          if (needsVerification && !isSubmitted) {
            return (
              <Button
                onClick={handleAnswerSubmit}
                disabled={isSubmitting || !isReadyToSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting
                  ? "Verificando..."
                  : currentBlock.questionType === "open_ended"
                  ? "Enviar"
                  : "Verificar"}
              </Button>
            );
          }

          return (
            <Button
              onClick={handleNextBlock}
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLastBlock ? "Finalizar" : "Continuar"}
            </Button>
          );
        })()}
      </div>
    </div>
  );
}
