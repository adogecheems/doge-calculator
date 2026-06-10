import { Expr } from './expr.js';
import { Binary } from './op.js';

class Real extends Expr {
    constructor(sign) {
        super(sign);
        this.canProvideAhead = true;
        this.canProvideBehind = true;
    }
}

class Num extends Real {}

class Const extends Real {
    aheadHooks(nextExpr, addFunc) {
        if (nextExpr instanceof Real) {
            addFunc(new Binary('*'));
        }
    }

    getDisplay() {
        if (this.sign === 'pi') return 'π';
        return this.sign;
    }
}

export { Real, Num, Const };