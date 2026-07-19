# Work

**The work layer of the instance.** Tasks that humans and agents create, pick up and complete — one board, every worker.

Work is where everything that needs doing lives. A human writes a task and an agent picks it up; an agent plans a task and a human approves it. Both kinds of workers go through the same doors — the same commands, the same statuses, the same board — so the kanban view always shows the whole truth of the instance, no matter who is doing the work.

## What lives here

- **Tasks** — the unit of work: title, description, status, assignee (a user or an agent), and the trail of what happened.
- **The board** — the kanban view over tasks: columns by status, drag between them, one glance tells you where everything stands.
- **The doors** — every mutation is a command (`work:tasks:create`, `work:tasks:...`), so the UI, HTTP, schedules and agents all create and move tasks the same way.

## Status

Early. The structure is being laid down; entities, commands and the board are built step by step.
