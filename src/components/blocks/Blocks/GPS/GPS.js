const Block = require('../block');
const leaflet = require('leaflet');

module.exports = class GPS extends Block {

	constructor(preConfig, htmlComponent) {

		super(preConfig, htmlComponent);
		this._formConfig = preConfig;
		this.features = this._formConfig.GPS.features;
		this.style = this._formConfig.GPS.style;
		this.longitude = this._formConfig.GPS.longitude;
		this.latitude = this._formConfig.GPS.latitude;
		this.radius = this._formConfig.GPS.radius;

		this.map = leaflet.map(this.htmlComponent, {
			attributionControl: false
		}).setView([-22, -47.890833], 12);

		this.layer = leaflet.geoJSON([], {
			pointToLayer: (feature, latlng) =>  {
				return leaflet.circleMarker(latlng, this.markerStyle).setRadius(this.radius);
			}
		}).addTo(this.map);

	}

	get formConfig() {

		return this._formConfig;

	}

	get markerStyle() {

		return {
		    fillColor: this.style,
		    color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8
		};

	}

	willRead() {

		this.features = this.features.slice(0, 1);
		this.features[0].coordinates = [];

		this.layer.clearLayers();

	}

	updateConfig(newConfig) {

		this.longitude = newConfig.longitude;
		this.latitude = newConfig.latitude;
		this.style = newConfig.style;
		this.radius = newConfig.radius;

	}

	updateData(newData) {

		const longitude = newData[this.longitude];
		const latitude = newData[this.latitude];

		if (longitude === NaN || latitude === NaN)
			return;

		const point = {
			type: "Point",
			coordinates: [longitude, latitude],
		};

		const styleConfig = {
			color: this.style,
			fillColor: this.style,
			weight: 3,
			opacity: 0.65,
		};

		this.features.push(point);
		this.layer.addData(point);

		this.features[0].coordinates.push([longitude, latitude]);
		this.layer.addData(this.features[0]);

		this.layer.setStyle(styleConfig);
		this.map.fitBounds(this.layer.getBounds());

	}

	setAutoResize() {

		const widget = this.htmlComponent.parentElement;

		addResizeListener(widget, () => {

			this.map.invalidateSize();

		});

	}

	init() {

		let mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

    	leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       		attribution: '&copy; ' + mapLink + ' Contributors',
        	maxZoom: 18,
        }).addTo(this.map);

		this.map.invalidateSize();
		this.setAutoResize();

	}

	destroy() {

		this.map.remove();

	}

	save() {

		return {
			features: this.features,
			longitude: this.longitude,
			latitude: this.latitude,
			style: this.style,
			radius: this.radius,
		};

	}

	load(preSavedConfig) {

		init();

		this.features = preSavedConfig.features;
		this.longitude = preSavedConfig.longitude;
		this.latitude = preSavedConfig.latitude;
		this.style = preSavedConfig.style;
		this.radius = preSavedConfig.radius;

		this.layer.addData(this.features, {
			color: this.style,
			fillColor: this.style,
			weight: 3,
			opacity: 0.65,
		});

		this.setAutoResize();

	}


};
