/**
 * @file FormPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Input from 'vcontrol/Form/Input';
import Select from 'vcontrol/Form/Select';
import Textarea from 'vcontrol/Form/Textarea';
import Formgroup from 'vcontrol/Form/Formgroup';
import Form from 'vcontrol/Form/Form';
import Inputgroup from 'vcontrol/Inputgroup/Inputgroup';

export default class FormPage extends Component {
    // getTemplate() {
    //     return `
    //         <ev-input type="email" placeholder="email"></ev-input>
    //         <ev-input placeholder="password" type="password"></ev-input>
    //         <ev-input type="file"></ev-input>
    //         <ev-input type="radio"></ev-input>
    //         <ev-input readonly placeholder="readonly"></ev-input>
    //         <ev-input readonly placeholder="readonly" size="sm"></ev-input>
    //         <ev-input size="lg"></ev-input>
    //         <ev-input state="success"></ev-input>
    //         <ev-select>
    //             <option>1</option>
    //             <option>2</option>
    //             <option>3</option>
    //         </ev-select>
    //         <ev-select multiple>
    //             <option>1</option>
    //             <option>2</option>
    //             <option>3</option>
    //         </ev-select>
    //         <ev-textarea></ev-textarea>
    //
    //         <ev-form>
    //             <ev-formgroup label="field label">
    //                 <ev-input type="email" placeholder="email"></ev-input>
    //             </ev-formgroup>
    //         </ev-form>
    //
    //         <ev-form inline>
    //             <ev-formgroup label="field label" tip="small tips">
    //                 <ev-inputgroup prefix="$" suffix=".00" size="sm" type="email" placeholder="email">
    //                 </ev-inputgroup>
    //             </ev-formgroup>
    //         </ev-form>
    //
    //         <ev-form inline>
    //             <ev-formgroup>
    //                 <ev-input type="email" placeholder="email"></ev-input>
    //             </ev-formgroup>
    //         </ev-form>
    //     `;
    // }

    getTemplate() {
        return `
            <ev-input readonly="" placeholder="readonly"></ev-input>
        `;
    }

    getComponentClasses() {
        return [Input, Select, Textarea, Formgroup, Form, Inputgroup];
    }
}
