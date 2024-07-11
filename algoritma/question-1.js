const EXAMPLE_WORD = "NEGIE1";

const reverseCharsOfWord = (word) => {
    if (typeof word != 'string') throw new Error('Invalid value for parameter 1 it should be a string');

    const chars = word.split("");

    const [alphabets, numbers] = [
        chars.filter((char) => !Number(char)),
        chars.filter((char) => Number(char))
    ];

    let reversedAlphabets = "";

    for (let i = 0; i < alphabets.length; i++) {
        reversedAlphabets += alphabets[alphabets.length - 1 - i];
    }

    return reversedAlphabets + numbers.toString();
}

const init = () => {
    console.log(reverseCharsOfWord(EXAMPLE_WORD));
}

init();