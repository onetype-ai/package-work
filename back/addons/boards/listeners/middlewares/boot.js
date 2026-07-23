import work from '#work/addon.js';

onetype.middlewares.intercept('boot', async (middleware) =>
{
    await work.boards.Fn('sync');

    await middleware.next();
});
