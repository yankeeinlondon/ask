export const QUESTION_TYPES = [
  "input",
  "number",
  "confirm",
  "select",
  "rawlist",
  "expand",
  "search",
  "checkbox",
  "password",
  "editor",
] as const;

export const QUESTIONS_WITH_CHOICES = [
  "select",
  "checkbox",
  "rawlist",
  "expand",
  "search",
] as const;

export const QUESTIONS_WITH_MULTI_SELECT = ["checkbox"] as const;
