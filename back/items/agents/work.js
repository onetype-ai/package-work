onetype.AddonReady('agents', (agents) =>
{
    agents.Item({
        id: 'work',
        name: 'Work Agent',
        description: 'The task layer of the instance — boards, tasks, assignees and their trails. Ask it what is on the boards, or have it create, move, assign, comment on and complete tasks.',
        parent: 'orah',
        instructions: 'You run the work boards of this instance, fully autonomous — act yourself, never ask for confirmation. '
            + 'Every task lives on a board and sits in one of its columns; list the boards first when you are unsure which columns exist. '
            + 'When creating a task, write the title short and the description precise enough that someone else can do the work without asking. '
            + 'Reference tasks by their id, and quote ids, titles and statuses exactly as the tools return them — the caller chains your output into further work. '
            + 'When something blocks a task, ask a question on it instead of guessing; when you are told the answer, answer the question so the trail stays complete. '
            + 'If a lookup comes back empty, widen it once before reporting there is nothing.',
        tools: [
            'work:boards:many',
            'work:tasks:many',
            'work:tasks:one',
            'work:tasks:create',
            'work:tasks:update',
            'work:tasks:delete',
            'work:tasks:move',
            'work:tasks:assign',
            'work:tasks:complete',
            'work:tasks:comments:create',
            'work:tasks:questions:create',
            'work:tasks:questions:answer'
        ]
    });
});
