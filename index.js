const rows = 5;
const columns = 5;
const length = 8;

const generateParent = (length) => {
    const temp = [];
    for (let i = 1; i <= length; i++) {
        temp.push(i);
    }
    return temp;
}

const generateRandomFitnessValues = (length) => {
    const temp = [];
    for (let i = 1; i <= length; i++) {
        temp.push(Math.random());
    }
    return temp;
}

const generateFitness = (rows, columns, length) => {
    let temp = [];
    for (let i = 0; i < rows; i++) {
        temp[i] = [];
        for (let j = 0; j < columns; j++) {
            temp[i][j] = [];
            let items = generateRandomFitnessValues(length);
            for (let y = 0; y < length; y++) {
                temp[i][j].push(random(items));
            }
        }
    }
    return temp;
}

const generateSpatialPopulation = (rows, columns, length) => {
    let temp = [];
    for (let i = 0; i < rows; i++) {
        temp[i] = [];
        for (let j = 0; j < columns; j++) {
            temp[i][j] = [];
            let items = generateParent(length);
            for (let y = 0; y < length; y++) {
                temp[i][j].push(random(items));
            }
        }
    }
    return temp;
}

const random = (items) => {
    const index = Math.floor(Math.random() * items.length);
    return items.splice(index, 1)[0];
}

const randomWithin = (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
}

const printPopulation = (population) => {
    for (let i = 0; i < population.length; i++) {
        console.log(population[i].join(', '));
    }
}

const getSelectedNeighbourhood = (population, fitness) => {
    const rowIndex = randomWithin(0, rows - 1);
    const columnIndex = randomWithin(0, columns - 1)
    const self = getElement(population, fitness, rowIndex, columnIndex);
    const topLeft = getElement(population, fitness, rowIndex - 1, columnIndex - 1);
    const topCenter = getElement(population, fitness, rowIndex - 1, columnIndex);
    const topRight = getElement(population, fitness, rowIndex - 1, columnIndex + 1);
    const right = getElement(population, fitness, rowIndex, columnIndex + 1);
    const left = getElement(population, fitness, rowIndex, columnIndex - 1);
    const bottomLeft = getElement(population, fitness, rowIndex + 1, columnIndex - 1);
    const bottomCenter = getElement(population, fitness, rowIndex + 1, columnIndex);
    const bottomRight = getElement(population, fitness, rowIndex + 1, columnIndex + 1);

    const fitnessSum = [
        [ topLeft.fitness, topCenter.fitness, topRight.fitness ],
        [ left.fitness, self.fitness, right.fitness ],
        [ bottomLeft.fitness, bottomCenter.fitness, bottomRight.fitness ]
    ];

    const coordinateStats = getFitnessStats(fitnessSum)

    return {
        coordinates: {
            x: columnIndex,
            y: rowIndex,
        },
        neighbourhood: [
            [ topLeft.item, topCenter.item, topRight.item ],
            [ left.item, self.item, right.item ],
            [ bottomLeft.item, bottomCenter.item, bottomRight.item ]
        ],
        fitness: fitnessSum,
        fitness_stats: coordinateStats
    }
}

const getElement = (items, fitness, row, column) => {
    const fit = isDefined(fitness, row, column);
    const totalFitness = arraySum(fit);
    return {
        item: isDefined(items, row, column).join(','),
        fitness: totalFitness
    }
}

const isDefined = (item, row, column) => {
    if (item[row]) {
        if (item[row][column]) {
            return item[row][column];
        }
    }

    return [];
}

const arraySum = (items) => {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += items[i];
    }
    return sum;
}

const getFitnessStats = (fitness) => {
    let max = fitness[0][0];
    let min = fitness[0][0];
    let bestCoordinate = [0,0];
    let worstCoordinate = [0,0];
    for (let i = 0; i < fitness.length; i++) {
        for (let j = 0; j < fitness[i].length; j++) {
            if (max < fitness[i][j]) {
                max = fitness[i][j];
                bestCoordinate = [i,j];
            }

            if (min > fitness[i][j]) {
                min = fitness[i][j];
                worstCoordinate = [i,j];
            }
        }
    }

    return {
        best: {
            row: bestCoordinate[0],
            column: bestCoordinate[1],
        },
        worst: {
            row: worstCoordinate[0],
            column: worstCoordinate[1],
        }
    };
}

const fitness = generateFitness(rows, columns, length);
const population = generateSpatialPopulation(rows, columns, length);

console.log(printPopulation(population));

const parent1 = getSelectedNeighbourhood(population, fitness);
const parent2 = getSelectedNeighbourhood(population, fitness);

console.log(parent1)
console.log(parent2)

