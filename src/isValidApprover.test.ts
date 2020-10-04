import { _isApproverContained, isValidApprover } from "./isValidApprover";

test("when codeownersFileContent is empty, return true", () => {
  expect(
    isValidApprover({
      codeownersFileContent: [].join("\n"),
      approvers: ["foo"],
      filepath: "a/b/c",
      membersByTeams: {},
    })
  ).toEqual(true);
});

test("when reviewer contain corresponding codeowners, return true", () => {
  expect(
    isValidApprover({
      codeownersFileContent: ["* @foo"].join("\n"),
      approvers: ["foo"],
      filepath: "a/b/c",
      membersByTeams: {},
    })
  ).toEqual(true);
});

describe("_isReviewerContained", () => {
  // [patternName, codeowners, approvers, membersByTeams, expectedResult]
  const parameters = [
    ["1", [], [], {}, false],
    ["2", ["foo"], [], {}, false],
    ["3", ["foo"], ["foo"], {}, true],
    ["4", ["foo"], ["bar"], {}, false],
    ["5", ["foo"], ["org/team"], {}, false],
    ["6", ["foo"], ["org/team"], { "org/team": ["foo"] }, false],
    ["7", ["org/team"], [], {}, false],
    ["8", ["org/team"], ["foo"], { "org/team": [""] }, false],
    ["9", ["org/team"], ["foo"], { "org/team": ["foo"] }, true],
    ["10", ["org/team"], ["foo"], { "org/team": ["bar"] }, false],
  ] as Array<
    [
      string,
      Array<string>,
      Array<string>,
      { [teamName: string]: Array<string> },
      boolean
    ]
  >;
  parameters.forEach((a) => {
    test(String(a[0]), () => {
      expect(
        _isApproverContained({
          codeowners: a[1],
          approvers: a[2],
          membersByTeams: a[3],
        })
      ).toEqual(a[4]);
    });
  });
});
