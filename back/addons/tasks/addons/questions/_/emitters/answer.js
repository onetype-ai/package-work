onetype.EmitRegister('work.tasks.answer', {
    description: 'A question on a task was answered.',
    metadata: { addon: 'work.tasks.questions' },
    config: {
        task: {
            type: 'string',
            description: 'Id of the task the question belongs to.'
        },
        question: {
            type: 'object',
            config: 'work.question',
            description: 'The question, answer included.'
        }
    }
});
