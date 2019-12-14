import Moves from "../../../runtime/battle/moves.js";
import RenderMove from "../battle/move.js";

function MovePreview(moveName,getArea,withName=false) {
    let move = Moves[moveName];
    if(!move) {
        move = Moves["Nothing"];
    }
    this.render = () => {
        let moveSize;
        const area = getArea();
        if(area.width < area.height) {
            moveSize = area.width;
        } else {
            moveSize = area.height;
        }
        const halfMoveSize = moveSize / 2;
        RenderMove(
            move,
            Math.round(area.x+area.width/2-halfMoveSize) + 3,
            Math.round(area.y+area.height/2-halfMoveSize) + 3,
            moveSize - 6,
            "white",!withName
        );
    }
}
export default MovePreview;
