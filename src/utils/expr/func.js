import { Expr } from "./expr.js";

class Func extends Expr {
    constructor(sign) {
        super(sign);
        this.willLookAhead = true;
        this.canProvideBehind = true;
    }
}

class NormalFunc extends Func {

    addHooks(context) {
        context.parensStack.push('(');
    }
    removeHooks(context) {
        context.parensStack.pop();
    }

    getExpr() { return this.sign + '('; }
    getDisplay() { return this.sign + '('; }
}

class Log extends NormalFunc {
    getExpr() {
        switch (this.sign) {
            case 'e':
                return 'log(';
            default:
                return 'log' + this.sign + '(';
        }
    }
    getDisplay() {
        switch (this.sign) {
            case 'e':
                return 'ln(';
            case '10':
                return 'log(';
            default:
                return 'log' + this.sign + '(';
        }
    }
}

class Trig extends NormalFunc { }

class Root extends Func {
    addHooks(context) {
        context.parensStack.push('{');
    }

    removeHooks(context) {
        context.parensStack.pop();
    }

    getExpr() {
        switch (this.sign) {
            case '2':
                return 'sqrt(';
            case '3':
                return 'cbrt(';
        }
    }

    getDisplay() {
        switch (this.sign) {
            case '2':
                return '√';
            case '3':
                return '∛';
        }
    }
}

export { Func, NormalFunc, Log, Trig, Root };