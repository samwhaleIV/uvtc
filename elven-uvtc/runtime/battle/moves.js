const Moves = {
    "None": {},
    "Iced Whiskey": {},
    "Red Apple": {},
    "Return to Sender": {},
    "Poison Apple": {},
    "Submission": {},
    "Jingle Bells": {},
    "Wooden Sword": {},
    "Wooden Shield": {},
    "Cry": {},
    "Midus Touch": {},
    "Hot Porridge": {},
    "Stress Eating": {},
    "Banish": {},
    "Trust": {},
    "Treason": {},
    "Friendship": {},
    "Vitamins": {}
};
const MovesList = [];
Object.entries(Moves).forEach(entry => {
    entry[1].name = entry[0];
    MovesList.push(entry[1]);
});
export default Moves;
export {MovesList,Moves};
