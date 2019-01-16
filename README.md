# history-actions
Action manager framework with undo/redo.

This lightweight package provides a simple and flexible pattern to define user actions that can be done and undone through the **historyManager**, while letting you keep track of instances within your state, no matter how complex they could be. You can record multiple actions within a single **ChangeLog** and undo them all in one call.

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

An **Action** should not mutate the state of an object, but trigger the mutation within it. In OOP an object should mutate its own state, so even when you set a property from an **Action**, you should be triggering the setter on that property's definition. So it's fair to say that an **Action** is by all means a controller.

Here's an example of an **Action**:

```typescript

import { Action } from 'history-actions';
import { myTestState } from './MyTestState';

export class SetHeight extends Action {
  private _value: number;
  private _undoValue: number;

  constructor( value: number ) {
    super();
    this._value = value;
    this._undoValue = myTestState.height;
  }

  do() {
    myTestState.height = this._value;
  }
  
  undo() {
    myTestState.height = this._undoValue;
  }
  
  // OPTIONAL: by default is defined in the superclass as follows
  redo() {
    this.do();
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

If you are using typescript, which is highly recommended, it will force the implementation of the abstract **do()** and **undo()** methods.

### Properties and constructor

These will vary depending on the **Action**. You are free to provide whatever properties your class will need in order to **do()**, **undo()** and if necessary, to **redo()** an **Action**.

### The *action.do()* method

Here is where you should define how to mutate whatever it is you are mutating.

### The *action.undo()* method

Here is where you define how to reverse whatever was done in the **do()** method.

CAUTION: you should never call this method. Use **historyManager.undo()** instead.

### The *action.redo()* method

Normally you won't need to define this method, since by default it's defined to call **do()** but in case you need additional boilerplate to redo whatever was undone, you should define it.

CAUTION: you should never call this method. Use **historyManager.redo()** instead.

## historyManager

The **historyManager** gives you a simple interface to **record()** multiple actions within a **ChangeLog** that you can **save()** in order to **undo()** it and **redo()** it.

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
// or action.asyncDo()

// Save the <ChangeLog> you are recording. 
historyManager.save();

```

After calling **save()**, the next recorded action will be pushed into a new **ChangeLog**.

Alternatively to calling **action.do()** you can call **action.asyncDo()** which is simply an asynchronous wrapper that calls **do()**.

You can record multiple actions in a single **ChangeLog**. That is where this pattern shines. You can record a series of actions and undo them all in one call.

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

// Save the <ChangeLog> you are recording. 
historyManager.save();

```

### undo() | redo() | clear()

```typescript

import { historyManager } from 'history-actions';

// Undo the last saved <ChangeLog>
historyManager.undo()

// Redo the last undone <ChangeLog>
historyManager.redo()

// Clear all change logs and reset
historyManager.clear()

```

### Utilities

```typescript

import { historyManager } from 'history-actions';

// Returns the last recorded <Action> in the current <ChangeLog> being recorded.
historyManager.getLastRecordedAction();

// Returns the current <ChangeLog> being recorded.
historyManager.getRecording();

// Set/Get the max number of undo's allowed (default: 20).
historyManager.maxLogs = 20;

// Returns true if an Action has been pushed to the current <ChangeLog>.
const isRecording: boolean = historyManager.isRecording();

```

### What is a *ChangeLog*?

A *ChangeLog* consists on one or more actions that trigger mutations within the state of your app. It's a perceived change for the user which they might want to undo.

The **historyManager** records change logs. 

When you **historyManager.record( action )** you are basically adding the action to the current **ChangeLog** being recorded.

When you **historyManager.save()** you are closing the **ChangeLog** being recorded, so that a new one can be created.

**Why not just undoing/redoing a single action?** 

Well, let's say you want to **Add( objectInstance )**. Then, you simply create an Action **AddObjectInstance** and call the **Add( objectInstance )** method inside. Let's also asume that you do the same for **Remove()**, and now you want to perform a **Switch()**. So... you could define a **SwitchObjectInstance** Action, or you could reutilize the **Add** and **Remove** you already have, and record them in a single change log. This is just a very simple example of how this pattern scales.
