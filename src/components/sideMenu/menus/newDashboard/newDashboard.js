const ipc = require('electron').ipcRenderer;
const path = require('path');
const fs = require('fs');
const Menu = require('../menu');
const Dialog = require('../../../dialog/dialog');
const Components = require('../../../components.js');
const Validator = require('../../../formBuilder/validator');
const EventHandler = require('../../../eventHandler/eventHandler');
const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
module.exports = class newDashBoardMenu extends Menu {

	constructor() {

		super('Novo Dashboard', 'newDashboard_menu');

		this.eventHandler = new EventHandler();

		this.button = Field.button({
			text: 'Criar',
			classList: ['formCenteredBtn', 'green-btn'],
		});

		this.form = new Form({
			newDashBoardSpliter: Container.spliter({
				Name: Field.text({
					label: 'Nome',
					att: 'name',
					validators: [Validator.isFilled, Validator.noSpecialChars],
				}),
				Directory: Field.directory({
					label: 'Diretório',
					att: 'dir',
					validators: [Validator.isFilled],
				}),
				NumberOfInputs: Field.number({
					label: 'Número de entradas',
					att: 'nOfInputs',
					validators: [Validator.isFilled, Validator.isInRange(1, 30)],
				}),
				Description: Field.textArea({
					label: 'Descrição',
					att: 'desc',
				}),
				Save: this.button,
			}, {
				startOpen: true,
				text: 'Novo Dashboard',
				id: 'newDashBoardSpliter',
			}),
		});

	}

	setFormConfigs() {

		this.button.onclick = () => {

			if (this.form.validate()) {

				const data = this.form.getData();
				let i = 0;
				const fileNames = fs.readdirSync(data['dir']);
				let newName = data['name'] + '.bson';

				while (fileNames.includes(newName)) {

					i = i + 1;
					newName = data['name'] + `(${i})` + '.bson';

				}

				this.EventHandler.NewDashBoard({
					name: data['name'],
					numberOfInputs: data['nOfInputs'],
					path: data['dir'] + '/' + newName,
					desc: data['desc'],
				});

				this.form.reset();

			}

		};

	}

	dropzoneConfig() {

		this.dropzone = document.createElement('div');
		const spliter = Components.spliter('importDashboardSpliter', 'Importar Dashboard', this.dropzone, true);
		
		this.dropzone.style.padding = '4em 1.4em';
		this.dropzone.style.color = 'whitesmoke';
		this.dropzone.style.textAlign = 'center';
		this.dropzone.style.border = '1px dashed #a9a9a963';

		this.dropzone.textContent = 'Clique ou solte um arquivo para importar um Dashboard';
		
		this.progressBarSettings();

		this.dropzone.onclick = () => {

			ipc.send('open-file-dialog-for-file', 'bson');

			ipc.on('selected-dir', (evt, arg) => {

				this.progressBarLoading(arg);
				this.eventHandler.dispatchEvent('ImportDashboard', arg);
					
				ipc.removeAllListeners('selected-dir');

			});

		};

		this.dropzone.ondragover = () => {

            return false;
        
		};

        this.dropzone.ondragleave = () => {

            return false;
        
		};

        this.dropzone.ondragend = () => {

            return false;
        
		};

        this.dropzone.ondrop = (e) => {
			
			e.preventDefault();

			if (e.dataTransfer.files.length != 1) {

				Dialog.showDialog({
					type: 'error',
					title: 'Error',
					message: 'Mais de um arquivo foi importado. Tente importar apenas um arquivo!',
					buttons: ['Ok'],
				});
				return false;

			}

			const file = e.dataTransfer.files[0];

			if (path.extname(file.path) != '.bson') {

				Dialog.showDialog({
					type: 'error',
					title: 'Error',
					message: 'O arquivo importado não é um dashboard. Tente importar um dashboard válido!',
					buttons: ['Ok'],
				});
				return false;

			}

			this.progressBarLoading(file.path);
			this.eventHandler.dispatchEvent('ImportDashboard', file.path);

            return false;
        
		};

		this.menuComponent.appendChild(spliter);

	}

	progressBarSettings() {

		this.progressBar = document.createElement('div');
		this.bar = document.createElement('div');
		this.progress = 0;

		this.progressBar.appendChild(this.bar);

		this.progressBar.id = 'progress';
		this.progressBar.style.width = '100%';
		this.progressBar.style.border = '1px solid #a9a9a963';
		this.progressBar.style.padding = '3px';

		this.bar.id = 'bar';
		this.bar.style.width = '1%';
		this.bar.style.height = '20px';
		this.bar.style.backgroundColor = '#a9a9a963';

	}

	progressBarLoading(filepath) {

		this.dropzone.textContent = path.basename(filepath);
		this.dropzone.style.padding = '1.4em';
		this.dropzone.appendChild(this.progressBar);

		if (this.progress == 0) {
			
			this.progress = 1;
			let width = 1;
			
			const id = setInterval(() => {
				
				if (width >= 100) {
					
					clearInterval(id);
					this.progress = 0;
					
				} else {
					
					width++;
					this.bar.style.width = width + '%';
				
				}

			}, 10);
		
		}

	}

	resetProgressBarSettings() {

		this.dropzone.textContent = 'Clique ou solte um arquivo para importar um Dashboard';
		this.dropzone.style.padding = '4em 1.4em';
		if (this.dropzone.contains(this.progressBar)) {

			this.dropzone.removeChild(this.progressBar);
		
		}

	}

	load() {

		this.menuComponent.appendChild(this.form.htmlComponent);
		this.dropzoneConfig();
		this.setFormConfigs();

		this.eventHandler.addEventListener('DashboardWasOpened', (evt) => {

			this.resetProgressBarSettings();

		});

	}

};