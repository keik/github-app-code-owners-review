import { EventPayloads } from "@octokit/webhooks";
import { Context } from "probot";

export const getCodeownersFileContent = async (
  context: Context<EventPayloads.WebhookPayloadPullRequest>
): Promise<string> => {
  return Buffer.from(
    (
      await context.github.repos.getContent(
        context.repo({ path: ".github/CODEOWNERS" })
      )
    ).data.content,
    "base64"
  ).toString();
};

export const getChangedFilepaths = async (
  context: Context<EventPayloads.WebhookPayloadPullRequest>
): Promise<Array<string>> => {
  const pullRequest = context.payload.pull_request;
  return (
    await context.github.pulls.listFiles({
      owner: context.repo().owner,
      repo: context.repo().repo,
      pull_number: pullRequest.number,
    })
  ).data.map((a) => a.filename);
};

export const getApprovers = async (
  context: Context<EventPayloads.WebhookPayloadPullRequest>
): Promise<Array<string>> => {
  const pullRequest = context.payload.pull_request;
  const reviews = (
    await context.github.pulls.listReviews({
      owner: context.repo().owner,
      repo: context.repo().repo,
      pull_number: pullRequest.number,
    })
  ).data;
  const approversWithDuplicate = reviews
    .sort((a, b) => (a.submitted_at > b.submitted_at ? 1 : -1))
    .reduce(
      (acc, review) =>
        review.state === "APPROVED"
          ? [...acc, review.user.login]
          : review.state === "CHANGES_REQUESTED" || review.state === "DISMISSED"
          ? acc.filter((a) => a !== review.user.login)
          : acc,
      [] as Array<string>
    );
  return Array.from(new Set(approversWithDuplicate));
};

export const getMembersByTeamsFromCodeownersFileContent = async (
  context: Context,
  codeownersFileContent: string
): Promise<{ [teamName: string]: Array<string> }> => {
  const ownerTeams = Array.from(
    new Set(
      Array.prototype.concat.apply(
        [],
        codeownersFileContent.split("\n").map((line) => {
          const [, ...owners] = line.split(/\s+/);
          return owners;
        })
      )
    )
  )
    .filter((a) => a.includes("/"))
    .map((a) => a.replace(/^@/, ""));

  return (
    await Promise.all(
      ownerTeams.map(async (ownerTeam) => {
        return {
          [ownerTeam]: (
            await context.github.teams.listMembersInOrg({
              org: ownerTeam.split("/")[0],
              team_slug: ownerTeam.split("/")[1],
            })
          ).data.map((member) => member.login),
        };
      })
    )
  ).reduce((acc, a) => ({ ...acc, ...a }));
};
