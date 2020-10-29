const Container = require('../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../formBuilder/formBuilder').Field;

const PlotlyLayoutConfig = Container.spliter({
	Title: Field.text({
		att: 'title.text',
		label: 'Título',
	}),
	TitleFontSize: Field.select({
		label: 'Tamanho',
		att: 'title.font.size',
		options: [
			{
				text: 16,
			},
			{
				text: 20,
			},
			{
				text: 24,
			},
			{
				text: 28,
			},
			{
				text: 32,
			},
			{
				text: 36,
			},
		],
	}),
	Legend: Field.checkBox({
		label: 'Mostrar Legenda',
		att: 'showlegend',
	}),
},
{
	startOpen: false,
	text: 'Layout',
	att: 'layout',
	id: 'PlotlyLayout',
},
);

module.exports = PlotlyLayoutConfig;