const EXAMPLE_MATRIX = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];

const calculateDiagonalDifference = (matrix) => {
    let sumOfDiagonal1 = 0;
    let sumOfDiagonal2 = 0;

    for (let rows = 0; rows < matrix.length; rows++) {
        for (let cols = 0; cols < matrix[rows].length; cols++) {
            if (rows == cols) {
                sumOfDiagonal1 += matrix[rows][cols];
                sumOfDiagonal2 += matrix[rows][matrix.length - 1 - cols];

                break;
            };
        }
    }

    return sumOfDiagonal1 - sumOfDiagonal2;
}

const init = () => {
    console.log(calculateDiagonalDifference(EXAMPLE_MATRIX));
}

init();