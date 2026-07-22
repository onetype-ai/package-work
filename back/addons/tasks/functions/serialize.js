import work from '#work/addon.js';

/*
    Turns a task row into the work.task shape commands resolve with.
    Pass { detail: true } to include the full comment and question
    trails; without it they stay empty and only the counts ride along.
*/

work.tasks.Fn('serialize', async function(row, options = {})
{
    const task = {
        id: String(row.Get('id')),
        board: row.Get('board'),
        title: row.Get('title'),
        description: row.Get('description'),
        status: row.Get('status'),
        author: await this.Fn('person', row.Get('author_user_id'), row.Get('author_agent')),
        assignee: await this.Fn('person', row.Get('assignee_user_id'), row.Get('assignee_agent')),
        locked_at: row.Get('locked_at'),
        working_since: row.Get('working_since'),
        worked: row.Get('worked') || 0,
        priority: row.Get('priority'),
        schedule_start: row.Get('schedule_start'),
        schedule_end: row.Get('schedule_end'),
        questions: [],
        comments: [],
        created_at: row.Get('created_at')
    };

    if(!options.detail)
    {
        return task;
    }

    const comments = await this.comments.Find()
        .filter('task_id', row.Get('id'))
        .filter('deleted_at', null, 'NULL')
        .sort('id', 'asc')
        .many();

    for(const comment of comments)
    {
        task.comments.push({
            id: String(comment.Get('id')),
            author: await this.Fn('person', comment.Get('user_id'), comment.Get('agent')),
            text: comment.Get('text'),
            created_at: comment.Get('created_at')
        });
    }

    const questions = await this.questions.Find()
        .filter('task_id', row.Get('id'))
        .filter('deleted_at', null, 'NULL')
        .sort('id', 'asc')
        .many();

    for(const question of questions)
    {
        task.questions.push({
            id: String(question.Get('id')),
            author: await this.Fn('person', question.Get('user_id'), question.Get('agent')),
            text: question.Get('text'),
            answer: question.Get('answer'),
            answered_by: await this.Fn('person', question.Get('answered_user_id'), question.Get('answered_agent')),
            answered_at: question.Get('answered_at'),
            created_at: question.Get('created_at')
        });
    }

    return task;
});
