const Container = require('../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../formBuilder/formBuilder').Field;

const PlotlyLayoutConfig = Container.spliter({
	Title: Field.text({
		label: 'Título',
	}),
	TitleFontSize: Field.select({
		label: 'Tamanho',
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
	}),
},
{
	startOpen: false,
	text: 'Layout',
	id: 'PlotlyLayout',
},
);

module.exports = PlotlyLayoutConfig;