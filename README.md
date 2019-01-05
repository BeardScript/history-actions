# history-actions
Action manager framework with undo/redo.

This lightweight package provides a simple and flexible pattern to define user actions that can be done and undone through the *historyManager*, while letting you keep track of instances within your state, no matter how complex they could be. You can record multiple actions within a single log and undo them all at once.

- Simple.
- Lightweight.
- Flexible.

# Instructions

## Install

```bash

npm install history-actions --save

```

## Define an Action

An **Action** defines the way a mutation is done and undone. For a better result, you should granulate your actions as much as possible. An **Action** should do one thing only.

You might be wondering, if it defines a mutation, why is it called **Action** and not **Mutation**? The answere is simple, an Action does not mutate the state of an object, it triggers the mutation within it. In OOP an object should mutate its own state, so even when you set a property from an Action, you should be triggering the setter on that properties definition. So it's fair to say that an **Action** is by all means a controller.

Here's an example of an **Action**:

```typescript

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

```

Let's look at the above code more in-depth:

### The class

Create a class with the name of the action you are defining and make sure it extends Action.

```typescript

import { Action } from 'history-actions';

export class MyAction extends Action {
...
}

```

If you are using typescript, which is highly recommended, it will force the implementation of the abstract do() and undo() methods.

### Properties and constructor

These will vary depending on the action. You are free to provide whatever properties your class will need in order to, do() an action and undo() it and if necessary, to redo() it.

### The *action.do()* method

Here is where you should define the mutation of whatever it is you are mutating. Please try not to turn green, you'll look like puke.

### The *action.undo()* method

Here is where you define the the mutation that reverses whatever was done in the do() method.

CAUTION: you shouldn't use this method in your code. use historyManager.undo() instead.

### The *action.redo()* method

Normally you won't need to define this method, since by default it's defined to call do() but in case you need additional boilerplate to redo whatever was undone, you should define it.

CAUTION: you shouldn't use this method in your code. use historyManager.redo() instead.

## historyManager

The **historyManager** gives you a simple interface to *record()* multiple actions within a *mutation log* that you can *save()* so that you can *undo()* it and *redo()* it.

### Example

Now to the fun part.

Once your Actions are defined you should use them, right? Otherwise they'll be sitting there bored, and feeling useless.
Let's see them in action.

```typescript

import { historyManager } from 'history-actions';
import { MyAction } from './Actions/MyAction';

// Instantiate an <Action>
const action = new MyAction();

// Record it
historyManager.record(action);

// Run it
action.do();

// Save the <MutationLog> you are recording. 
historyManager.save();

```

After calling *save()*, the next recorded action will be pushed into a new **MutationLog**.

You can record multiple actions in a single **MutationLog**. That is where this pattern shines. You can record a series of actions and undo them all in one call.

```typescript

import { historyManager } from 'history-actions';
import { MyAction } from './Actions/MyAction';

// Instantiate one or more actions
const action1 = new MyAction();
const action2 = new MyAction();

// Record them
historyManager.record(action1);
historyManager.record(action2);

// Run them
action1.do();
action2.do();

// Save the <MutationLog> you are recording. 
historyManager.save();

```

### undo() | redo() | clear()

```typescript

import { historyManager } from 'history-actions';

// Undo the last saved <MutationLog>
historyManager.undo()

// Redo the last undone <MutationLog>
historyManager.redo()

// Clear all mutation logs and reset
historyManager.clear()

```

### Utilities

```typescript

import { historyManager } from 'history-actions';

// Returns the last recorded <Action> in the current <MutationLog> being recorded.
historyManager.getLastRecordedAction();

// Returns the current <MutationLog> being recorded.
historyManager.getRecording();

// Set/Get the max number of undo's allowed (default: 20).
historyManager.maxLogs = 20;

// Returns true if an Action has been pushed to the current <MutationLog>.
const isRecording: boolean = historyManager.isRecording();

```

### What is a *MutationLog*?

A *MutationLog* consists on one or more actions that trigger mutations within the state of your app. It's the perceived change for the user. That one thing they might want to undo.

The *historyManager* records mutation logs. 

When you **historyManager.record( action )** you are basically adding the action to the current **MutationLog** being recorded.

When you **historyManager.save()** you are closing the **MutationLog** being recorded, so that a new one can be created.

**Why not just undoing/redoing a single action?** 

Well, let's say you want to **Add( objectInstance )**. Then, you simply create an Action **AddObjectInstance** and call the **Add( objectInstance )** method inside. Let's also asume that you do the same for **Remove()**, and now you want to perform a **Switch()**. So... you could define a **SwitchObjectInstance** Action, or you could reutilize the **Add** and **Remove** you already have, and record them in a single mutation log. This is just a very simple example of how this pattern scales.
