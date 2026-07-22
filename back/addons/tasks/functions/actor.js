import work from '#work/addon.js';

/*
    Who is performing the current command. An agent in the delegation
    chain wins over the signed in user — the human asked, but the agent
    is the one acting. Returns { user_id, agent }, one of them set.
*/

work.tasks.Fn('actor', function(context)
{
    const chain = context && context._agents ? context._agents : [];

    if(chain.length)
    {
        return { user_id: null, agent: chain[chain.length - 1] };
    }

    return { user_id: context && context.http && context.http.state.user ? context.http.state.user.id : null, agent: null };
});
