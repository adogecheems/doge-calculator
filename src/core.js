import { Dot, RightParen, Controller, Start, ImplicitRightParen } from './expr/struct.js';
import { Num } from './expr/real.js';
import { AutoMinus, Binary, Prefix } from './expr/op.js';
import { Power } from './expr/macro.js';

import { create, all } from 'mathjs';

const math = create(all, {
  number: 'number',
  precision: 64,
});

const _sin = math.sin;
const _cos = math.cos;
const _tan = math.tan;
const _asin = math.asin;
const _acos = math.acos;
const _atan = math.atan;
const degToRad = (x) => math.divide(math.multiply(x, math.pi), 180);
const radToDeg = (x) => math.divide(math.multiply(x, 180), math.pi);

// 这个类是计算器的核心，负责管理表达式的输入、验证、处理和计算，以及单位系统的切换和反函数状态的维护。它通过 math.js 库进行实际的数学计算，并且通过表达式对象的钩子机制来实现输入的合法性检查和必要的转换。
export default class CalculatorCore {
    constructor() {
        this.exprs = [];
        this.unit = 'rad'; // 'deg' 或 'rad'
        this.isInv = false; // 是否处于反函数状态
        this.result = null; // 计算结果
        this.parensStack = []; // 括号栈
        this.isDotActive = false; // 小数点是否激活

        this._patchUnit();
    }

    warmUp() {
        math.evaluate("1 + 1"); // 预热 math.js，避免首次调用时的性能问题
    }

    _patchUnit() {
        math.import({ // 根据当前单位系统包装三角函数，使其支持度数输入
            sin: x => _sin(this.unit === 'deg' ? degToRad(x) : x),
            cos: x => _cos(this.unit === 'deg' ? degToRad(x) : x),
            tan: x => { // 处理 tan 在某些角度（如 90°）的定义域问题
                let angle = this.unit === 'deg' ? degToRad(x) : x;
                let cosv = _cos(angle);

                if (Math.abs(Number(cosv)) < 1e-12) {
                    throw new Error('tan undefined');
                }

                return _tan(angle);
            },
            asin: x => (this.unit === 'deg' ? radToDeg(_asin(x)) : _asin(x)),
            acos: x => (this.unit === 'deg' ? radToDeg(_acos(x)) : _acos(x)),
            atan: x => (this.unit === 'deg' ? radToDeg(_atan(x)) : _atan(x)),
        }, { override: true });
    }

    inv() {
        this.isInv = !this.isInv; // 切换反函数状态（事实上只是一个愚蠢的UI耦合）
    }

    toggleUnit() {
        this.unit = this.unit === 'rad' ? 'deg' : 'rad';
        this._patchUnit(); // 切换单位系统时重新包装三角函数
    }

    input(expr) {
        this.result = null;

        if (expr instanceof Controller) {
            switch (expr.getExpr()) { // 处理控制类输入
                case 'clear':
                    this.clearExprs();
                    return;
                case 'remove':
                    this.rmExpr();
                    return;
                case 'unit-toggle':
                    this.toggleUnit();
                    return;
                case 'inverse':
                    this.inv();
                    return;
            }
        }

        let lastExpr = this.getLastExpr(); // 获取当前表达式的最后一个元素，以便进行合法性检查和必要的转换

        if (!this.validateExpr(lastExpr, expr)) { return; }

        this.processExpr(lastExpr, expr); // 处理输入的表达式，根据上下文进行必要的转换（如自动负号、隐式括号等），并将其添加到表达式列表中
        console.log(this.getExprs());
    }

    getLastExpr() {
        return this.exprs[this.exprs.length - 1] || new Start(); // 如果表达式列表为空，返回一个特殊的 Start 对象，表示表达式的开始状态
    }

    validateExpr(lastExpr, expr) {
        if (
            (lastExpr.willLookAhead && !expr.canProvideBehind) ||
            (expr.willLookBehind && !lastExpr.canProvideAhead) || // 检查当前输入的表达式是否与前一个表达式在语法上兼容（如数字后不能直接跟另一个数字，运算符后必须跟数字或括号等）
            (expr instanceof RightParen && this.parensStack.length === 0) || // 检查右括号是否与最近的左括号匹配
            (expr instanceof ImplicitRightParen && this.parensStack[this.parensStack.length - 1] !== '{') || // 检查隐式右括号是否与最近的隐式左括号（事实上只有根号才会添加一个耦合的隐式左括号）匹配
            (expr instanceof Dot && !(lastExpr instanceof Num)) ||
            (lastExpr instanceof Dot && !(expr instanceof Num)) || // 小数点必须连接在数字之间
            (this.isDotActive && (expr instanceof Dot)) || // 小数点不能连续输入
            (lastExpr.sign === '-' && (expr instanceof AutoMinus)) || // 禁止输入连续的负号以避免歧义
            ((lastExpr instanceof Power) && (expr instanceof Power)) // 禁止连续输入幂运算符以避免歧义
        ) { return false; }

        return true;
    }

    processExpr(lastExpr, expr) {
        if (this.isDotActive && !(expr instanceof Num)) { this.isDotActive = false; } // 如果小数点激活但当前输入不是数字，则取消小数点的激活状态

        if (expr instanceof AutoMinus) {
            if (lastExpr.willLookAhead) {
                expr = new Prefix('-');
            } else {
                expr = new Binary('-');
            }
        } // 处理自动负号：如果当前输入是一个自动负号，根据上下文决定它是一个前缀运算符（如在表达式开头或在另一个运算符后）还是一个二元运算符（如在数字后）。这有助于用户更自然地输入负数。

        if (this.parensStack[this.parensStack.length - 1] === '{' && lastExpr.canProvideAhead && !(expr instanceof Num)) {
            let c = 0;
            while (this.parensStack[this.parensStack.length - c - 1] === '{') { c++ }
            while (c > 0) {
                this.addExpr(new ImplicitRightParen());
                c--;
            }
        } // 处理隐式括号：如果当前输入的表达式前面有一个或多个未闭合的隐式左括号（如根号），并且当前输入的表达式可以合法地跟在这些隐式左括号后面（如数字、函数等），则自动添加相应数量的隐式右括号来闭合这些隐式左括号。这使得用户在输入根号等函数时不必手动输入括号，提升了输入的便捷性。

        this.addExpr(expr);
    }

    addExpr(expr) {
        let lastExpr = this.getLastExpr();

        lastExpr.aheadHooks(expr, this.addExpr.bind(this));
        expr.behindHooks(lastExpr, this.addExpr.bind(this));
        // 在将当前输入的表达式添加到表达式列表之前，先调用前一个表达式的 aheadHooks 和当前表达式的 behindHooks。
        // 这些钩子函数可以根据上下文对输入的表达式进行合法性检查和必要的转换（如自动负号、隐式括号等）。
        // 如果钩子函数需要修改输入的表达式或添加新的表达式，可以通过传入的 addExpr 函数来实现。

        this.exprs.push(expr);
        expr.addHooks(this);
    }


    rmExpr() {
        if (this.exprs.length === 0) return;

        let expr = this.exprs.pop();

        expr.removeHooks(this); // 在将当前表达式从表达式列表中移除之前，先调用它的 removeHooks 来撤销它对计算器状态的影响（如括号栈、小数点状态等）
        if (this.getLastExpr() instanceof ImplicitRightParen) { this.rmExpr(); }
        // 如果移除一个表达式后，新的最后一个表达式是一个隐式右括号，则继续移除它。这是因为隐式右括号是自动添加的，不应该单独存在。
    }

    clearExprs() {
        this.exprs = [];
        this.parensStack = [];
        this.isDotActive = false;
    }

    getExprs() {
        // 将当前的表达式列表转换成一个字符串，以便传递给 math.js 进行计算。这个函数会将每个表达式对象的 getExpr 方法返回的字符串连接起来，并在末尾添加与 parensStack 中未闭合的括号数量相对应的右括号，以确保表达式的完整性。
        return this.exprs.map(expr => expr.getExpr()).join('') + ')'.repeat(this.parensStack.length);
    }

    evaluate() {
        // 该方法负责计算当前表达式的结果。
        // 如果求值成功，它会将结果转换成一个适合显示的字符串存储在 this.result 中，并返回 true；
        // 如果求值过程中发生错误（如语法错误、定义域错误等），它会将 this.result 设置为一个表示错误的字符串，并返回 false。
        // 在进行计算之前，先检查当前表达式的最后一个元素是否在语法上需要一个后续表达式来完成（如数字后必须跟运算符，函数名后必须跟括号等）。如果需要但没有，则返回 null，表示当前表达式不完整，无法计算。

        const EPS = 1e-12; // 定义一个小的阈值，用于处理数值计算中的精度问题，如判断一个数是否接近于零或一个整数。

        let lastExpr = this.getLastExpr();
        if (lastExpr.willLookAhead) {
            return null;
        } // 

        let exprsStr = this.getExprs(); // 获取当前表达式的字符串表示，并将其传递给 math.js 进行计算。这个字符串表示已经包含了必要的括号来确保表达式的完整性。

        try {
            let num = Number(math.evaluate(exprsStr));

            if (Number.isNaN(num)) {
                this.result = '不合法的计算';
                return false;
            } // 如果计算结果是 NaN，则表示输入的表达式在数学上不合法（如 0 除以 0、负数的平方根等）。

            if (!Number.isFinite(num)) {
                this.result = '定义域错误';
                return false;
            } // 如果计算结果是无穷大或负无穷大，则表示输入的表达式在实数范围内没有定义。

            if (Math.abs(num) < EPS) {
                num = 0;
            } // 如果计算结果的绝对值小于一个小的阈值，则将其视为零。这是为了避免由于数值计算中的精度问题而得到一个非常小的非零数。

            let nearestInt = Math.round(num);
            if (Math.abs(num - nearestInt) < EPS) {
                num = nearestInt;
            } // 如果计算结果与它的最近整数之间的差的绝对值小于一个小的阈值，则将计算结果视为这个整数。这是为了避免由于数值计算中的精度问题而得到一个非常接近整数但不完全等于整数的数。

            if (!Number.isFinite(num) || Number.isNaN(num)) {
                this.result = '不合法的计算';
                return false;
            } // 兜底操作，如果计算结果仍然是无穷大、负无穷大或 NaN，则表示输入的表达式在数学上不合法。

            if (Number.isInteger(num)) {
                this.result = num.toString();
            } else {
                this.result = num
                    .toPrecision(12)
                    .replace(/(\.\d*?[1-9])0+$/, '$1')
                    .replace(/\.0+$/, '');
            }
            // 将计算结果转换成一个适合显示的字符串。
            // 如果结果是一个整数，则直接转换成字符串；
            // 如果结果是一个小数，则使用 toPrecision(12) 来限制其有效数字，并通过正则表达式去掉末尾多余的零和小数点。

            return true;

        } catch (e) {
            this.result = '定义域错误';
            return false; // 如果在计算过程中发生任何错误（如语法错误、定义域错误等），将 this.result 设置为一个表示错误的字符串，并返回 false。
        }
    }

    getDisplay() {
        if (this.result !== null) {
            return this.result;
        }

        return this.exprs.map(expr => expr.getDisplay()).join('');
    }
}