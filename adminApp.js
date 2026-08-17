import { AdminController } from './controller/adminController.js';
import { AdminView } from './view/adminView.js';
new AdminView(new AdminController()).init();
