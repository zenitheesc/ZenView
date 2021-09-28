const Container = require('../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../formBuilder/formBuilder').Field;
const uPlotScatter = require('./types/scatter');

module.exports = class uPlotEditMenu {

	constructor() {

		this.uPlotScatter = new uPlotScatter();

		this.form = Container.div({
			plotTypes: Container.spliter(
				{
					plotType: Field.select({
						label: 'Selecione um tipo: ',
						att: 'type',
						id: 'uPlotTypeSelector',
						options: [
							{
								text: 'scatter',
							},
							{
								text: 'bar',
							},
							{
								text: 'heatmap',
							},
							{
								text: 'time serie',
							},
							{
								text: 'sparkline',
							},
						],
					}),
				},
				{
					startOpen: true,
					text: 'Tipos de plot',
					id: 'uPlotType',
				},
			),
			scatterConfig: this.uPlotScatter.form,
		},
			{
				id: 'uPlotEditMenuConfig',
				att: 'uPlot',
				conditions: [
					{
						id: 'BlockModule',
						att: 'value',
						requiredValue: 'uPlot',
					},
				],
			},
		);

	}

};
