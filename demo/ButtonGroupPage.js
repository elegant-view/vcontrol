/**
 * @file ButtonGroupPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import ButtonGroup from 'vcontrol/ButtonGroup/ButtonGroup';
import Button from 'vcontrol/Button/Button';
import ButtonToolbar from 'vcontrol/ButtonGroup/ButtonToolbar';
import Container from 'vcontrol/Grid/Container';
import Row from 'vcontrol/Grid/Row';
import Column from 'vcontrol/Grid/Column';

export default class ButtonGroupPage extends Component {
    getTemplate() {
        return `
            <ev-container>
                <ev-row>
                    <ev-column size="sm" columns="12" push="1">
                        <ev-button-group size="lg">
                            <ev-button variant="primary">按钮</ev-button>
                            <ev-button variant="primary">按钮</ev-button>
                            <ev-button variant="secondary">按钮</ev-button>
                        </ev-button-group>
                    </ev-column>
                </ev-row>
                <ev-row>
                    <ev-button-toolbar>
                        <ev-button-group direction="vertical">
                            <ev-button variant="primary" size="sm">按钮</ev-button>
                            <ev-button variant="primary" size="sm">按钮</ev-button>
                            <ev-button variant="secondary" size="sm">按钮</ev-button>
                        </ev-button-group>
                        <ev-button-group>
                            <ev-button variant="primary" size="sm">按钮</ev-button>
                            <ev-button variant="primary" size="sm">按钮</ev-button>
                            <ev-button variant="secondary" size="sm">按钮</ev-button>
                        </ev-button-group>
                    </ev-button-toolbar>
                </ev-row>
            </ev-container>
        `;
    }

    getComponentClasses() {
        return [ButtonGroup, Button, ButtonToolbar, Container, Row, Column];
    }
}
