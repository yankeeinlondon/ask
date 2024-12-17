# ask

> strongly typed builder patterns wrapping the popular [inquirer](https://github.com/SBoudrias/Inquirer.js?tab=readme-ov-file) CLI utility

## Overview

I have turned to **inquirer** many times over the years when I need to build an interactive dialog with a user via the terminal. It's a great utility but because I'm not a regular user I keep on having to _reacquaint_ myself with it and it's types each time.

The library is so good i'm sure that a regular user would be happy to use "as is" but I find the relearning curve a bit too steep. Admittedly I like my food to fed to me in a small spoon. Anyway, this library wraps the inquirer library and attempts to provide two builders: `ask` and `survey`.

## Ask Builder

- allows the lazy creation of questions with a strongly typed builder pattern:

  ```ts
  import { ask } from "@yankeeinlondon/ask";

  const name = ask.input("name", "What is your name?");
  const age = ask.number("age", "How old are you?", { min: 1, max: 150 });
  ```

  **Note:** questions can be asked this way _only_ when they don't have any requirements;
  more on this later.

- these questions can then be asked _directly_ by simply calling them like this:

  ```ts
  // string
  const name = await name();
  ```

- these questions can also be _asked_ in a manner where they return a key/value dictionary which allows for context to be built up:

  ```ts
  // { name: string }
  const name = await name.ask();
  // { name: string; age: number }
  const age = await name.ask(name);
  ```

  If you're using this format, it's likely you should probably just use a
  `survey` (see next section).

## Survey Builder

The Survey builder is intended to _compose_ several questions together:

```ts
const nameAndAge = survey(ask, age);
```

Above we've configured a pipeline of questions to be asked. To ask them we call `.start()`:

```ts
// { name: string; age: number }
const answers = await nameAndAge.start();
```


### Choices

Many of the question types -- such as `select`, `checkbox`, `rawlist`, and `expand` -- ask that you provide a list of _choices_ for the user to choose from.

For questions which have _choices_, the third parameter -- after the property name and message/prompt -- will be those choices. You have several options in which you can express these choices so let's review them:

```ts
/**
 * a simple array.
 *
 * The elements in the array become both the keys and values of the
 * choices.
 */
const color = ask.select(
  "color",
  "What is your favorite color?",
  ["red", "blue", "green"]
);

// using a simple key/value notation
// -----------------------------------------------------------
// the KEYS are the "names" of the choices, the VALUES are
// the actual value the answer will return.
const color_obj = ask.select(
  "color",
  "What is your favorite color?",
  {
    Red: "red",
    Blue: "blue",
    Green: "green"
  }
);

/**
 *  Using a key/value where value is a tuple:
 *
 * this allows you set both the value AND a description
 */
const color_obj = ask.select(
  "color",
  "What is your favorite color?",
  {
    Red: ["red", "Red like a rose"],
    Blue: ["blue", "Blue like the sky"],
    Green: ["green", "Green like grass"]
  }
);

/**
 * Using the DictProxy shorthand
 *
 * this allows any of the props available in the fully qualified
 * `Choice` type from being expressed:
 *
 * - the "key" is the "name"
 * - you must state the "value"; otherwise all other props
 * are optional
 */

const color_proxy = ask.select(
  "color",
  "What is your favorite color?",
  {
    Red: { value: "red", description: "Red like a rose" },
    Blue: { value: "blue", key: "b" },
    Green: { value: "green", short: "gr" }
  }
);
```

Any question type which _has_ **choices** provides the same call signature and variants for representing the choices.

### Advanced Features

We support all the core question types that **inquirer** does along with the options exposed by these various question types. In addition we've added a few advanced features that don't come "out of the box" with **inquirer**:

#### `withRequirements`

Any question can express it's dependencies it expects to be fulfilled _prior_ to be being _asked_:

```ts
const cont = ask
  .withRequirements({ name: "string", age: "number" })
  .confirm("continue", "Continue with installation?");
```

Unlike the previous questions, this one expects that _name_ (as a string) and _age_ (as a number) will be provided to the question. Attempts to call this question without these parameters (aka, "ask it") will be met with a type error (if you're using TS). However, asking this question is simple enough, even in an "atomic" use case like `ask`:

```ts
// user is prompted if they would like to continue
const shallWeContinue = await cont({ name: "Bob Marley", age: 45 });
```

This use of "requirements" becomes even more useful in the next section when we look at the **survey** builder.

#### `abortTimeout` and `acceptTimeout`

TODO

### Conditionals / Branching

In addition to being able to compose questions in a simple chain (one which _does_ honor the `when` clause); there are two types of conditional clauses which can create branching behavior:

- `branchIf()` - if a certain boolean condition is met then run another survey before returning to the complete the current one

  Loosely building off our prior examples, let's look at this operator in action:

  ```ts
  import { ask, branchIf, survey } from "@yankeeinlondon/ask";

  const why = survey(
    ask.input("why", "Can you tell us why you don't want to install?")
  );

  const install = survey(
    name,
    age,
    cont,
    branchIf(a => isDefined(a.continue))
  );
  ```

  In this example, if a user says they don't want to continue, we will ask them why.

  > This example's simplicity is maybe a shortcoming as we could have easily just included another question at the end with the `when` option set but by having this conditional expression we're now able to branch out to a set of new questions based on any boolean logic we can express.

  **Note:** while in this example the condition was the last expression in the survey, this is not required, the `branchIf` expression can be placed anywhere in the survey and when it complete's this branch it will come back to the original survey and finish it.

- `split()` - based on a boolean condition, move to one survey versus another

#### `if(condition, survey)` branching

#### `split(test, survey1, survey2)` branching

## Question types Supported

All _core_ questions from Inquirer:

- `input` - text input
- `select` - choose one item from a list
- `checkbox` - choose multiple items from a list
- `confirm` - get a binary yes/no response from the user
- `search` -
- `password` - _masked_ text input
- `expand` - take actions with shortcut keys
- `editor` -
- `number` - numeric input
- `rawlist` -
