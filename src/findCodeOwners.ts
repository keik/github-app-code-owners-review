import ignore from "ignore";

export const findCodeOwners = ({
  codeownersFileContent,
  filepath,
}: {
  codeownersFileContent: string;
  filepath: string;
}): Array<string> => {
  const matchedLine = codeownersFileContent
    .split("\n")
    .reverse()
    .find((line) => {
      return ignore()
        .add([line.split(/\s+/)[0]])
        .test(filepath).ignored;
    });

  if (matchedLine == null) return [];

  const [, ...owners] = matchedLine.split(/\s+/);
  const logins = owners
    .filter((a) => /^@/.test(a))
    .map((a) => a.replace(/^@/, ""));
  return logins;
};
