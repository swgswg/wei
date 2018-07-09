/**
 * 加法计算，用来得到精确的加法结果
 * @param {number} 
 * @param {number}
 * @return { number} 相加结果
 */
function calcAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

/**
 * 减法计算，用来得到精确的减法结果
 * @param {number} 
 * @param {number}
 * @return { number} 相减结果
 */
function calcReduce(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 乘法函数，用来得到精确的乘法结果
 * @param {number} 
 * @param {number}
 * @return { number} 相乘结果
 */
function calcMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try { m += s1.split(".")[1].length; } catch (e) { }
    try { m += s2.split(".")[1].length; } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

function calcSub(arg1, arg2){
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = (1 * arg1).toString().split(".")[1].length; }catch (e) {}
    try { t2 = (1 * arg2).toString().split(".")[1].length; }catch (e) {}
    r1 = Number((1 * arg1).toString().replace(".", ""));
    r2 = Number((1 * arg2).toString().replace(".", ""));
    var ss = (r1 / r2) * Math.pow(10, t2 - t1);
    return Math.round(ss * 100) / 100;
}

/**
 * 处理金额的小数问题
 *  @param {number/string}
 *  @return { string} 
 */
function dealMoney(money){
    res = money.toString();
    res = res.split('.');
    if( typeof(res[1]) === 'undefined' ){
        // 没有小数
        res.push('00');
    } else if(res[1].length == 1){
        // 有一个小数
        res[1] = res[1] + '0';
    }
    return res.join('.');
}

module.exports = {
    calcAdd: calcAdd,
    calcReduce: calcReduce,
    calcMul: calcMul,
    calcSub: calcSub,
    dealMoney: dealMoney
}