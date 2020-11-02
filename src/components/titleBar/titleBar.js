const TitleBarActions = require('./titleBarActions.js');

module.exports = class TitleBar {

	constructor() {

		let TitleBarLeftDiv;
		let TitleBarRightDiv;

		this.TitleBarDiv = document.getElementById('title-bar'); ;
		this.TitleBarLeftDiv = TitleBarLeftDiv;
		this.TitleBarRightDiv = TitleBarRightDiv;

		this.titleBarActions = new TitleBarActions();

	}
	setStyle() {

		const closedWidth = String(Math.floor(screen.width / 32) + 'px');

		document.getElementById('menu-btn').style.width = closedWidth;

	}
	createButton(className, id, iclass) {

		const button = document.createElement('button');
		button.className = className;
		button.id = id;

		const i = document.createElement('i');
		i.className = iclass;

		button.appendChild(i);

		return button;

	}
	createTitleBar() {

		const windowName = document.createElement('h5');

		windowName.id = 'titlebar-name';
		windowName.textContent = 'ZenView';

		this.TitleBarLeftDiv = document.createElement('div');
		this.TitleBarLeftDiv.appendChild(this.createButton('titlebar-btn left', 'menu-btn', 'fas fa-bars'));

		this.TitleBarRightDiv = document.createElement('div');
		this.TitleBarRightDiv.className = 'right';
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'minimize-btn', 'fas fa-window-minimize'));
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'max-unmax-btn', 'far fa-square'));
		this.TitleBarRightDiv.appendChild(this.createButton('titlebar-btn', 'close-btn', 'fas fa-times'));

		this.TitleBarDiv.appendChild(this.TitleBarLeftDiv);
		this.TitleBarDiv.appendChild(windowName);
		this.TitleBarDiv.appendChild(this.TitleBarRightDiv);
		this.setStyle();

		window.addEventListener('DashboardWasOpened', () => {

			windowName.textContent = window.CurrentDashBoard.name + ' - ZenView';

		});

	}
	build() {

		this.createTitleBar();

		const menuButton = document.getElementById('menu-btn');
		const minimizeButton = document.getElementById('minimize-btn');
		const maxUnmaxButton = document.getElementById('max-unmax-btn');
		const closeButton = document.getElementById('close-btn');

		menuButton.addEventListener('click', (e) => {

			this.titleBarActions.openMenu(e.x, e.y);

		});

		minimizeButton.addEventListener('click', (e) => {

			this.titleBarActions.minimizeWindow();

		});

		maxUnmaxButton.addEventListener('click', (e) => {

			const icon = maxUnmaxButton.querySelector('i.far');

			this.titleBarActions.maxUnmaxWindow();

			if (this.titleBarActions.isWindowMaximized()) {

				icon.classList.remove('fa-square');
				icon.classList.add('fa-clone');

			} else {

				icon.classList.add('fa-square');
				icon.classList.remove('fa-clone');

			}

		});

		closeButton.addEventListener('click', (e) => {

			this.titleBarActions.closeWindow();

		});

	}

};