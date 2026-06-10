import { Expr } from './expr.js';

class Op extends Expr {}

class Binary extends Op {
    constructor(sign) {
        super(sign);
        this.willLookAhead = true;
        this.willLookBehind = true;
    }

    getDisplay() {
        switch (this.sign) {
            case '*':
                return '×';
            case '/':
                return '÷';
            default:
                return this.sign;
        }
    }
}

class Prefix extends Op {
    constructor(sign) {
        super(sign);
        this.willLookAhead = true;
        this.canProvideBehind = true;
    }
}

class Postfix extends Op {
    constructor(sign) {
        super(sign);
        this.willLookBehind = true;
        this.canProvideAhead = true;
    }
}

class AutoMinus extends Op {
    constructor() {
        super('-');
        this.willLookAhead = true;
        this.canProvideBehind = true;
    }
}

export { Op, Binary, Prefix, Postfix, AutoMinus };