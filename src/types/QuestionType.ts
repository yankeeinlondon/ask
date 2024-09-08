import {
  QUESTION_TYPES,
  QUESTIONS_WITH_CHOICES,
  QUESTIONS_WITH_MULTI_SELECT,
} from "src/constants";

/**
 * a union of acceptable values for the `type` of a Question
 */
export type QuestionType = (typeof QUESTION_TYPES)[number];

export type QuestionsWithChoices = (typeof QUESTIONS_WITH_CHOICES)[number];

export type QuestionsWithMultiSelect =
  (typeof QUESTIONS_WITH_MULTI_SELECT)[number];
