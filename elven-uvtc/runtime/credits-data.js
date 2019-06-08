const LineTypes = {
    title: 0,
    centered: 1,
    named: 2,
    break: 3
}


function RenderTitleLine(line,x,y) {
    const image = imageDictionary["ui/banner"]
    const height = 80;
    const width = image.width / image.height * height;
    context.drawImage(image,0,0,image.width,image.height,halfWidth-width/2,Math.floor(y-height/2),width,height);
}
function RenderCenteredLine(text,x,y,width) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "28px Roboto";
    context.fillText(text,halfWidth,y,width);
}
function RenderNamedLine(role,name,x,y,width) {
    context.font = "28px Roboto";
    context.textAlign = "end";
    context.fillStyle = "#c8c8c8";
    context.fillText(role,halfWidth-5,y,width);
    context.textAlign = "start";
    context.fillStyle = "white";
    context.fillText(name,halfWidth+5,y,width);
}
function RenderLineBreak(x,y,width) {
    //Do nothing
}
function RenderHeavyLine(text,x,y,width) {
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "Bold 32px Arial";
    context.fillText(text,halfWidth,y,width);
}

function titleLine(title) {
    return (x,y,width) => RenderTitleLine(title,x,y,width);
}
function centeredLine(text) {
    return (x,y,width) => RenderCenteredLine(text,x,y,width);
}
function lineBreak() {
    return (x,y,width) => RenderLineBreak(x,y,width);
}
function namedLine(role,name) {
    return (x,y,width) => RenderNamedLine(role,name,x,y,width);
}
function heavyLine(text) {
    return (x,y,width) => RenderHeavyLine(text,x,y,width);
}

const CreditsData = [
    titleLine(),
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
