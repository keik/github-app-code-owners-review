import { findCodeOwners } from "./findCodeOwners";

test("when not match", () => {
  expect(
    findCodeOwners({
      codeownersFileContent: ["a/b/c/d @foo"].join("\n"),
      filepath: "a/b/c",
    })
  ).toEqual([]);
});

test("when match single owner", () => {
  expect(
    findCodeOwners({
      codeownersFileContent: ["* @foo"].join("\n"),
      filepath: "a/b/c",
    })
  ).toEqual(["foo"]);
});

test("when match multiple owner", () => {
  expect(
    findCodeOwners({
      codeownersFileContent: ["* @foo @bar"].join("\n"),
      filepath: "a/b/c",
    })
  ).toEqual(["foo", "bar"]);
});
