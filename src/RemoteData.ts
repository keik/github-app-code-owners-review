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

export const getReviewers = async (
  context: Context<EventPayloads.WebhookPayloadPullRequest>
): Promise<Array<string>> => {
  const pullRequest = context.payload.pull_request;
  pullRequest.requested_reviewers;
  const loginsFromRequestedReviewers = pullRequest.requested_reviewers.map(
    (reviewer) => reviewer.login
  );
  const loginsFromRequestedTeams = pullRequest.requested_teams.map(
    (team) => `${context.repo().owner}/${team.slug}`
  );
  return [...loginsFromRequestedReviewers, ...loginsFromRequestedTeams];
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
