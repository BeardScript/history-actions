import { historyManager } from '../controller/HistoryManager';
import { SetValue } from './SetValue';
import { MyTestState } from './MyTestState';

describe( 'maxLogs: number', ()=> {
  it( 'should be settable and readable', () => {
    let newMaxLogs = 10;
    historyManager.maxLogs = newMaxLogs;
    expect( historyManager.maxLogs ).toBe( 10 );
  });
});

describe( 'recording a single action, undoing it and redoing it', ()=> {
  let myTestState: MyTestState = new MyTestState();
  
  let newValue = "Action Done";
  let oldValue: string;
  let action: SetValue;

  it( 'should do the action', () => {
    action = new SetValue( myTestState, "testProperty", newValue );
    historyManager.record( action );
    oldValue = myTestState.testProperty;
    action.do();

    expect( myTestState.testProperty ).toBe( newValue );
    expect( historyManager.getRecording().actions.length ).toBe( 1 );

    historyManager.save();
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
  let myTestState: MyTestState = new MyTestState();;

  let newValue1 = "Action Done 1";
  let newValue2 = "Action Done 2"
  let oldValue = myTestState.testProperty;
  
  it( 'should return false when calling isRecording()', () => {
    expect( historyManager.isRecording() ).toBe( false );
  });

  it( 'should do the first action and record it', () => {
    let action1 = new SetValue( myTestState, "testProperty", newValue1 );
    historyManager.record( action1 );
    action1.do();
    
    expect( myTestState.testProperty ).toBe( newValue1 );
    expect( historyManager.getRecording().actions.length ).toBe( 1 );
  });

  it( 'should return true when calling isRecording()', () => {
    expect( historyManager.isRecording() ).toBe( true );
  });
  
  it( 'should do the second action and record it', () => {
    let action2 = new SetValue( myTestState, "testProperty", newValue2 );
    historyManager.record( action2 );
    action2.do();

    expect( myTestState.testProperty ).toBe( newValue2 );
    expect( historyManager.getRecording().actions.length ).toBe( 2 );

    historyManager.save();
  });

  it( 'should undo all actions in the mutation log', () => {
    historyManager.undo();
    expect( myTestState.testProperty ).toBe( oldValue );
  });

  it( 'should redo all actions in the mutation log', () => {
    historyManager.redo();
    expect( myTestState.testProperty ).toBe( newValue2 );
  });

  it( 'should return false when calling isRecording()', () => {
    expect( historyManager.isRecording() ).toBe( false );
  });
});
