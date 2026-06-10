import { Log, Trig, Root } from './expr/func.js';
import { Binary, Postfix, AutoMinus } from './expr/op.js';
import { Num, Const } from './expr/real.js';
import { Power, Exp } from './expr/macro.js';
import { Dot, LeftParen, RightParen, Controller } from './expr/struct.js';

const c = {
    "ng": ["#333537", "#e3e3e3"],
    "sb": ["#004a77", "#c2e7ff"],
    "db": ["#0842a0", "#d3e3fd"],
    "lg": ["#6dd58c", "#0a3818"],
};

const defaultKeyMap = {
    "line1": [
        { text: "e", expr: new Const('e'), color: c.sb },
        { text: "π", expr: new Const('pi'), color: c.sb },
        { text: "xⁿ", expr: new Binary('^'), color: c.sb },
        { text: "!", expr: new Postfix('!'), color: c.sb },
        { text: "AC", expr: new Controller('clear'), color: c.db },
        { text: "7", expr: new Num('7'), color: c.ng },
        { text: "8", expr: new Num('8'), color: c.ng },
        { text: "9", expr: new Num('9'), color: c.ng },
        { text: "(", expr: new LeftParen(), color: c.sb },
        { text: "÷", expr: new Binary('/'), color: c.sb },
        { text: "×", expr: new Binary('*'), color: c.sb },
    ],
    "line2": [
        { text: "<unit>", expr: new Controller('unit-toggle'), color: c.sb },
        { text: "sin", expr: new Trig('sin'), color: c.sb },
        { text: "cos", expr: new Trig('cos'), color: c.sb },
        { text: "tan", expr: new Trig('tan'), color: c.sb },
        { text: ".", expr: new Dot(), color: c.ng },
        { text: "4", expr: new Num('4'), color: c.ng },
        { text: "5", expr: new Num('5'), color: c.ng },
        { text: "6", expr: new Num('6'), color: c.ng },
        { text: ")", expr: new RightParen(), color: c.sb },
        { text: "-", expr: new AutoMinus(), color: c.sb },
        { text: "+", expr: new Binary('+'), color: c.sb },
    ],
    "line3": [
        { text: "inv", expr: new Controller('inverse'), color: c.sb },
        { text: "√", expr: new Root('2'), color: c.sb },
        { text: "ln", expr: new Log('e'), color: c.sb },
        { text: "log", expr: new Log('10'), color: c.sb },
        { text: "0", expr: new Num('0'), color: c.ng },
        { text: "1", expr: new Num('1'), color: c.ng },
        { text: "2", expr: new Num('2'), color: c.ng },
        { text: "3", expr: new Num('3'), color: c.ng },
        { text: "Del", expr: new Controller('remove'), color: c.sb },
    ]
};

const invKeyMap = {
    "line1": [
        { text: "e", expr: new Const('e'), color: c.sb },
        { text: "π", expr: new Const('pi'), color: c.sb },
        { text: "xⁿ", expr: new Binary('^'), color: c.sb },
        { text: "!", expr: new Postfix('!'), color: c.sb },
        { text: "AC", expr: new Controller('clear'), color: c.db },
        { text: "7", expr: new Num('7'), color: c.ng },
        { text: "8", expr: new Num('8'), color: c.ng },
        { text: "9", expr: new Num('9'), color: c.ng },
        { text: "(", expr: new LeftParen(), color: c.sb },
        { text: "÷", expr: new Binary('/'), color: c.sb },
        { text: "×", expr: new Binary('*'), color: c.sb },
    ],
    "line2": [
        { text: "<unit>", expr: new Controller('unit-toggle'), color: c.sb },
        { text: "asin", expr: new Trig('asin'), color: c.sb },
        { text: "acos", expr: new Trig('acos'), color: c.sb },
        { text: "atan", expr: new Trig('atan'), color: c.sb },
        { text: ".", expr: new Dot(), color: c.ng },
        { text: "4", expr: new Num('4'), color: c.ng },
        { text: "5", expr: new Num('5'), color: c.ng },
        { text: "6", expr: new Num('6'), color: c.ng },
        { text: ")", expr: new RightParen(), color: c.sb },
        { text: "-", expr: new AutoMinus(), color: c.sb },
        { text: "+", expr: new Binary('+'), color: c.sb },
    ],
    "line3": [
        { text: "inv", expr: new Controller('inverse'), color: c.sb },
        { text: "x²", expr: new Power('2'), color: c.sb },
        { text: "eˣ", expr: new Exp('e'), color: c.sb },
        { text: "10ˣ", expr: new Exp('10'), color: c.sb },
        { text: "0", expr: new Num('0'), color: c.ng },
        { text: "1", expr: new Num('1'), color: c.ng },
        { text: "2", expr: new Num('2'), color: c.ng },
        { text: "3", expr: new Num('3'), color: c.ng },
        { text: "Del", expr: new Controller('remove'), color: c.sb },
    ]
};

export { c, defaultKeyMap, invKeyMap };