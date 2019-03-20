"use strict";
const fontDictionary = {
    " ":{width:1,glyph:[
        0,
        0,
        0,
        0,
        0
    ]},
    ",":{yOffset:1,width:1,glyph:[
        0,
        0,
        0,
        1,
        1
    ]},
    'a':{width:3,glyph:[
       1,1,1,
       1,0,1,
       1,1,1,
       1,0,1,
       1,0,1
    ]},
    'b':{width:3,glyph:[
        1,1,0,
        1,0,1,
        1,1,0,
        1,0,1,
        1,1,0
    ]},
    'c':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,0,0,
        1,0,0,
        1,1,1
    ]},
    'd':{width:3,glyph:[
        1,1,0,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,0
    ]},
    'e':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        1,0,0,
        1,1,1
    ]},
    'f':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        1,0,0,
        1,0,0
    ]},
    'g':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'h':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,1,
        1,0,1,
        1,0,1
    ]},
    'i':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,1
    ]},
    'j':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,0   
    ]},
    'k':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,0,
        1,0,1,
        1,0,1
    ]},
    'l':{width:3,glyph:[
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,1,1
    ]},
    'm':{width:5,glyph:[
        1,1,1,1,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1
    ]},
    'n':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1
    ]},
    'o':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'p':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        1,0,0,
        1,0,0
    ]},
    'q':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    'r':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,0,
        1,0,1,
        1,0,1
    ]},
    's':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    't':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    'u':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'v':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1,
        0,1,0
    ]},
    'w':{width:5,glyph:[
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        0,1,0,1,0
    ]},
    'x':{width:3,glyph:[
        1,0,1,
        1,0,1,
        0,1,0,
        1,0,1,
        1,0,1
    ]},
    'y':{width:3,glyph:[
        1,0,1,
        1,0,1,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    'z':{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,0,
        1,0,0,
        1,1,1
    ]},
    '0':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1    
    ]},
    '1':{width:3,glyph:[
        1,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,1
    ]},
    '2':{width:3,glyph:[
        1,1,1,
        0,0,1,
        1,1,1,
        1,0,0,
        1,1,1
    ]},
    '3':{width:3,glyph:[
        1,1,1,
        0,0,1,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    '4':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    '5':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    '6':{width:3,glyph:[
        1,0,0,
        1,0,0,
        1,1,1,
        1,0,1,
        1,1,1
    ]},
    '7':{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    '8':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        1,0,1,
        1,1,1
    ]},
    '9':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    "*":{width:3,glyph:[
        0,0,0,
        1,0,1,
        0,1,0,
        1,0,1,
        0,0,0
    ]},
    "'":{width:1,glyph:[
        1,
        1,
        0,
        0,
        0
    ]},
    ".":{width:1,glyph:[
        0,
        0,
        0,
        0,
        1
    ]},
    ":":{width:1,glyph:[
        0,
        1,
        0,
        1,
        0
    ]},
    "-":{width:3,glyph:[
        0,0,0,
        0,0,0,
        1,1,1,
        0,0,0,
        0,0,0
    ]},
    "!":{width:1,glyph:[
        1,
        1,
        1,
        0,
        1
    ]},
    "?":{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,1,
        0,0,0,
        0,1,0
    ]},
    "(":{width:2,glyph:[
        0,1,
        1,0,
        1,0,
        1,0,
        0,1
    ]},
    ")":{width:2,glyph:[
        1,0,
        0,1,
        0,1,
        0,1,
        1,0
    ]},
    "+":{width:3,glyph:[
        0,0,0,
        0,1,0,
        1,1,1,
        0,1,0,
        0,0,0
    ]},
    ">":{width:3,glyph:[
        1,0,0,
        0,1,0,
        0,0,1,
        0,1,0,
        1,0,0
    ]},
    "<":{width:3,glyph:[
        0,0,1,
        0,1,0,
        1,0,0,
        0,1,0,
        0,0,1
    ]},
    "[":{width:2,glyph:[
        1,1,
        1,0,
        1,0,
        1,0,
        1,1
    ]},
    "]":{width:2,glyph:[
        1,1,
        0,1,
        0,1,
        0,1,
        1,1
    ]},
    "=":{width:3,glyph:[
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0
    ]}
}