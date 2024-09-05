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
2. `survey` - for composing questions into a interactive flow


