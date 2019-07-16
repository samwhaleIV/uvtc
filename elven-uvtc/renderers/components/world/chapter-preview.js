const MAX_RENDER_SIZE = 450;

function ChapterPreview(chapterID,getArea) {
    let image = imageDictionary[`ui/chapters/${chapterID}`];
    if(!image) {
        image = imageDictionary["ui/error"];
    }
    this.render = () => {
        let size;
        const area = getArea();
        if(area.width < area.height) {
            size = area.width;
        } else {
            size = area.height;
        }
        if(size > MAX_RENDER_SIZE) {
            size = MAX_RENDER_SIZE;
        }
        const halfSize = size / 2;
        area.x += area.width/2-halfSize;
        area.y += area.height/2-halfSize;
        context.fillStyle = "white";
        const borderSize = size + 6;
        context.fillRect(area.x-3,area.y-3,borderSize,borderSize);
        context.drawImage(
            image,
            area.x,
            area.y,
            size,size
        );
    }
}
export default ChapterPreview;
