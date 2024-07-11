const EXAMPLE_INPUT = ['xc', 'dz', 'bbb', 'dz'];
const EXAMPLE_QUERY = ['bbb', 'ac', 'dz'];

const countOccurrences = (input, query) => {

    if (!Array.isArray(input)) throw new Error("Invalid value for parameter 1 it should be an array");
    if (!Array.isArray(query)) throw new Error("Invalid value for parameter 2 it should be an array");

    let output = [];

    for (let i = 0; i < query.length; i++) {
        const queryWord = query[i];

        let matchingWordSum = 0;

        for (let inputWord of input) if (inputWord == queryWord) matchingWordSum += 1;

        output.push(matchingWordSum);
    }

    return output;
}

const init = () => {
    console.log(countOccurrences(EXAMPLE_INPUT, EXAMPLE_QUERY));
}

init();