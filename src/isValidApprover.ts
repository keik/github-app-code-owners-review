import { findCodeOwners } from "./findCodeOwners";

export const isValidApprover = ({
  codeownersFileContent,
  approvers,
  filepath,
  membersByTeams,
}: {
  codeownersFileContent: string;
  approvers: Array<string>;
  filepath: string;
  membersByTeams: { [teamName: string]: Array<string> };
}): boolean => {
  const codeowners = findCodeOwners({
    codeownersFileContent,
    filepath,
  });
  if (codeowners.length === 0) return true;

  return _isApproverContained({ codeowners, approvers, membersByTeams });
};

export const _isApproverContained = ({
  codeowners,
  approvers,
  membersByTeams,
}: {
  codeowners: Array<string>;
  approvers: Array<string>;
  membersByTeams: { [teamName: string]: Array<string> };
}): boolean => {
  return codeowners.some(
    (codeowner) =>
      // single user or team
      approvers.includes(codeowner) ||
      // team members
      (membersByTeams[codeowner] ?? []).some((codeowner) =>
        approvers.includes(codeowner)
      )
  );
};
