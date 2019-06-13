function RenderTitleLine(imageName,y,lineHeight) {
    const image = imageDictionary[imageName];
    const width = image.width / image.height * lineHeight;
    context.drawImage(image,0,0,image.width,image.height,halfWidth-width/2,y,width,lineHeight);
}
function RenderCenteredLine(text,y) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "100 28px Roboto";
    context.fillText(text,halfWidth,y);
}
function RenderNamedLine(role,name,y) {
    context.font = "100 28px Roboto";
    context.textAlign = "end";
    context.fillStyle = "#c8c8c8";
    context.fillText(role,halfWidth-5,y);
    context.textAlign = "start";
    context.fillStyle = "white";
    context.fillText(name,halfWidth+5,y);
}
function RenderLineBreak() {
    //Do nothing
}
function RenderHeavyLine(text,y) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "Bold 32px Arial";
    context.fillText(text,halfWidth,y);
}

function titleLine(imageName) {
    return (y,lineHeight) => RenderTitleLine(imageName,y,lineHeight);
}
function centeredLine(text) {
    return (y,lineHeight) => RenderCenteredLine(text,y,lineHeight);
}
function lineBreak() {
    return (y,lineHeight) => RenderLineBreak(y,lineHeight);
}
function namedLine(role,name) {
    return (y,lineHeight) => RenderNamedLine(role,name,y,lineHeight);
}
function heavyLine(text) {
    return (y,lineHeight) => RenderHeavyLine(text,y,lineHeight);
}

const CreditsData = [
    titleLine("ui/banner"),
    lineBreak(),

    heavyLine("LEAD CAST"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    centeredLine("Boney Elf"),
    lineBreak(),

    heavyLine("SUPPORTING CAST"),
    namedLine("Best elf","Boney Elf"),
    namedLine("Fan favorite","Boney Elf"),
    namedLine("Most hated","Boney Elf"),
    namedLine("Coolest elf","Boney Elf"),
    namedLine("Is this elf even an elf?","Boney Elf"),
    namedLine("Most mentiond elf","... Boney Elf"),
    lineBreak(),

    heavyLine("DIRECTORS"),
    centeredLine("Samuel Robinson"),
    centeredLine("Boney Elf"),
    lineBreak(),

    heavyLine("MUSIC COMPOSER"),
    centeredLine("Jim"),
    lineBreak(),

    heavyLine("MUSIC PERFORMER"),
    centeredLine("Jim"),
    lineBreak(),

    heavyLine("TOP CRITIC"),
    centeredLine("Jim"),
    lineBreak(),

    heavyLine("THE GUY WHO MADE THESE CREDITS"),
    centeredLine("Samuel Robison"),
    lineBreak(),

    heavyLine("THE GUY WHO ACTUALLY MADE THEM"),
    centeredLine("Boney Elf"),
    lineBreak(),
    lineBreak(),
    lineBreak(),
    centeredLine("Oh and, thanks for playing <3"),
    lineBreak(),
];

export default CreditsData;
