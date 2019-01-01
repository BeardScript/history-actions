# history-actions
Action manager framework with undo/redo.

This lightweight package provides a simple and flexible pattern to define user actions.

- Simple.
- Lightweight.
- Flexible.

# Instructions

## Define an Action

'''typescript

import { Action } from 'history-actions';
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
  
  // OPTIONAL: by default is defined in the superclass as follows
  redo() {
    this.do()
  }
}

'''

Let's look at the above code more in-depth:

### The class

Create a class with the name of the action you are defining and make sure it extends Action.

'''typescript
import { Action } from 'history-actions';

export class MyAction extends Action {
...
}

'''

If you are using typescript, which is highly recommended, it will force the implementation of the abstract do() and undo() methods.

### Properties and constructor

These will vary depending on the action. You are free to provide whatever properties your class will need in order to, do() an action and undo() it and if necessary, to redo() it.

### The do() method

Here is where you should define the mutation of whatever it is you are mutating. Please try not to turn green, you'll look like puke.

### The undo() method

Here is where you define the the mutation that reverses whatever whas done in the do() method.

### The redo() method

Normally you won't need to define this method, since by default it's defined to call do() but in case you need additional boilerplate to redo whatever was undone, you should define it.

## historyManager

Now for the fun part.

Once your Actions are defined you should use them, right? Otherwise they'll be sitting there bored, and feeling useless.
Let's see them in action.

'''typescript

import { MyAction } from './Actions/MyAction'

let action = new MyAction();
historyManager.record(action); 
action.do()
historyManager.save();

'''
