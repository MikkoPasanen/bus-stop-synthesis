/**
 *
 * @param {String} str - String which's word order is to be reversed
 * @returns String with reversed world order
 */
const reverseWordOrder = (str) => {
    let currentWord = "";
    let reversedString = "";
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) == " ") {
            reversedString = currentWord + " " + reversedString;
            currentWord = "";
        } else {
            currentWord += str.charAt(i);
        }
    }
    return currentWord + " " + reversedString;
};

export default reverseWordOrder;
