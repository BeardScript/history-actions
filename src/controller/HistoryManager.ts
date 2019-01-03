import MutationLog from '../model/MutationLog';
import Action from '../model/Action';

class HistoryManager {
  private _recording:MutationLog = new MutationLog();
  private _done:MutationLog[] = [];
  private _undone:MutationLog[] = [];
  private _maxLogs: number = 20;

  /** The max number of undo's allowed (default: 20) */
  get maxLogs(): number {
    return this._maxLogs;
  }
  set maxLogs( value: number ) {
    this._maxLogs = value;
  }

  /** Returns true if an Action has been pushed to the current MutationLog */
  isRecording(): boolean {
    return this._recording.actions.length > 0;
  }
  
  /** Clear all mutation logs and reset */
  clear() {
    this._recording = new MutationLog();
    this._done = [];
    this._undone = [];
  }

  /** Pushes an <Action> to the current <MutationLog> being recorded */
  record( action: Action ) {
    this._recording.actions.push( action );
  }

  /** Returns the current <MutationLog> being recorded. */
  getRecording(): MutationLog {
    return this._recording;
  }

  /** Returns the last recorded <Action> in the current <MutationLog> being recorded. */
  getLastRecordedAction(): Action {
    return this._recording.actions[ this._recording.actions.length - 1 ]
  }

  /** Saves the current <MutationLog> being recorded */
  save() {
    this._undone = [];
    this._done.push( this._recording );

    if( this._done.length > this._maxLogs ){
      this._done.shift();
      console.warn( "The last MutationLog was dropped. You are trying to push more mutation logs than allowed. Please fix your code, or set a higher 'historyManager.maxLogs'" );
    }

    this._recording = new MutationLog();
  }

  /** Undo the last saved <MutationLog> */
  undo() {
    if( this._done.length === 0 ) return;
    // remove last log "done"
    let log: MutationLog = <MutationLog>this._done.pop();
    // execute log's actions undo's
    this.executeUndo( log );
    // add to undone
    this._undone.push( log );
  }

  /** Redo the last undone <MutationLog> */
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
