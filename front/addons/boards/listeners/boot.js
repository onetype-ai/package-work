onetype.MiddlewareIntercept('boot', async (middleware) =>
{
    await work.boards.Fn('sync');

    await middleware.next();
});
