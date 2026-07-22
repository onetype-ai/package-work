onetype.EmitRegister('work.tasks.comment', {
    description: 'A comment was added to a task.',
    metadata: { addon: 'work.tasks.comments' },
    config: {
        task: {
            type: 'string',
            description: 'Id of the task the comment landed on.'
        },
        comment: {
            type: 'object',
            config: 'work.comment',
            description: 'The comment.'
        }
    }
});
