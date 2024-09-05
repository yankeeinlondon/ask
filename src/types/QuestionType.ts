/**
 * a union of acceptable values for the `type` of a Question
 */
export type QuestionType = 
| "input"
| "number"
| "confirm"
| "select"
| "rawlist"
| "expand"
| "search"
| "checkbox"
| "password"
| "editor";