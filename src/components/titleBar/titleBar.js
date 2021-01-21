const ipcRenderer = require('electron').ipcRenderer;
const TitleBarActions = require('./titleBarActions.js');
const EventHandler = require('../eventHandler/eventHandler.js');
const Components = require('../components');

module.exports = class TitleBar {

	constructor() {

		this.eventHandler = new EventHandler();

		this.titleBarActions = new TitleBarActions();
		this.titleBarActions.setEvents();

	}

	setStyle() {

		const closedWidth = String(Math.floor(screen.width / 32) + 'px');
		document.getElementById('menu-btn').style.width = closedWidth;

	}

	setEvents() {

		const menuButton = document.getElementById('menu-btn');
		const minimizeButton = document.getElementById('minimize-btn');
		const maxUnmaxButton = document.getElementById('max-unmax-btn');
		const closeButton = document.getElementById('close-btn');

		const wrapper = maxUnmaxButton.querySelector('i');
        const icon = maxUnmaxButton.querySelector('i svg');

		menuButton.addEventListener('click', (e) => {

			this.titleBarActions.openMenu(e.x, e.y);

		});

		minimizeButton.addEventListener('click', (e) => {

			this.titleBarActions.minimizeWindow();

		});

		maxUnmaxButton.addEventListener('click', (e) => {

			this.titleBarActions.maxUnmaxWindow();
			
		});

		closeButton.addEventListener('click', (e) => {

			this.titleBarActions.closeWindow();

		});

		window.addEventListener('maximizeWindow', (e) => {

			icon.remove();
			wrapper.innerHTML = Components.icon('clone-regular');
			
		});
		
		window.addEventListener('unmaximizeWindow', (e) => {
			
			icon.remove();
			wrapper.innerHTML = Components.icon('square-regular');

		});

		this.eventHandler.addEventListener('DashboardWasOpened', (evt) => {

			this.icon.style.display = 'none';
			this.windowName.textContent = window.CurrentDashBoard.name + ' - ZenView';

		});

		this.eventHandler.addEventListener('DashboardNotSaved', (evt) => {

			this.icon.style.display = 'block';
			
		});
		
		ipcRenderer.on('SaveDashboard', (evt) => {

			this.icon.style.display = 'none';

		});

	}

	createButton(className, id, iconName) {

		const button = document.createElement('button');
		button.className = className;
		button.id = id;

		const i = document.createElement('i');
		i.innerHTML = Components.icon(iconName);

		button.appendChild(i);

		return button;

	}

	createTitleBar() {

		const wrapper = document.createElement('div');
		const titleBarLeftDiv = document.createElement('div');
		const titleBarRightDiv = document.createElement('div');
		const titleBarDiv = document.getElementById('title-bar');

		this.windowName = document.createElement('h6');
		this.icon = document.createElement('i');

		wrapper.id = 'name-wrapper';

		this.icon.innerHTML = Components.icon('circle-solid');
		this.icon.id = 'save-circle';
		this.icon.style.display = 'none';

		this.windowName.id = 'titlebar-name';
		this.windowName.textContent = 'ZenView';

		titleBarLeftDiv.appendChild(this.createButton('titlebar-btn', 'menu-btn', 'bars-solid'));

		titleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'minimize-btn', 'window-minimize-regular'));
		titleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'max-unmax-btn', 'square-regular'));
		titleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'close-btn', 'times-solid'));

		wrapper.appendChild(this.icon);
		wrapper.appendChild(this.windowName);

		titleBarDiv.appendChild(titleBarLeftDiv);
		titleBarDiv.appendChild(wrapper);
		titleBarDiv.appendChild(titleBarRightDiv);

	}

	build() {

		this.createTitleBar();
		this.setStyle();
		this.setEvents();

	}

};