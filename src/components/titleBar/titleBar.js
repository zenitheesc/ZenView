const TitleBarActions = require('./titleBarActions.js');
const EventHandler = require('../eventHandler/eventHandler.js');
const Components = require('../components'); 

module.exports = class TitleBar {

	constructor() {

		this.eventHandler = new EventHandler();

		this.TitleBarDiv = document.getElementById('title-bar');

		this.titleBarActions = new TitleBarActions();
		this.titleBarActions.setEvents();

	}

	setStyle() {

		const closedWidth = String(Math.floor(screen.width / 32) + 'px');

		document.getElementById('menu-btn').style.width = closedWidth;

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

		const windowName = document.createElement('h6');

		windowName.id = 'titlebar-name';
		windowName.textContent = 'ZenView';

		this.TitleBarLeftDiv = document.createElement('div');
		this.TitleBarLeftDiv.appendChild(this.createButton('titlebar-btn', 'menu-btn', 'bars-solid'));

		this.TitleBarRightDiv = document.createElement('div');
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'minimize-btn' , 'window-minimize-regular'));
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'max-unmax-btn', 'square-regular'));
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'close-btn'    , 'times-solid'));

		this.TitleBarDiv.appendChild(this.TitleBarLeftDiv);
		this.TitleBarDiv.appendChild(windowName);
		this.TitleBarDiv.appendChild(this.TitleBarRightDiv);
		this.setStyle();

		this.eventHandler.addEventListener('DashboardWasOpened', () => {

			windowName.textContent = window.CurrentDashBoard.name + ' - ZenView';

		});

	}

	build() {

		this.createTitleBar();

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

	}

};