const EXAMPLE_SENTENCE = "Saya sangat senang mengerjakan soal algoritma";

const longestWord = (sentence) => {
    if (typeof sentence != "string") throw new Error("Invalid value for parameter 1 it should be a string");

    const words = sentence.split(' ');

    let currentLongestWord = '';

    for (const word of words) {
        if (word.length > currentLongestWord.length) currentLongestWord = word
    }

    return `${currentLongestWord}: ${currentLongestWord.length} character`;
}

const init = () => {
    console.log(longestWord(EXAMPLE_SENTENCE));
}

init();