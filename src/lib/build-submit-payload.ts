import { QuestionType } from "@/types/block";


export function buildSubmitPayload(
  blockId: number,
  questionType: QuestionType,
  state: any
) {
  const base = { blockId };

  switch (questionType) {
    case QuestionType.MULTIPLE_CHOICE:
      return {
        ...base,
        selectedAnswerIds: state.selectedAnswerIds,
      };

    case QuestionType.TRUE_FALSE:
      return {
        ...base,
        selectedAnswerIds: [state.selectedAnswerId],
      };

    case QuestionType.OPEN_ENDED:
      return {
        ...base,
        customAnswer: state.textAnswer,
      };

    case QuestionType.MATCHING:
      return {
        ...base,
        relationalPairId: state.selectedPairId,
      };

    case QuestionType.ORDERING:
      return {
        ...base,
        selectedAnswerIds: state.orderedAnswerIds,
      };

    default:
      throw new Error('Unsupported question type');
  }
}
