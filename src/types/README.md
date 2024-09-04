# ask
>
> strongly typed builder patterns wrapping the popular [inquirer](https://github.com/SBoudrias/Inquirer.js?tab=readme-ov-file) CLI utility

## Overview

I have turned to **inquirer** many times over the years when I need to build an interactive dialog with a user via the terminal. It's a great utility but because I'm not a regular user I keep on having to _reacquaint_ myself with it and it's types each time.

The library is so good i'm sure that a regular user would be happy to use "as is" but I find the relearning curve a bit too steep. Admittedly I like my food to fed to me in a small spoon. Anyway, this library wraps the inquirer library and attempts to provide two builders: `ask` and `survey`.

## Ask Builder


- allows the lazy creation of questions with a strongly typed builder pattern:

    ```ts
    import { ask } from "@yankeeinlondon/ask";

    const name = ask.input("name", "What is your name?");
    const age  = ask.number("age", "How old are you?", { min: 1, max: 150});
    ```

- these questions can then be _asked_ by simply calling them:

    ```ts
    const answers = {
        name: await name(),
        age: await age(),
    }
    ```

### Advanced Features

We support all the core question types that **inquirer** along with the options exposed by these various question types. In addition we've added a few advanced features that don't come "out of the box" with **inquirer**:


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
const shallWeContinue = await cont({name: "Bob Marley", age: 45});
```

This use of "requirements" becomes even more useful in the next section when we look at the **survey** builder.

#### `abortTimeout` and `acceptTimeout`




## Survey Builder

**NOTE:** THIS IS NOT IMPLEMENTED YET. COMING SOON.

The `survey` builder is intended to aid in the composition of questions. In it's most straightforward example, it provides a way to chain questions together like we see here:

```ts
import { ask, survey } from "@yankeeinlondon/ask";

const name = ask.input("name", "What is your name?");
const age  = ask.number("age", "How old are you?", { min: 1, max: 150});
const cont = ask
      .withRequirements({ name: "string", age: "number" })
      .confirm("continue", "Continue with installation?");

const install = survey(
    name,
    age,
    cont
);

const answers = await install.start();
```

A survey guarantees order, in this case ensuring that `name` is asked first, then `age`, and finally `cont` which we expressed has a requirement but assuming the two prior questions have been asked then it's requirement will be met.

When, however, you place a question with requirements into a flow which does _not_ sufficiently meet the requirements of the questions contained you will find that you have a type error. Addressing this type error can be done by adding in questions prior to the dependant question such that requirements are met, or you can simply pass in the missing requirements to the `start()` function.

> **Note:** the `when` option is available across all questions and if you are using this then any question added to a survey will only _optionally_ return that value. 

### Conditionals / Branching

In addition to being able to compose questions in a simple chain (one which _does_ honor the `when` clause); there are two types of conditional clauses which can create branching behavior:

- `branchIf()` - if a certain boolean condition is met then run another survey before returning to the complete the current one

    Loosely building off our prior examples, let's look at this operator in action:

    ```ts
    import { ask, survey, branchIf } from "@yankeeinlondon/ask";

    const why = survey(
        ask.input("why", "Can you tell us why you don't want to install?")
    );

    const install = survey(
        name,
        age,
        cont,
        branchIf((answers) => !continue, why)
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
- `search` 
- `password` - _masked_ text input
- `expand` - take actions with shortcut keys
- `editor` - 
- `number` - numeric input
- `rawlist` 

