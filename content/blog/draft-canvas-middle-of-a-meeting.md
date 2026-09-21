---
title: "Why I built Draft Canvas for the middle of a meeting"
description: "[EDITOR: one-line standfirst, shown under the title and in the Writing index]"
date: 2026-09-22
tags: [draft-canvas, open-source, architecture]
draft: true
---

<!--
UNPUBLISHED DRAFT. `draft: true` keeps it out of the site, the Writing
index and the sitemap (scripts/build-content.mjs skips drafts).

Everything in the prose below is either something you supplied or something
the Draft Canvas docs say (README, docs/reference/semantics.md,
docs/reference/privacy.md, docs/guides/saving-and-sharing.md). Anything that
needs your own account is marked [EDITOR: ...]. Remove every marker, fix the
date, then set `draft: false` to publish.
-->

The problem was a specific moment: being in a meeting, needing to explain how a
piece of software fits together, and needing to show it rather than describe
it.

[EDITOR: optional, one or two sentences of your own on what that moment is
usually like for you. Keep it general if you'd rather not describe a real
meeting.]

Most diagramming tools can draw the picture. The trouble is what happens on
the way there. You start drawing, and soon you're adjusting connectors, moving
boxes around and working out how to represent the thing you were trying to
talk about. The time goes into arranging shapes, and the explanation stalls
while you do it.

So the goal for Draft Canvas was narrow: help developers draw and explain
software quickly, in the moment, without the diagram becoming the task.

## What that did to the scope

If the constraint is "while someone is waiting", the tool has to know what
software diagrams are made of. Draft Canvas has shapes that carry meaning:
Service, Data Store, Queue/Topic, Actor and Boundary. Because a shape knows
what it is, a connector between two of them can label itself (*publishes to*,
*reads from*) instead of waiting for you to type a caption, and the app can
suggest a sensible next shape.

The same constraint shaped the input. Drawing is keyboard-first: press a
letter to drop a shape, `Tab` to accept a suggestion, `Cmd+K` for everything
else. And for the common case of "it's roughly a known architecture", there
are starters you can compose from the command palette: Monolith,
Microservices, Event-Driven, Hexagonal, CQRS, Saga, Outbox, Medallion and
others.

[EDITOR: why keyboard-first and starters, in your words. What made these the
first things to build, rather than, say, better free-form drawing?]

## Suggestions that assist, not police

Suggestions are where a tool like this can go wrong. A tool that knows what a
Service and a Queue are is one step away from telling you your architecture is
wrong, and that's not its job in a meeting.

The rule the suggestions are held to, from the project's own semantics notes:
the relationship has to be technically real, the caption has to agree with the
arrow, and **a legitimate design that ignores the suggestion is still
drawable**. Suggestions narrow the common path; they never close off an
uncommon one.

That leads to the tradeoff I'd point to first. Some pairings get no specific
suggestion at all, on purpose. Database to Queue, Queue to Queue, Actor to
Database: change data capture, bridges and odd shapes are all real, and
guessing a caption for them would be wrong often enough to hurt. The notes put
it as "no opinion beats a wrong one". The cost is that those connections get a
less helpful default, and you label them yourself. The benefit is that the
tool never confidently mislabels something you drew correctly.

Where it does pick a default, it picks the least committal one. Service to
Service is "calls" and assumes nothing about sync, async or retries; those are
one pick away rather than guessed.

[EDITOR: optional. Is there a suggestion you went back and forth on, or
removed? Only include it if it really happened.]

## Local-first, and what that costs

Draft Canvas keeps diagrams in the browser. They're saved in IndexedDB,
encrypted at rest, with no backend and no account, and the app works offline
once it's loaded. The promise that nothing you draw leaves your machine is
enforced, not just stated: a build-time test fails if any network call appears
in the app's code.

That direction has a real limitation, and the docs are plain about it.
Diagrams live in one browser profile on one device. Clear the site's data and
they're gone, along with the key that decrypts them, and there's no server
copy to recover from. Moving a diagram to another browser or machine means
exporting it and importing it there, and export is one diagram at a time;
there's no "back up everything" button yet.

[EDITOR: the unresolved question, in your words. Is backup or moving between
devices something you want to solve, and how does that sit with keeping it
local-first? Describe your current thinking without promising a feature.]

## Where it is now

[EDITOR: a short close. What you'd like readers to try, or what you're
working on next. Link to the live app at https://acltabontabon.com/draft-canvas/
and the repo at https://github.com/acltabontabon/draft-canvas if you want.]
