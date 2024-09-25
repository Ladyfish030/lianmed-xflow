export default function arabicToRoman(num) {
    // 定义罗马数字映射
    const romanNumeral = [
        ["M", 1000],
        ["CM", 900],
        ["D", 500],
        ["CD", 400],
        ["C", 100],
        ["XC", 90],
        ["L", 50],
        ["XL", 40],
        ["X", 10],
        ["IX", 9],
        ["V", 5],
        ["IV", 4],
        ["I", 1]
    ];

    // 检查输入是否为正整数
    if (typeof num !== 'number' || num < 1 || num > 3999 || num % 1 !== 0) {
        return -1;
    }

    let result = "";
    for (const [numeral, value] of romanNumeral) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }
    return result;
}
