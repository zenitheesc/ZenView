module.exports = class EventHandler {

	constructor() {

		this['SaveConfigs'] = (detail) => {

			this.dispatchEvent('SaveConfigs', detail);

		};

		this['GlobalContextChange'] = (detail) => {

			this.dispatchEvent('GlobalContextChange', detail);

		};

		this['DataIsReady'] = (detail) => {

			this.dispatchEvent('DataIsReady', detail);

		};

		this['OpenDashBoard'] = (detail) => {

			this.dispatchEvent('OpenDashBoard', detail);

		};

		this['DeleteDashboard'] = (detail) => {

			this.dispatchEvent('DeleteDashboard', detail);

		};

		this['BlockWasSelected'] = (detail) => {

			this.dispatchEvent('BlockWasSelected', detail);

		};

		this['AddNewBlock'] = (detail) => {

			this.dispatchEvent('AddNewBlock', detail);

		};

		this['ClearDashboard'] = (detail) => {

			this.dispatchEvent('ClearDashboard', detail);

		};

		this['SaveCurrentDashBoard'] = (detail) => {

			this.dispatchEvent('SaveCurrentDashBoard', detail);

		};

		this['NewDashBoard'] = (detail) => {

			this.dispatchEvent('NewDashBoard', detail);

		};

		this['DataIsProcessed'] = (detail) => {

			this.dispatchEvent('DataIsProcessed', detail);

		};

		this['StartRead'] = (detail) => {

			this.dispatchEvent('StartRead', detail);

		};

		this['StopRead'] = (detail) => {

			this.dispatchEvent('StopRead', detail);

		};

		this['ChangeSideMenu'] = (detail) => {

			this.dispatchEvent('ChangeSideMenu', detail);

		};

		this['OpenSideMenu'] = (detail) => {

			this.dispatchEvent('OpenSideMenu', detail);

		};

		this['SetSelectionEffect'] = (detail) => {

			this.dispatchEvent('SetSelectionEffect', detail);

		};

		this['OpenMenu'] = (detail) => {

			this.dispatchEvent('OpenMenu', detail);

		};

		this['AttDashBoardsList'] = (detail) => {

			this.dispatchEvent('AttDashBoardsList', detail);

		};

		this['AttInputList'] = (detail) => {

			this.dispatchEvent('AttInputList', detail);

		};

		this['DataReadingFinished'] = (detail) => {

			this.dispatchEvent('DataReadingFinished', detail);

		};

		this['DashboardWasOpened'] = (detail) => {

			this.dispatchEvent('DashboardWasOpened', detail);

		};

	}

	addEventListener(eventName, callBackFunction) {

		window.addEventListener(eventName, (evt) => {

			callBackFunction(evt.detail);

		});

	}

	dispatchEvent(eventName, eventDetail) {

		if (eventDetail) {

			window.dispatchEvent(new CustomEvent(eventName, {
				detail: eventDetail,
			}));

		} else {

			window.dispatchEvent(new CustomEvent(eventName));

		}


	}

};