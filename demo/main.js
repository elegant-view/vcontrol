/**
 * @file main
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import VRouter from 'vrouter';
import Component from 'vcomponent/Component';
import ButtonPage from './ButtonPage';
import ButtonGroupPage from './ButtonGroupPage';
import CalendarPage from './CalendarPage';
import DropdownPage from './DropdownPage';
import FormPage from './FormPage';
import SelectPage from './SelectPage';

class Main extends Component {
    getTemplate() {
        return `
            <div class="main">
                <div class="nav">
                    <div class="item"><a href="#/main">首页</a></div>
                    <div class="item"><a href="#/main/CalendarPage">Calendar</a></div>
                    <div class="item"><a href="#/main/SelectPage">Select</a></div>
                </div>
                <div class="content"><!-- route --></div>
            </div>
        `;
    }
}

const vrouter = new VRouter({
    startNode: document.body,
    endNode: document.body
});

vrouter.registerComponents([Main, ButtonPage]);

vrouter.registerRoute({
    main: {
        Component: Main,
        isDefault: true,
        children: {
            Button: {
                Component: ButtonPage
            },
            ButtonGroupPage: {
                Component: ButtonGroupPage
            },
            CalendarPage: {
                Component: CalendarPage
            },
            DropdownPage: {
                Component: DropdownPage
            },
            FormPage: {
                Component: FormPage
            },
            SelectPage: {
                Component: SelectPage
            }
        }
    }
});
vrouter.render();
