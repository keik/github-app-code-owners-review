# github-app-code-owners-review

GitHub App to require review from Code Owners before merging -- without auto-assignment.

## Why

GitHub original feature "Require review from Code Owners" is great, except auto-assignment.

If Code Owners is set to teams,

```
* @org-name/team-name
```

Pull Request is automatically assigned to the teams so that all team member will subscribe and receive tons of notifications.

# Settings

Put [CODEOWNERS](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/about-code-owners) file to `${root}/.github` directory.

Note: `${root}/CODEOWNERS` or `docs/CODEOWNERS` are not available.
