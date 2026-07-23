import commands from 'addon-commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:tasks:questions:answer',
    exposed: true,
    method: 'POST',
    endpoint: '/api/work/questions/:id/answer',
    description: 'Answers an open question on a task, unblocking whoever asked it.',
    metadata: { addon: 'work.tasks.questions' },
    condition: function()
    {
        if(this.http && !this.http.state.user)
        {
            return 'Sign in to answer questions.';
        }
    },
    in: {
        id: {
            type: 'string',
            required: true,
            description: 'Id of the question to answer.'
        },
        answer: {
            type: 'string',
            required: true,
            description: 'The answer.'
        }
    },
    out: 'work.question',
    callback: async function(properties, resolve)
    {
        const row = await work.tasks.questions.Find()
            .filter('id', properties.id)
            .filter('deleted_at', null, 'NULL')
            .one();

        if(!row)
        {
            return resolve(null, 'Question ' + properties.id + ' does not exist.', 404);
        }

        if(row.Get('answer'))
        {
            return resolve(null, 'Question ' + properties.id + ' is already answered.', 400);
        }

        const actor = work.tasks.Fn('actor', this);

        row.Set('answer', properties.answer);
        row.Set('answered_user_id', actor.user_id);
        row.Set('answered_agent', actor.agent);
        row.Set('answered_at', new Date().toISOString());
        row.Set('updated_at', new Date().toISOString());

        await row.Update();

        const question = {
            id: String(row.Get('id')),
            author: await work.tasks.Fn('person', row.Get('user_id'), row.Get('agent')),
            text: row.Get('text'),
            answer: row.Get('answer'),
            answered_by: await work.tasks.Fn('person', actor.user_id, actor.agent),
            answered_at: row.Get('answered_at'),
            created_at: row.Get('created_at')
        };

        onetype.emitters.fire('work.tasks.answer', { task: String(row.Get('task_id')), question });

        resolve(question, 'Question answered.');
    }
});
