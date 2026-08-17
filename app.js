import { MenuController } from './controller/menuController.js';
import { MenuView } from './view/menuView.js';
const controller = new MenuController();
const view = new MenuView(controller);
view.init();
