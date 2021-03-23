const DashBoardsMenu = require('./menus/dashboards/dashBoards.js');
const NewDashBoardMenu = require('./menus/newDashboard/newDashboard.js');
const StartRead = require('./menus/startRead/startRead.js');
const InputsMenu = require('./menus/inputsMenu/inputsMenu.js');
const BlocksMenu = require('./menus/blocksMenu/blocksMenu');
const EditMenu = require('./menus/EditMenu/EditMenu.js');
const TerminalMenu = require('./menus/terminalMenu/terminalMenu.js');
const InfoMenu = require('./menus/InfoMenu/InfoMenu.js');
const ConfigMenu = require('./menus/ConfigMenu/ConfigMenu.js');


module.exports = [NewDashBoardMenu, DashBoardsMenu, InputsMenu, StartRead, BlocksMenu, EditMenu, TerminalMenu, InfoMenu, ConfigMenu];