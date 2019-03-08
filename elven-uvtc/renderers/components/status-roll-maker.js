function StatusRollMakerRenderer() {

    this.render = function() {
        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        for(let i = 10;i<56;i++) {

            const x = 32*(i-10);

            context.drawImage(imageDictionary[
                "ui/card-icons"
            ],32,0,32,32,
            x,0,32,32);
            context.drawImage(imageDictionary[
                "ui/card-icons"
            ],32,0,32,32,
            x,32,32,32);

            context.fillStyle = "white";
            context.beginPath();
            context.rect(x+8,10,16,12);
            context.rect(x+8,42,16,12);
            context.fill();

            drawTextBlack(String(i),x+9,11,2);

            drawTextBlack(String(i+46),x+9,32+11,2);

        }

    }
}
