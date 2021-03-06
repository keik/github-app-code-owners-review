import { EventPayloads } from "@octokit/webhooks";
import { Application, Context } from "probot";

import * as RemoteData from "./RemoteData";
import { findCodeOwners } from "./findCodeOwners";
import { isValidApprover } from "./isValidApprover";

export = (app: Application): void => {
  app.on(
    [
      "pull_request.opened",
      "pull_request.edited",
      "pull_request.synchronize",
      "pull_request_review.submitted",
      "pull_request_review.edited",
      "pull_request_review.dismissed",
    ],
    check
  );
  return;
};

const check = async (
  context: Context<EventPayloads.WebhookPayloadPullRequest>
) => {
  const startTime = new Date();

  const pullRequest = context.payload.pull_request;

  // retrieve additional GitHub data
  const codeownersFileContent = await RemoteData.getCodeownersFileContent(
    context
  );
  const approvers = await RemoteData.getApprovers(context);
  const changedFilepaths = await RemoteData.getChangedFilepaths(context);
  const membersByTeams = await RemoteData.getMembersByTeamsFromCodeownersFileContent(
    context,
    codeownersFileContent
  );

  // for debug
  // console.log(codeownersFileContent);
  // console.log(approvers);
  // console.log(changedFilepaths);
  // console.log(membersByTeams);

  const failureMessagesByFilepath: {
    [filepath: string]: string;
  } = changedFilepaths.reduce((acc, filepath) => {
    return isValidApprover({
      codeownersFileContent,
      // include author as approvers because of skipping checking owner for author-owned code.
      approvers: [...approvers, pullRequest.user.login],
      filepath,
      membersByTeams,
    })
      ? acc
      : {
          ...acc,
          [filepath]: `Review from Code Owners (${findCodeOwners({
            codeownersFileContent,
            filepath,
          }).map((a) => `@${a}`)}) required.`,
        };
  }, {});

  const isSuccess = Object.keys(failureMessagesByFilepath).length == 0;

  context.github.checks.create(
    context.repo({
      name: "code-owners-review",
      head_branch: "",
      head_sha: pullRequest.head.sha,
      status: "completed",
      started_at: startTime.toISOString(),
      conclusion: isSuccess ? "success" : "failure",
      completed_at: new Date().toISOString(),
      output: {
        title: isSuccess ? "" : "Require review from Code Owners.",
        summary: "",
        annotations: Object.keys(failureMessagesByFilepath).map((filepath) => ({
          path: filepath,
          start_line: 1,
          end_line: 1,
          annotation_level: "failure",
          message: failureMessagesByFilepath[filepath],
        })),
      },
    })
  );

  return;
};
