import { historyManager } from '../controller/HistoryManager';
import { SetValue } from './SetValue';
import { MyTestState } from './MyTestState';

let myTestState: MyTestState;
historyManager.clear();
myTestState = new MyTestState();

describe( 'maxLogs: number', ()=> {
  it( 'should be settable and readable', () => {
    let newMaxLogs = 10;
    historyManager.maxLogs = newMaxLogs;
    expect( historyManager.maxLogs ).toBe( 10 );
  });
});

describe( 'recording a single action, undoing it and redoing it', ()=> {
  let newValue = "Action Done";
  let oldValue: string;
  let action: SetValue;

  it( 'should do the action', () => {
    historyManager.clear();
    myTestState = new MyTestState();
    action = new SetValue( myTestState, "testProperty", newValue );
    historyManager.record( action );
    oldValue = myTestState.testProperty;
    action.do();
    historyManager.save();
    expect( myTestState.testProperty ).toBe( newValue );
  });

  it( 'should undo the action in the mutation log', () => {
    historyManager.undo();
    expect( myTestState.testProperty ).toBe( oldValue );
  });

  it( 'should redo the action in the mutation log', () => {
    historyManager.redo();
    expect( myTestState.testProperty ).toBe( newValue );
  });
});

describe( 'recording multiple actions, undoing them and redoing them', ()=> {
  let newValue1 = "Action Done 1";
  let newValue2 = "Action Done 2"
  let oldValue = myTestState.testProperty;
  
  let action2 = new SetValue( myTestState, "testProperty", newValue2 );

  it( 'should do the first action', () => {
    myTestState = new MyTestState();
    let action1 = new SetValue( myTestState, "testProperty", newValue1 );
    historyManager.clear();
    historyManager.record( action1 );
    action1.do();
    expect( myTestState.testProperty ).toBe( newValue1 );
  });
  
  it( 'should do the second action', () => {
    historyManager.record( action2 );
    action2.do();
    historyManager.save();
    expect( myTestState.testProperty ).toBe( newValue1 );
  });
  
  it( 'should undo all actions in the mutation log', () => {
    historyManager.undo();
    expect( myTestState.testProperty ).toBe( oldValue );
  });

  it( 'should redo all actions in the mutation log', () => {
    historyManager.redo();
    expect( myTestState.testProperty ).toBe( newValue1 );
  });
});
