onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'work-task',
		icon: 'assignment',
		name: 'Task',
		description: 'The full face of one task: header with status and actions, lock and working state with tracked time, open questions waiting for answers, description and comments in tabs.',
		category: 'Work',
		collection: 'Work',
		author: 'OneType',
		config: {
			task: {
				type: 'object',
				config: 'work.task',
				value: {
					id: 3,
					board: 'general',
					title: 'Kanban drag and drop',
					description: '## Goal\n\nCards move between columns with a **real drag** — grab, lift, drop. The drop persists the new status through the `work:tasks:move` command, nothing else touches the record.\n\n## Acceptance\n\n- Dragging lifts the card with a soft shadow, the source column keeps a ghost slot\n- Dropping onto a column fires `move` and the card lands **without a flicker**\n- Keyboard fallback: focus a card, `←` and `→` move it one column\n\n> Reordering *within* a column stays out of scope.',
					status: 'Working',
					author: { type: 'user', id: '1', name: 'Dejan Tomić' },
					assignee: { type: 'agent', id: 'orah', name: 'Orah' },
					locked_at: 'Jul 19, 14:02',
					working_since: '',
					worked: 8460,
					schedule_start: '',
					schedule_repeat: 'none',
					questions: [
						{ id: 1, author: { type: 'agent', id: 'orah', name: 'Orah' }, text: 'Should a card dropped into Done also release the lock, or does release stay an explicit action?', answer: '', created_at: 'Jul 19, 15:12' }
					],
					comments: [
						{ id: 1, author: { type: 'user', id: '1', name: 'Dejan Tomić' }, text: 'Let us keep the drop animation subtle, nothing bouncy.', created_at: 'Jul 18, 11:20' },
						{ id: 2, author: { type: 'agent', id: 'orah', name: 'Orah' }, text: 'Agreed. I will reuse the board view transition tokens for it.', created_at: 'Jul 18, 11:24' }
					],
					created_at: 'Jul 15'
				},
				description: 'The task to show, shaped by the work.task schema.'
			},
			background: {
				type: 'number',
				value: 1,
				options: [0, 1, 2, 3],
				description: 'Background depth the panel sits on from 0 to 3. Everything nested sits one step above.'
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

			this.above = () => Math.min(this.background + 1, 3);

			this.me = () => ({
				type: 'user',
				id: this.state.user && this.state.user.id ? String(this.state.user.id) : '',
				name: this.state.user && this.state.user.name ? this.state.user.name : 'You'
			});

			this.holder = () => this.task.assignee ? this.task.assignee.name : 'Somebody';

			this.initials = (name) => name.split(' ').map((word) => word.charAt(0)).slice(0, 2).join('');

			this.format = (seconds) =>
			{
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);

				return hours ? hours + 'h ' + minutes + 'm' : minutes + 'm';
			};

			this.elapsed = () =>
			{
				const since = this.task.working_since ? new Date(this.task.working_since).getTime() : Date.now();

				return this.format(this.task.worked + Math.floor((Date.now() - since) / 1000));
			};

			this.asked = () =>
			{
				const open = this.task.questions.filter((question) => !question.answer);

				return open.length ? open[0] : null;
			};

			this.details = () => [
				{ label: 'Status', value: this.task.status, type: 'status', color: this.color() },
				{ label: 'Author', value: this.task.author ? this.task.author.name : null, type: 'person' },
				{ label: 'Assignee', value: this.task.assignee ? this.task.assignee.name : null, type: 'person', color: this.task.assignee && this.task.assignee.type === 'agent' ? 'green' : 'brand' },
				{ label: 'Board', value: this.task.board, type: 'chips' },
				{ label: 'Created', value: this.task.created_at, type: 'date' },
				{ label: 'Time worked', value: this.task.worked ? this.elapsed() : (this.task.working_since ? this.elapsed() : null), type: 'mono', icon: 'timer' }
			];

			this.tabs = () => [
				{ id: 'overview', label: 'Overview', icon: 'subject' },
				{ id: 'assignee', label: 'Assignee', icon: 'person_pin_circle' },
				{ id: 'schedule', label: 'Schedule', icon: 'schedule' },
				{ id: 'comments', label: 'Comments', icon: 'forum', count: this.task.comments.length }
			];

			this.people = [
				{ type: 'user', id: '1', name: 'Dejan Tomić' },
				{ type: 'user', id: '2', name: 'Ana Ilić' },
				{ type: 'user', id: '3', name: 'Stefan Pakić' },
				{ type: 'user', id: '4', name: 'Mila Kovač' }
			];

			this.agents = [
				{ type: 'agent', id: 'orah', name: 'Orah', description: 'The mind of the instance.' },
				{ type: 'agent', id: 'forge', name: 'Forge', description: 'Builds and ships the workbench tasks.' }
			];

			this.assigned = (person) => this.task.assignee ? this.task.assignee.type === person.type && this.task.assignee.id === person.id : false;

			this.assign = (person) =>
			{
				this.change({
					...this.task,
					assignee: this.assigned(person) ? null : { type: person.type, id: person.id, name: person.name }
				});
			};

			this.peopleRows = () => this.people.map((person) => ({
				icon: 'person',
				label: person.name,
				value: this.assigned(person) ? 'Assigned' : '',
				color: 'brand',
				onClick: () => this.assign(person)
			}));

			this.agentRows = () => this.agents.map((agent) => ({
				icon: 'smart_toy',
				label: agent.name,
				sublabel: agent.description,
				value: this.assigned(agent) ? 'Assigned' : '',
				color: 'green',
				onClick: () => this.assign(agent)
			}));

			this.repeatOptions = [
				{ value: 'none', label: 'Once', icon: 'looks_one' },
				{ value: 'hourly', label: 'Hourly', icon: 'schedule' },
				{ value: 'daily', label: 'Daily', icon: 'today' },
				{ value: 'weekly', label: 'Weekly', icon: 'date_range' }
			];

			this.repeat = () => ({ value }) =>
			{
				this.change({ ...this.task, schedule_repeat: value });
			};

			this.start = () => ({ value }) =>
			{
				this.change({ ...this.task, schedule_start: value });
			};

			this.plan = () =>
			{
				const start = this.task.schedule_start ? new Date(this.task.schedule_start).toLocaleDateString() : '';
				const repeat = this.task.schedule_repeat;

				if(!start && repeat === 'none')
				{
					return 'Starts when someone takes it, runs once.';
				}

				const opening = start ? 'Starts ' + start : 'Starts when someone takes it';

				return repeat === 'none' ? opening + ', runs once.' : opening + ', repeats ' + repeat + '.';
			};

			this.pick = () => ({ value }) =>
			{
				this.tab = value;
			};

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
					assignee: this.me(),
					locked_at: now.toISOString(),
					working_since: now.toISOString()
				});
			};

			this.release = () =>
			{
				const since = this.task.working_since ? new Date(this.task.working_since).getTime() : Date.now();

				this.change({
					...this.task,
					worked: this.task.worked + Math.floor((Date.now() - since) / 1000),
					locked_at: null,
					working_since: null,
					status: 'Review'
				});
			};

			this.answer = ({ event }) =>
			{
				const form = onetype.FormGet(event.target);
				const question = this.asked();

				if(!form.answer || !question)
				{
					return;
				}

				const now = new Date().toLocaleString();

				this.change({
					...this.task,
					questions: this.task.questions.map((entry) => entry.id === question.id ? { ...entry, answer: form.answer, answered_by: this.me(), answered_at: now } : entry),
					comments: [...this.task.comments, { id: 'now-' + this.task.comments.length, author: this.me(), text: form.answer, created_at: now }]
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
					comments: [...this.task.comments, { id: 'now-' + this.task.comments.length, author: this.me(), text: form.comment, created_at: new Date().toLocaleString() }]
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
				<div :class="'box bg-' + background">
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
							<span class="created">Created {{ task.created_at }}</span>
						</div>
					</div>

					<div ot-if="task.working_since" class="banner working">
						<i>bolt</i>
						<span class="text"><b>{{ holder() }}</b> is working on this right now</span>
						<span class="time">{{ elapsed() }}</span>
					</div>
					<div ot-if="task.locked_at && !task.working_since" class="banner locked">
						<i>lock</i>
						<span class="text">Locked by <b>{{ holder() }}</b> since {{ task.locked_at }}</span>
					</div>

					<div class="actions">
						<e-form-button ot-if="!task.working_since" text="Take this task" icon="front_hand" color="brand" :_click="() => take()"></e-form-button>
						<e-form-button ot-if="task.working_since" text="Release" icon="outbound" color="green" tone="soft" :_click="() => release()"></e-form-button>
						<span ot-if="task.worked || task.working_since" class="worked" :ot-tooltip="'Time worked in total'"><i>timer</i>{{ elapsed() }}</span>
					</div>

					<div class="tabs">
						<e-navigation-tabs :items="tabs()" :active="tab" tone="segmented" :background="above()" :_change="pick()"></e-navigation-tabs>
					</div>

					<div ot-if="tab === 'overview'" class="body overview">
						<div class="scroll">
							<div ot-if="asked()" class="question">
								<div class="ask">
									<i>contact_support</i>
									<div class="words">
										<span class="who">{{ asked().author ? asked().author.name : 'Somebody' }} asks · {{ asked().created_at }}</span>
										<span class="what">{{ asked().text }}</span>
									</div>
								</div>
								<form class="reply" ot-submit.prevent="(payload) => answer(payload)">
									<textarea name="answer" rows="2" placeholder="Answer the question and unblock the work..."></textarea>
									<e-form-button text="Answer" icon="send" color="orange" type="submit"></e-form-button>
								</form>
							</div>

							<e-global-markdown :content="task.description" :background="0"></e-global-markdown>
						</div>

						<e-data-details :items="details()" :background="above()"></e-data-details>
					</div>

					<div ot-if="tab === 'assignee'" class="body">
						<span class="group">People</span>
						<e-data-list :rows="peopleRows()" :search="true" placeholder="Find a person..." :background="above()"></e-data-list>
						<span class="group">Agents</span>
						<e-data-list :rows="agentRows()" :search="true" placeholder="Find an agent..." :background="above()"></e-data-list>
					</div>

					<div ot-if="tab === 'schedule'" class="body">
						<span class="group">Starts</span>
						<e-form-date :value="task.schedule_start" :background="above()" :_change="start()"></e-form-date>
						<span class="group">Repeats</span>
						<e-form-options :value="task.schedule_repeat" :options="repeatOptions" :background="above()" :_change="repeat()"></e-form-options>
						<e-global-notice title="Schedule" :text="plan()" icon="event_upcoming" color="blue" :background="above()"></e-global-notice>
					</div>

					<div ot-if="tab === 'comments'" class="body">
						<div ot-if="!task.comments.length" class="quiet">No comments yet. Say the first word.</div>
						<div ot-for="entry in task.comments" class="comment">
							<span class="avatar">{{ initials(entry.author ? entry.author.name : '?') }}</span>
							<div class="bubble">
								<span class="row"><b>{{ entry.author ? entry.author.name : 'Unknown' }}</b><span class="when">{{ entry.created_at }}</span></span>
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
