import { findCodeOwners } from "./findCodeOwners";

export const isValidReviewer = ({
  codeownersFileContent,
  reviewers,
  filepath,
  membersByTeams,
}: {
  codeownersFileContent: string;
  reviewers: Array<string>;
  filepath: string;
  membersByTeams: { [teamName: string]: Array<string> };
}): boolean => {
  const codeowners = findCodeOwners({
    codeownersFileContent,
    filepath,
  });
  if (codeowners.length === 0) return true;

  return _isReviewerContained({ codeowners, reviewers, membersByTeams });
};

export const _isReviewerContained = ({
  codeowners,
  reviewers,
  membersByTeams,
}: {
  codeowners: Array<string>;
  reviewers: Array<string>;
  membersByTeams: { [teamName: string]: Array<string> };
}): boolean => {
  return codeowners.some(
    (codeowner) =>
      // single user or team
      reviewers.includes(codeowner) ||
      // team members
      (membersByTeams[codeowner] ?? []).some((codeowner) =>
        reviewers.includes(codeowner)
      )
  );
};
