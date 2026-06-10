import { Expr } from "./expr.js";
import { Real } from "./real.js";
import { Binary } from "./op.js";

class Macro extends Expr {}

class Power extends Macro {
    constructor(sign) {
        super(sign);
        this.willLookBehind = true;
        this.canProvideAhead = true;
    }

    aheadHooks(nextExpr, addFunc) {
        if (nextExpr instanceof Real) {
            addFunc(new Binary('*'));
        }
    }

    getExpr() {
        return '^' + this.sign;
    }

    getDisplay() {
        switch (this.sign) {
            case '2':
                return '²';
            case '3':
                return '³';
            default:
                return '^' + this.sign;
        }
    }
}

class Exp extends Macro {
    constructor(sign) {
        super(sign);
        this.willLookAhead = true;
        this.canProvideBehind = true;
    }

    behindHooks(lastExpr, addFunc) {
        if ((lastExpr instanceof Real) || (lastExpr instanceof Power)) {
            addFunc(new Binary('*'));
        }
    }

    getExpr() {
        return this.sign + '^';
    }

    getDisplay() {
        return this.sign + '^';
    }
}

export { Macro, Power, Exp };