import { vi } from "vitest";

const promptMock = vi.fn(async (questions: any) => {
  if (Array.isArray(questions)) {
    return questions.reduce(
      (acc, q) => ({ ...acc, [q.name]: getMockAnswer(q) }),
      {},
    );
  }
  return { [questions.name]: getMockAnswer(questions) };
});

function getMockAnswer(question: any) {
  switch (question.type) {
    case "input":
      return "Mock Answer";
    case "number":
      return 30;
    case "select":
      return question.choices[0];
    default:
      return "Mock Answer";
  }
}

export const inquirer = {
  prompt: promptMock,
};

// This is necessary for the mock to work with ES modules
export default {
  prompt: promptMock,
};
