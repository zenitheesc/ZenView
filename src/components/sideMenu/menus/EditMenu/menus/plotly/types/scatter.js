const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const Components = require('../../../../../../components');

const PlotlyScatterConfig = Container.div({
	PlotlySeries: Container.spliter({
		newSerieName: Field.text({
			append: [
				{
					type: 'button',
					content: Components.icon('plus-square'),
					classList: ['formButtonWithIconPrepend'],
				},
			],
		}),
		xAxis: Field.select({
			prepend: [
				{
					type: 'text',
					text: 'X',
					classList: ['formTextPrepend'],
				},
			],
		}),
		yxis: Field.select({
			prepend: [
				{
					type: 'text',
					text: 'Y',
					classList: ['formTextPrepend'],
				},
			],
		}),
	}, {
		startOpen: false,
		text: 'Series',
		id: 'PlotlySeries',
	}),
	PlotlySeriesStyle: Container.spliter({
		selectedSerie: Field.select({
			label: 'Série',
		}),
		showMarkers: Field.checkBox({
			label: 'Pontos',
			id: 'PlotlyScatterShowMarkers',
		}),
		markersOptions: Container.div({
			markerStyle: Container.formRow({
				markersSize: Field.select(
					{
						label: 'Tamanho',
						classList: ['col-6'],
						options: [
							{
								text: 4,
							},
							{
								text: 6,
							},
							{
								text: 8,
							},
							{
								text: 10,
							},
							{
								text: 12,
							},
							{
								text: 14,
							},
						],
					},
				),
				markersColor: Field.select({
					label: 'Cor',
					classList: ['col-6'],
					options: [
						{
							text: '#1f77b4',
						},
						{
							text: '#ff7f0e',
						},
						{
							text: '#2ca02c',
						},
						{
							text: '#d62728',
						},
						{
							text: '#9467bd',
						},
						{
							text: '#8c564b',
						},
						{
							text: '#e377c2',
						},
						{
							text: '#7f7f7f',
						},
						{
							text: '#bcbd22',
						},
						{
							text: '#17becf',
						},
					],
				}),
			}),
		}, {
			conditions: [
				{
					id: 'PlotlyScatterShowMarkers',
					att: 'checked',
					requiredValue: true,
				},
			],
		}),
		showLines: Field.checkBox({
			label: 'Linhas',
			id: 'PlotlyScatterShowLines',
		}),
		lineOptions: Container.div({
			linStyle: Container.formRow({
				lineWidth: Field.select(
					{
						label: 'Tamanho',
						classList: ['col-6'],
						options: [
							{
								text: 4,
							},
							{
								text: 6,
							},
							{
								text: 8,
							},
							{
								text: 10,
							},
							{
								text: 12,
							},
							{
								text: 14,
							},
						],
					},
				),
				lineColor: Field.select({
					label: 'Cor',
					classList: ['col-6'],
					options: [
						{
							text: '#1f77b4',
						},
						{
							text: '#ff7f0e',
						},
						{
							text: '#2ca02c',
						},
						{
							text: '#d62728',
						},
						{
							text: '#9467bd',
						},
						{
							text: '#8c564b',
						},
						{
							text: '#e377c2',
						},
						{
							text: '#7f7f7f',
						},
						{
							text: '#bcbd22',
						},
						{
							text: '#17becf',
						},
					],
				}),
			}),
			lineOption: Container.formRow({
				lineDasg: Field.select(
					{
						label: 'Tracejado',
						classList: ['col-6'],
						options: [
							{
								text: 'Sólido',
								value: 'solid',
							},
							{
								text: 'Pontilhado',
								value: 'dot',
							},
							{
								text: 'Tracejado',
								value: 'dash',
							},
							{
								text: 'Travessão',
								value: 'longdash',
							},
							{
								text: 'Traço e ponto',
								value: 'dashdot',
							},
						],
					},
				),
				lineShape: Field.select({
					label: 'Interpolação',
					classList: ['col-6'],
					options: [
						{
							text: 'Linear',
							value: 'linear',
						},
						{
							text: 'Suave',
							value: 'spline',
						},
						{
							text: 'Degraus 1',
							value: 'hv',
						},
						{
							text: 'Degraus 2',
							value: 'vh',
						},
						{
							text: 'Degraus 3',
							value: 'hvh',
						},
						{
							text: 'Degraus 4',
							value: 'vhv',
						},
					],
				}),
			}),
		}, {
			conditions: [
				{
					id: 'PlotlyScatterShowLines',
					att: 'checked',
					requiredValue: true,
				},
			],
		}),
	}, {
		startOpen: false,
		text: 'Estilo',
		id: 'PlotlySeriesStyle',
	}),
	plotlyXAxesStyle: Container.spliter({
		xAxesTitle: Field.text({
			label: 'Título',
		}),
		xAxesStyle: Field.select({
			label: 'Tamanho',
			options: [
				{
					text: 10,
				},
				{
					text: 12,
				},
				{
					text: 14,
				},
				{
					text: 16,
				},
				{
					text: 18,
				},
				{
					text: 20,
				},
			],
		}),
		xAxesScale: Field.select({
			label: 'Escala',
			options: [
				{
					text: 'Linear',
					value: 'linear',
				},
				{
					text: 'Logaritimica',
					value: 'log',
				},
			],
		}),
	}, {
		startOpen: false,
		text: 'Eixo X',
		id: 'plotlyXAxeStyle',
	}),
	plotlyYAxesStyle: Container.spliter({
		yAxesTitle: Field.text({
			label: 'Título',
		}),
		yAxesStyle: Field.select({
			label: 'Tamanho',
			options: [
				{
					text: 10,
				},
				{
					text: 12,
				},
				{
					text: 14,
				},
				{
					text: 16,
				},
				{
					text: 18,
				},
				{
					text: 20,
				},
			],
		}),
		yAxesScale: Field.select({
			label: 'Escala',
			options: [
				{
					text: 'Linear',
					value: 'linear',
				},
				{
					text: 'Logaritimica',
					value: 'log',
				},
			],
		}),
	}, {
		startOpen: false,
		text: 'Eixo Y',
		id: 'plotlyYAxeStyle',
	}),
}, {
	id: 'PlotlyScatterConfig',
	conditions: [
		{
			id: 'plotlyTypeSelector',
			att: 'value',
			requiredValue: 'scatter',
		},
	],
},
);

module.exports = PlotlyScatterConfig;