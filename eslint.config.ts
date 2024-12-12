import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "lib",
    unocss: false,
    formatters: true,
    stylistic: {
      quotes: "double",
      semi: true,
      overrides: {
        "style/indent-binary-ops": ["warn", 2],
        "array-callback-return": ["warn"],
        "valid-typeof": ["warn"],
        "unused-imports/no-unused-vars": ["error", {
          varsIgnorePattern: "^(_|cases)",
          argsIgnorePattern: "^_",
        }],
        "antfu/no-top-level-await": ["off"],
        "no-console": ["off"],
      },
    },
    regexp: {
      overrides: {
        "regexp/no-super-linear-backtracking": ["warn"],
      },
    },
    typescript: {
      overrides: {
        "ts/explicit-function-return-type": ["off"],
        "ts/ban-ts-comment": ["error", {
          "ts-ignore": false,
        }],
      },
    },
  },
);
