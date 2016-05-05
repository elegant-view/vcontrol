/**
 * @file List group
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

export default class List extends Component {
    getTemplate() {
        return `
            <!-- if: props.type === 'link' -->
                <div class="${uiPrefix}-list-group">
                    <!-- for: list as item -->

                        <!-- var: linkClassList = [
                            '${uiPrefix}-list-group-item',
                            item.active ? 'active' : '',
                            item.disabled ? 'disabled' : '',
                            item.variant ? ('${uiPrefix}-list-group-item-' + item.variant) : '',
                        ] -->

                        <a href="\${item.link}"
                            class="\${linkClassList}">
                            <!-- if: item.type === 'abstract' -->
                                <h4 class="${uiPrefix}-list-group-item-heading">\${item.title}</h4>
                                <p class="${uiPrefix}-list-group-item-text">\${item.desc}</p>
                            <!-- else -->
                                \${item.label}
                            <!-- /if -->
                        </a>
                    <!-- /for -->
                </div>
            <!-- else -->
                <ul class="${uiPrefix}-list-group">
                    <!-- for: props.list as item -->

                        <!-- var: linkClassList = [
                            '${uiPrefix}-list-group-item',
                            item.active ? 'active' : '',
                            item.disabled ? 'disabled' : '',
                            item.variant ? ('${uiPrefix}-list-group-item-' + item.variant) : '',
                        ] -->

                        <!-- if: item.type === 'label' -->
                            <li class="\${linkClassList}">
                                <span class="label label-default label-pill pull-xs-right">
                                    \${item.count}
                                </span>
                                \${item.label}
                            </li>
                        <!-- else -->
                            <li class="\${linkClassList}">\${item.label}</li>
                        <!-- /if -->
                    <!-- /for -->
                </ul>
            <!-- /if -->
        `;
    }
}
