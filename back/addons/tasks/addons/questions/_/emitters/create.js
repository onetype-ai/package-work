onetype.EmitRegister('work.tasks.question', {
    description: 'A question was asked on a task.',
    metadata: { addon: 'work.tasks.questions' },
    config: {
        task: {
            type: 'string',
            description: 'Id of the task the question is about.'
        },
        question: {
            type: 'object',
            config: 'work.question',
            description: 'The open question.'
        }
    }
});
