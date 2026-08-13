# AOSSIE Best Practices Checklist — SupportUsButton

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.
>
> **[Discord Channel Link](https://discord.com/channels/1022871757289422898/1458840574076387448)**
>
> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.

---

## Score Summary

| Category           | Met | Total | Status |
|--------------------|-----|-------|--------|
| Basics             | 8   | 8     | 🟢     |
| Change Control     | 6   | 6     | 🟢     |
| Reporting          | 5   | 5     | 🟢     |
| Quality            | 7   | 7     | 🟢     |
| Security & Analysis| 3   | 3     | 🟢     |
| **Total**          | **29** | **29** | **100%** |

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README clearly describes what the software does and what problem it solves.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton#readme

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/CONTRIBUTING.md

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/CONTRIBUTING.md

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/AGENTS.md

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software (README, Wiki, or docs folder).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/README.md

- [x] 🔴 **documentation_interface** — Reference documentation describes the external interface (API inputs/outputs, props schema, exports).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/README.md#component-props-api

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism.
  - *Evidence URL:* https://discord.com/channels/1022871757289422898/1458840574076387448

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* Fully documented in English.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (git).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton

### Version Numbering

- [x] 🔴 **version_unique** — Each release has a unique version identifier (e.g., v2.2.0).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/package.json

- [x] 🔵 **version_semver** — Project uses SemVer format.
  - *Note:* Follows Semantic Versioning.

- [x] 🔵 **version_tags** — Releases are tagged in the VCS (e.g., `git tag v2.2.0`).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/releases

### Release Notes

- [x] 🔴 **release_notes** — Each release includes human-readable release notes summarizing major changes.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/releases

- [x] 🔴 **release_notes_vulns** — Release notes identify every publicly known vulnerability fixed in that release.
  - *Note:* `[~]` N/A — No publicly known vulnerabilities.

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/issues

- [x] 🟡 **report_tracker** — An issue tracker is used to track individual bugs.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/issues

- [x] 🔴 **report_responses** — Bug reports submitted are acknowledged promptly.
  - *Self-certification note:* Maintained actively by AOSSIE core team.

- [x] 🟡 **enhancement_responses** — Enhancement requests receive a response.
  - *Self-certification note:* Responded to on GitHub and Discord.

- [x] 🔴 **report_archive** — Reports and responses are publicly archived and searchable.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/issues?q=is%3Aissue+is%3Aclosed

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — Working build system exists (`npm run build`).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/.github/workflows/ci.yml

- [x] 🔵 **build_common_tools** — Common build tools are used (Rollup, Vite, Tailwind v4).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/package.json

- [x] 🟡 **build_floss_tools** — Built using only FLOSS tools.
  - *Note:* Node.js, Rollup, Vite FLOSS stack.

### Automated Testing

- [x] 🔵 **test_invocation** — Test suite invoked via standard command (`npm run test`).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/package.json

- [x] 🔵 **test_most** — Test suite covers key component interfaces and hooks (`src/__tests__`).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SupportUsButton/blob/main/src/__tests__/SupportUsButton.test.ts

- [x] 🔴 **warnings** — Compiler and type-checker strict flags enabled (`npx tsc --noEmit`).
- [x] 🔴 **warnings_fixed** — Zero linter/compiler warnings on build (`0 errors, 0 warnings`).

---

## 🔐 Security & Analysis

- [x] 🔴 **know_secure_design** — OWASP React security best practices followed (automatic XSS escaping, safe URL validation via `validateUrl`).
- [x] 🔴 **static_analysis_fixed** — CodeRabbit AI and TypeScript static analysis active on all commits.
- [x] 🔴 **audit_report** — Comprehensive end-to-end evaluation, testing, performance, and security audit report completed.
  - *Evidence URL:* [`audit/AuditReport.md`](audit/AuditReport.md)
