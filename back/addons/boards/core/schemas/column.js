import onetype from '@onetype/framework';

onetype.DataSchema('work.column', {
	value: {
		type: 'string',
		required: true,
		description: 'Status value the column collects.'
	},
	label: {
		type: 'string',
		description: 'Column header label. Falls back to the value.'
	},
	color: {
		type: 'string',
		value: 'brand',
		options: ['brand', 'blue', 'red', 'orange', 'green'],
		description: 'Column accent color.'
	},
	create: {
		type: 'boolean',
		value: true,
		description: 'Whether new tasks may be created directly into this column.'
	},
	isFinal: {
		type: 'boolean',
		value: false,
		description: 'Marks the column completed work lands in. One per board.'
	}
});
