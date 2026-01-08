"use client";

import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import OptionsSelect from "@/components/citizen/modules/options-select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useModule } from "@/hooks/use-modules";
import type { Block } from "@/types/block";
import type { Module } from "@/types/module";
import { toast } from "sonner";
import { userBlockResponseService } from "@/services/user-block-response.service";
import { useRouter } from "next/navigation";

// Block rendering components
const TextBlock = ({
  block,
  onSubmit,
  isSubmitting,
}: {
  block: Block;
  onSubmit: (text: string) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [answer, setAnswer] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Regex: Allow Alphanumeric, spaces, commas, and dots
    const filteredValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.]/g, "");
    setAnswer(filteredValue);
  };

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{block.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="text-sm font-medium text-neutral-600">
          Tu respuesta:
        </label>
        <textarea
          value={answer}
          onChange={handleChange}
          placeholder="Escribe aquí tu respuesta..."
          className="w-full min-h-[120px] p-4 rounded-xl border-2 text-gray-500 border-neutral-200 focus:border-teal-500 focus:ring-0 transition-colors resize-none"
          disabled={isSubmitting}
        />
        <Button
          onClick={() => onSubmit(answer)}
          disabled={isSubmitting || !answer.trim()}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isSubmitting ? "Enviando..." : "Enviar respuesta"}
        </Button>
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
  onSubmit,
}: {
  block: Block;
  onSubmit: (selectedOptions: number[]) => Promise<void>;
}) => (
  <div className="space-y-4">
    {block.description && (
      <p className="text-gray-600 mb-4">{block.description}</p>
    )}
    <OptionsSelect
      options={block.answers}
      questionType={block.questionType}
      onSubmit={onSubmit}
    />
  </div>
);

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
  onSubmit,
}: {
  block: Block;
  onSubmit: (selectedOptions: number[]) => Promise<void>;
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
      onSubmit={onSubmit}
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

  const recordInteraction = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const result = await userBlockResponseService.submitResponse(payload);
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
      type === "success" ? "/success-sound.mp3" : "/error-sound.mp3"
    );
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  const handleAnswerSubmit = async (selectedOptions: number[]) => {
    if (!currentBlock) return;

    setIsSubmitting(true);
    try {
      const result = await recordInteraction({
        blockId: currentBlock.id,
        selectedAnswerIds: selectedOptions,
      });

      if (result) {
        if (result.data.isCorrect) {
          playFeedbackSound("success"); // Play success sound
          toast.success(`¡Correcto! +${result.data.earnedPoints} puntos`);
        } else {
          playFeedbackSound("error"); // Play error sound
          toast.error("Esa no es la respuesta correcta");
        }

        const isLastBlock = currentBlockIndex === moduleData.blocks.length - 1;

        setTimeout(() => {
          if (isLastBlock) {
            toast.success("Módulo finalizado");
            router.push(`/guides/${data.data.guide.id}`);
          } else {
            handleNextBlock();
          }
        }, 1500);
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
    const contentTypes = ["video", "image", "interactive"];
    if (contentTypes.includes(currentBlock.type)) {
      try {
        await userBlockResponseService.submitResponse({
          blockId: currentBlock.id,
          resourceViewed: true,
        });
      } catch (err) {
        console.error("Failed to register content view", err);
      }
    }
  };

  const handleNextBlock = async () => {
    const isLastBlock = currentBlockIndex === moduleData.blocks.length - 1;

    await registerContentStep();

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

  const handleTextSubmit = async (text: string) => {
    if (!currentBlock) return;

    const result = await recordInteraction({
      blockId: currentBlock.id,
      customAnswer: text,
    });

    if (result) {
      // Check if this was the last block after submitting text
      const isLastBlock = currentBlockIndex === moduleData.blocks.length - 1;

      if (isLastBlock) {
        toast.success("¡Módulo completado!");
        setTimeout(() => {
          router.push(`/guides/${data.data.guide.id}`);
        }, 1500);
      } else {
        toast.success("Respuesta guardada");
        handleNextBlock();
      }
    }
  };

  const moduleData: Module = data?.data;
  const currentBlock = moduleData?.blocks[currentBlockIndex];
  const isContentBlock = ["video", "image", "interactive"].includes(
    currentBlock?.type || ""
  );
  const isLastBlock =
    currentBlockIndex === (moduleData?.blocks.length || 0) - 1;

  // Render appropriate block component based on type
  const renderBlock = () => {
    switch (currentBlock.type) {
      case "text":
        return (
          <TextBlock
            block={currentBlock}
            onSubmit={handleTextSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case "video":
        return <VideoBlock block={currentBlock} />;
      case "image":
        return <ImageBlock block={currentBlock} />;
      case "question":
        return (
          <QuestionBlock block={currentBlock} onSubmit={handleAnswerSubmit} />
        );
      case "quiz":
        return <QuizBlock block={currentBlock} onSubmit={handleAnswerSubmit} />;
      case "interactive":
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
        {(isContentBlock || currentBlockIndex < moduleData.blocks.length) && (
          <Button
            onClick={handleNextBlock}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSubmitting
              ? "Cargando..."
              : isLastBlock
              ? "Finalizar"
              : "Continuar"}
          </Button>
        )}
      </div>
    </div>
  );
}
