# github-app-code-owners-review

GitHub App to require review (approval) from Code Owners before merging -- without auto-assignment.

## Why

GitHub official feature "Require review from Code Owners" is great, **except auto-assignment to entire *teams**.

The problem is that if Code Owners is set to the team like:

```
* @org-name/team-name
```

then when Pull Request is created, Code Owners would be assigned as reviewers automatically. If Code Owners include teams, all the team member will subscribe the PR and receive tons of notifications.

# Settings

Put [CODEOWNERS](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/about-code-owners) file to `${root}/.github` directory.

If the team has write permission to repository, GitHub will automaticaly assign.
To avoid this, remove repository from team or apply less permission like read-only.

Incompatible notes:

* `${root}/CODEOWNERS` or `docs/CODEOWNERS` are not available.
* Cannot refer to a user as Code Owners by email address. Only GitHub username and team name is available.
