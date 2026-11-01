# Remediations of Security Review Findings

Review date and time: 2026-10-28T11:52:43Z (UTC)

## Remediations

### Remediation of Finding 1: Script injection in `pull_request_target` workflow via attacker-controlled PR file names

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [f8d2d5a](https://github.com/reach2saksham/SupportUsButton/commit/f8d2d5afca67010335a8b8aa557edde1770477fc)

Description: The changed file names and the issue number in sync-pr-labels.yml, and label_was_present in coderabbit-approval.yml, now reach github-script through env: and are read with process.env, as the review recommended.

## Non-remediated findings

None.
