import Action from '../model/Action';
import { MyTestState } from './MyTestState';

export class SetValue extends Action {
  private _state: MyTestState;
  private _prop: string;
  private _value: any;
  private _undoValue: string;

  constructor( state: MyTestState, prop: string, value: any ) {
    super();
    this._state = state;
    this._prop = prop;
    this._value = value;
    this._undoValue = state[prop];
  }

  do() {
    this._state[this._prop] = this._value;
  }
  
  undo() {
    this._state[this._prop] = this._undoValue;
  }
}
