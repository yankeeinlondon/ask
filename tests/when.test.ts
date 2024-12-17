import inquirer from "inquirer";
import { ask, survey } from "src";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock inquirer
vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn(),
  },
}));

const remove = ask.select("remove", `What action would you like to take:`, [
  "keep all",
  "remove all",
  "remove selected",
]);

const which = ask
  .withRequirements({ remove: "string(keep all,remove all,remove selected)" })
  .checkbox(
    "which",
    "Choose which to delete",
    ["foo", "bar", "baz"],
    {
      when: (v) => {
        return v.remove === "remove selected";
      },
    },
  );

describe("when conditional", () => {
  it("should ask 'which' question when 'remove selected' is chosen", async () => {
    // Mock the responses
    const mockPrompt = vi.mocked(inquirer.prompt);
    mockPrompt
      .mockResolvedValueOnce({ remove: "remove selected" }) // First question
      .mockResolvedValueOnce({ which: ["foo", "bar"] }); // Second question

    const result = await survey(remove, which).start();

    expect(mockPrompt).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      remove: "remove selected",
      which: ["foo", "bar"],
    });
  });

  it("should not ask 'which' question when 'keep all' is chosen", async () => {
    // Mock the response
    const mockPrompt = vi.mocked(inquirer.prompt);
    mockPrompt.mockResolvedValueOnce({ remove: "keep all" });

    const result = await survey(remove, which).start();

    expect(mockPrompt).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      remove: "keep all",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
