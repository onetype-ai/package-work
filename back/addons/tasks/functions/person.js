import users from '@onetype/platform/users';
import work from '#work/addon.js';

/*
    Turns stored { user_id, agent } columns into a work.person object —
    display name resolved at read time so renames always show fresh.
    Returns null when neither side is set.
*/

work.tasks.Fn('person', async function(user_id, agent)
{
    if(agent)
    {
        const item = $ot.agents && $ot.agents.items ? $ot.agents.items().find((entry) => entry.Get('id') === agent) : null;

        return { type: 'agent', id: agent, name: item ? item.Get('name') : agent };
    }

    if(user_id)
    {
        const user = await users.Find().filter('id', user_id).one();

        return { type: 'user', id: String(user_id), name: user ? user.Get('name') || user.Get('email') : 'User ' + user_id };
    }

    return null;
});
