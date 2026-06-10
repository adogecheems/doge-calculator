import { Expr } from "./expr.js";

class Dot extends Expr {
    constructor() {
        super('.');
        this.willLookAhead = true;
        this.willLookBehind = true;
    }

    addHooks(context) {
        context.isDotActive = true;
    }

    removeHooks(context) {
        context.isDotActive = false;
    }
}

class Paren extends Expr { }

class LeftParen extends Paren {
    constructor() {
        super('(');
        this.willLookAhead = true;
        this.canProvideBehind = true;
    }

    addHooks(context) {
        context.parensStack.push('(');
    }

    removeHooks(context) {
        context.parensStack.pop();
    }
}

class RightParen extends Paren {
    constructor() {
        super(')');
        this.willLookBehind = true;
        this.canProvideAhead = true;
    }

    addHooks(context) {
        context.parensStack.pop();
    }

    removeHooks(context) {
        context.parensStack.push('(');
    }
}


class ImplicitRightParen extends Paren {
    constructor() {
        super(')');
        this.willLookBehind = true;
        this.canProvideAhead = true;
    }

    addHooks(context) {
        context.parensStack.pop();
    }

    removeHooks(context) {
        context.parensStack.push('{');
    }

    getDisplay() {
        return '';
    }
}

class Controller extends Expr { }

class Start extends Expr {
    constructor() {
        super('start');
        this.willLookAhead = true;
    }

    getExpr() { return ''; }
    getDisplay() { return ''; }
}

export { Dot, Paren, LeftParen, RightParen, ImplicitRightParen, Controller, Start };