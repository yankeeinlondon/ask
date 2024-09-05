# Ask

> two builders wrapped around the popular [`inquirer`](https://github.com/SBoudrias/Inquirer.js) package to make asking questions even easier.

## Overview

I use the **inquirer** package every few years but each time I go through a learning curve which I wish I didn't have to go through. This repo is an attempt to simplify the process by:

- using builder patterns where possible
- bring the documentation into the type system (and therefore closer to the user)
- improve question composition so that interactive flows are easy to build

## Installation

```sh
pnpm install @yankeeinlondon/ask
```

## Usage

There are two main builder patterns which will be used in **Ask**:

1. `ask` - for building questions
2. `survey` - for composing questions into an interactive flow


### Ask Builder

By importing `ask` from this repo, you'll get an API surface which provides a standardized way of composing any of the questions provided in the core `inquirer` package:

```ts
import { ask } from "@yankeeinlondon/ask";

const name = ask.input("name", "What is your name?");
const age = ask.number("age", "How old are you?");
```

These questions can be _asked_ simply by calling the result as an async function:

```ts
const answers = {
    name: await name(),
    age: await age()
}
```

#### Choices

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
    ["red","blue","green"]
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
)
```

Any question type which _has_ **choices** provides the same call signature and variants for representing the choices.


#### Options

Many questions, share some key _options_, but all options present only the options relevant to themselves as a question type.

Where possible, we have attempted to _increase_ the commonality across question types. Examples include:

- `default` is found on some of the core **inquirer** commands but oddly missing in others -- like **checkbox** -- so we've extended it to work here too.



## `survey` Builder

The survey builder's intent is to aid in the _composition_ of questions and interactive flows and to make the process as seamless as possible.


