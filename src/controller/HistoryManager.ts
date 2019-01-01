import MutationLog from '../model/MutationLog';
import Action from '../model/Action';

class HistoryManager {
  isRecording: boolean = false;

  private _recording:MutationLog = new MutationLog();
  private _done:MutationLog[] = [];
  private _undone:MutationLog[] = [];
  private _maxLogs: number = 20;

  get maxLogs(): number {
    return this._maxLogs;
  }

  set maxLogs( value: number ) {
    this._maxLogs = value;
  }
  
  clear() {
    this._recording = new MutationLog();
    this._done = [];
    this._undone = [];
  }

  record( action: Action ) {
    this.isRecording = true;
    this._recording.actions.push( action );
  }

  getRecording(): MutationLog {
    return this._recording;
  }

  getLastRecordedAction() : Action {
    return this._recording.actions[ this._recording.actions.length - 1 ]
  }

  save() {
    this.isRecording = false;
    this._undone = [];
    this._done.push( this._recording );

    if( this._done.length > this._maxLogs )
      this._done.shift();

    this._recording = new MutationLog();
  }

  undo() {
    if( this._done.length === 0 ) return;
    // remove last log "done"
    let log: MutationLog = <MutationLog>this._done.pop();
    // execute log's actions undo's
    this.executeUndo( log );
    // add to undone
    this._undone.push( log );
  }

  redo() {
    if( this._undone.length === 0 ) return;
    // remove last log "undone"
    let log: MutationLog = <MutationLog>this._undone.pop();
    // execute log's actions redo's
    this.executeRedo( log );
    // add to done
    this._done.push( log );
  }

  private executeUndo( log:MutationLog ) {
    for( let i = log.actions.length - 1; i >= 0; i-- ) {
      log.actions[i].undo();
    }
  }

  private executeRedo( log:MutationLog ) {
    for( let i in log.actions ) {
      log.actions[i].redo();
    }
  }
}

export const historyManager = new HistoryManager();
