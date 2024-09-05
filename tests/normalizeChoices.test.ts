import {  Expect } from "@type-challenges/utils";
import { HasSameValues } from "inferred-types";
import { normalizeChoices } from "src/utils";
import { describe, expect, it } from "vitest";


describe("normalizeChoices() utility", () => {

  it("use with array format", () => {
    const c1 = normalizeChoices(["red","blue","green"]);
    type Expected1 = [
      {type: "choice"; name: "red"; value: "red"},
      {type: "choice"; name: "blue"; value: "blue"},
      {type: "choice"; name: "green"; value: "green"},
    ]

    expect(c1).toEqual([
      {type: "choice", name: "red", value: "red"},
      {type: "choice", name: "blue", value: "blue"},
      {type: "choice", name: "green", value: "green"},
    ])

    const c2 = normalizeChoices([42,99,"foo","0"]);
    type Expected2 = [
      { type: "choice"; name: "42"; value: 42 },
      { type: "choice"; name: "99"; value: 99 },
      { type: "choice"; name: "foo"; value: "foo" },
      { type: "choice"; name: "0"; value: "0" },
    ]


    expect(c2).toEqual([
      {type: "choice", name: "42", value: 42},
      {type: "choice", name: "99", value: 99},
      {type: "choice", name: "foo", value: "foo"},
      {type: "choice", name: "0", value: "0"},
    ]);

    // @ts-ignore
    type cases = [
      Expect<HasSameValues<typeof c1, Expected1>>,
      Expect<HasSameValues<typeof c2, Expected2>>,
    ];

  });

  
  it("use with dictionary format", () => {
    const c1 = normalizeChoices({
      Red: "red",
      Blue: "blue",
      Green: "green"
    });

    expect(c1).toEqual([
      {type: "choice", name: "Red", value: "red"},
      {type: "choice", name: "Blue", value: "blue"},
      {type: "choice", name: "Green", value: "green"},
    ])
    
    // @ts-ignore
    type cases = [
      Expect<HasSameValues<typeof c1,
      [
        {type: "choice", name: "Red", value: "red"},
        {type: "choice", name: "Blue", value: "blue"},
        {type: "choice", name: "Green", value: "green"},
      ]>>
    ];
    
  });
  

});
