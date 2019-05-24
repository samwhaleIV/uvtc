const GlobalState = new (function(){
    this.save = () => {
        console.warn("Did not really save the global state because we are still in a debug setting");
    }
    this.restore = () => {
        console.warn("Did not really restore the global state from disk because we are still in a debug setting")
    }
    this.data = {};
})();
export default GlobalState;
