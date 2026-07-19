onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'work-task',
		icon: 'assignment',
		name: 'Task',
		description: 'The full face of one task: header with status and actions, lock and working state with tracked time, the question waiting for an answer, description and comments in tabs.',
		category: 'Work',
		collection: 'Work',
		author: 'OneType',
		config: {
			task: {
				type: 'object',
				value: {
					id: 3,
					board: 'general',
					title: 'Kanban drag and drop',
					description: 'Cards should move between columns with a real drag, drop onto a column persists the new status through the move command. Keyboard fallback comes with it: focus a card, move it with the arrows.',
					status: 'Working',
					author: { name: 'Dejan Tomić' },
					assignee: { name: 'Orah', type: 'agent' },
					created: 'Jul 15',
					worked: 8460,
					locked: { by: 'Orah', at: 'Jul 19, 14:02' },
					working: { by: 'Orah', since: '' },
					question: { by: 'Orah', text: 'Should a card dropped into Done also release the lock of the one working on it, or does release stay an explicit action?', at: 'Jul 19, 15:12', answer: '' },
					comments: [
						{ by: 'Dejan Tomić', at: 'Jul 18, 11:20', text: 'Let us keep the drop animation subtle, nothing bouncy.' },
						{ by: 'Orah', at: 'Jul 18, 11:24', text: 'Agreed. I will reuse the board view transition tokens for it.' }
					]
				},
				description: 'The task to show: id, board, title, description, status, author, assignee, created, worked seconds, locked, working, question and comments.'
			},
			_close: {
				type: 'function',
				description: 'Called without payload when the panel asks to close.'
			},
			_change: {
				type: 'function',
				description: 'Called with { value } holding the task after any change made inside the panel.'
			}
		},
		render: function()
		{
			this.tab = 'overview';

			this.colors = { 'Backlog': 'brand', 'Planned': 'blue', 'Working': 'orange', 'Review': 'red', 'Done': 'green' };

			this.color = () => this.colors[this.task.status] ? this.colors[this.task.status] : 'brand';

			this.me = () => this.state.user && this.state.user.name ? this.state.user.name : 'You';

			this.initials = (name) => name.split(' ').map((word) => word.charAt(0)).slice(0, 2).join('');

			this.format = (seconds) =>
			{
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);

				return hours ? hours + 'h ' + minutes + 'm' : minutes + 'm';
			};

			this.elapsed = () =>
			{
				const since = this.task.working && this.task.working.since ? new Date(this.task.working.since).getTime() : Date.now();

				return this.format(this.task.worked + Math.floor((Date.now() - since) / 1000));
			};

			this.tabs = () => [
				{ id: 'overview', label: 'Overview', icon: 'subject' },
				{ id: 'comments', label: 'Comments', icon: 'forum', count: this.task.comments.length }
			];

			this.change = (task) =>
			{
				this.task = task;

				if(this._change)
				{
					this._change({ value: task });
				}
			};

			this.take = () =>
			{
				const now = new Date();

				this.change({
					...this.task,
					status: 'Working',
					locked: { by: this.me(), at: now.toLocaleString() },
					working: { by: this.me(), since: now.toISOString() }
				});
			};

			this.release = () =>
			{
				const since = this.task.working && this.task.working.since ? new Date(this.task.working.since).getTime() : Date.now();

				this.change({
					...this.task,
					worked: this.task.worked + Math.floor((Date.now() - since) / 1000),
					locked: null,
					working: null,
					status: 'Review'
				});
			};

			this.answer = ({ event }) =>
			{
				const form = onetype.FormGet(event.target);

				if(!form.answer)
				{
					return;
				}

				this.change({
					...this.task,
					question: { ...this.task.question, answer: form.answer },
					comments: [...this.task.comments, { by: this.me(), at: new Date().toLocaleString(), text: form.answer }]
				});
			};

			this.comment = ({ event }) =>
			{
				const form = onetype.FormGet(event.target);

				if(!form.comment)
				{
					return;
				}

				event.target.reset();

				this.change({
					...this.task,
					comments: [...this.task.comments, { by: this.me(), at: new Date().toLocaleString(), text: form.comment }]
				});
			};

			this.dismiss = () =>
			{
				if(this._close)
				{
					this._close();
				}
			};

			return /* html */ `
				<div class="box">
					<div class="head">
						<div class="path">
							<span class="board"><i>view_kanban</i>{{ task.board }}</span>
							<span class="number">#{{ task.id }}</span>
							<button class="close" ot-click="() => dismiss()"><i>close</i></button>
						</div>
						<span class="title">{{ task.title }}</span>
						<div class="meta">
							<span :class="'status ' + color()"><span class="dot"></span>{{ task.status }}</span>
							<span ot-if="task.assignee" class="person" :ot-tooltip="'Assignee'"><span class="avatar">{{ initials(task.assignee.name) }}</span>{{ task.assignee.name }}</span>
							<span class="created">Created {{ task.created }}</span>
						</div>
					</div>

					<div ot-if="task.working" class="banner working">
						<i>bolt</i>
						<span class="text"><b>{{ task.working.by }}</b> is working on this right now</span>
						<span class="time">{{ elapsed() }}</span>
					</div>
					<div ot-if="task.locked && !task.working" class="banner locked">
						<i>lock</i>
						<span class="text">Locked by <b>{{ task.locked.by }}</b> since {{ task.locked.at }}</span>
					</div>

					<div class="actions">
						<e-form-button ot-if="!task.working" text="Take this task" icon="front_hand" color="brand" :_click="() => take()"></e-form-button>
						<e-form-button ot-if="task.working" text="Release" icon="outbound" color="green" tone="soft" :_click="() => release()"></e-form-button>
						<span ot-if="task.worked || task.working" class="worked" :ot-tooltip="'Time worked in total'"><i>timer</i>{{ elapsed() }}</span>
					</div>

					<div class="tabs">
						<e-navigation-tabs :items="tabs()" :active="tab" :_change="({ value }) => tab = value"></e-navigation-tabs>
					</div>

					<div ot-if="tab === 'overview'" class="body">
						<div ot-if="task.question && !task.question.answer" class="question">
							<div class="ask">
								<i>contact_support</i>
								<div class="words">
									<span class="who">{{ task.question.by }} asks · {{ task.question.at }}</span>
									<span class="what">{{ task.question.text }}</span>
								</div>
							</div>
							<form class="reply" ot-submit.prevent="(payload) => answer(payload)">
								<textarea name="answer" rows="2" placeholder="Answer the question and unblock the work..."></textarea>
								<e-form-button text="Answer" icon="send" color="orange" type="submit"></e-form-button>
							</form>
						</div>

						<div class="section">
							<span class="label">Description</span>
							<p class="description">{{ task.description }}</p>
						</div>

						<div class="section">
							<span class="label">Details</span>
							<div class="details">
								<span class="key">Author</span><span class="value">{{ task.author ? task.author.name : '—' }}</span>
								<span class="key">Assignee</span><span class="value">{{ task.assignee ? task.assignee.name : '—' }}</span>
								<span class="key">Board</span><span class="value">{{ task.board }}</span>
								<span class="key">Created</span><span class="value">{{ task.created }}</span>
								<span class="key">Time worked</span><span class="value">{{ task.worked ? elapsed() : (task.working ? elapsed() : '—') }}</span>
							</div>
						</div>
					</div>

					<div ot-if="tab === 'comments'" class="body">
						<div ot-if="!task.comments.length" class="quiet">No comments yet. Say the first word.</div>
						<div ot-for="entry in task.comments" class="comment">
							<span class="avatar">{{ initials(entry.by) }}</span>
							<div class="bubble">
								<span class="row"><b>{{ entry.by }}</b><span class="when">{{ entry.at }}</span></span>
								<span class="text">{{ entry.text }}</span>
							</div>
						</div>
						<form class="composer" ot-submit.prevent="(payload) => comment(payload)">
							<textarea name="comment" rows="2" placeholder="Write a comment..."></textarea>
							<e-form-button text="Comment" icon="send" color="brand" type="submit"></e-form-button>
						</form>
					</div>
				</div>
			`;
		}
	});
});
