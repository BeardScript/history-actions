export default abstract class Action {
  
  abstract do(): any;

  abstract undo(): any;

  redo(): any {
    this.do();
  }

  async asyncDo() {
    return this.do();
  }
}
