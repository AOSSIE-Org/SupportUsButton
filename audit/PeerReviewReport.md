# SupportUsButton — Peer Review Report

**Repository:** [AOSSIE-Org/SupportUsButton](https://github.com/AOSSIE-Org/SupportUsButton)  
**Reviewed revision:** `main` (`391ee5f4468f917b93b4613c9b6256bcb1d36059`)  
**Review area:** React support widget and its public-facing demo, link handling, rendering, and package configuration.

## Overall assessment

This repository is primarily a reusable React widget with a demo site, rather than only a landing page. Source review covered the widget’s sponsor and organization links, demo configuration persistence, external-link attributes, and package entry points. No material security or functional finding was substantiated in the inspected code.

## Findings

No substantiated findings.

## Review checklist

| Area | Result |
|---|---|
| Dynamic HTML/script insertion in inspected widget paths | No issue identified; no `dangerouslySetInnerHTML` use surfaced in the inspected source. |
| External sponsor and organization links | Rendered links are constrained to HTTP(S); new-tab anchors include `noopener noreferrer`. |
| Demo configuration persistence | Demo preferences use local storage; no sensitive information is stored by the inspected code. |
| Package entry points and peer dependency declarations | Entry points and React peer dependencies are declared in `package.json`. |
| Responsive layout | I installed the project dependencies and checked the site/demo in a browser across screen sizes; it displayed correctly. |

## Validation

I installed the project dependencies and checked the site/demo in a browser across screen sizes; it was responsive and displayed correctly.

## Conclusion

No substantiated issue is reported from the inspected source. This source-only review does not establish that issues are absent in uninspected code, published artifacts, or runtime environments.
