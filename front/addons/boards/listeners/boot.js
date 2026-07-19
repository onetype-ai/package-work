onetype.MiddlewareIntercept('boot', async (middleware) =>
{
	await work.boards.Fn('list');

	await middleware.next();
});
