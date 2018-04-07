$(document).ready(() => {

    var individualSize;
    var generationSize;
    var populationSize;

    var generation = [];
    var newGeneration = [];
    var population = [];

    var displacement = 15;

    /**
     * Each individual in generation is made of Square class elements 
     */
    class Square {
        constructor(x, y, r, g, b) {

            this.r = r
            this.g = g
            this.b = b
            this.color = "rgb( " + r + ", " + g + ", " + b + " )"

            this.x = x
            this.y = y

            this.width = 25
            this.height = 25

        }
    }

    /**
     * Each generation is made of Individual class elements 
     */
    class Individual {
        constructor(squaresArr) {
            this.squares = squaresArr
            this.mark = 0

            this.getIndividualInfo = (squaresArr, mark) => {
                console.log("Elements of individual: " + squaresArr)
                console.log("Mark: " + mark)
            }

            this.changeColor = (newColorSquares) => {
                for (let i = 0; i < this.squares.length; i++) {
                    this.squares[i].r = newColorSquares[i].r
                    this.squares[i].g = newColorSquares[i].g
                    this.squares[i].b = newColorSquares[i].b
                    this.squares[i].color = "rgb( " + newColorSquares[i].r + ", " + newColorSquares[i].g + ", " + newColorSquares[i].b + " )"
                }
            }

            // color is changed in one, random square
            this.mutateColor = () => {
                var indexOfMutatedSquare = Math.floor(Math.random() * this.squares.length);
                // console.log("before mutation: " + this.squares[indexOfMutatedSquare].color)

                this.squares[indexOfMutatedSquare].r = (Math.round(Math.random() * 255))
                this.squares[indexOfMutatedSquare].g = (Math.round(Math.random() * 255))
                this.squares[indexOfMutatedSquare].b = (Math.round(Math.random() * 255))
                this.squares[indexOfMutatedSquare].color = "rgb( " + this.squares[indexOfMutatedSquare].r + ", " + this.squares[indexOfMutatedSquare].g + ", " + this.squares[indexOfMutatedSquare].b + " )"

                // console.log("after mutation: " + this.squares[indexOfMutatedSquare].color)
            }
        }
    }

    /**
     * Creation of new individual.
     * Starting point (x,y) for first element is chosen randomly.
     * Then next squares are created according to grammatical rules (rule number is chosen randomly).
     * Each element (square) has different color.
     */
    function createIndividual() {
        var squaresArr = []
        var indexOfRandomSquare;
        var mySquare;
        var newSquare;

        var x = (Math.round(Math.random() * 10 + 100));
        var y = (Math.round(Math.random() * 10 + 100));

        var r = 0;
        var g = 0;
        var b = 0;

        var ruleNumber = 0;

        while (squaresArr.length < individualSize) {

            r = (Math.round(Math.random() * 255));
            g = (Math.round(Math.random() * 255));
            b = (Math.round(Math.random() * 255));

            if (squaresArr.length == 0) {
                mySquare = new Square(x, y, r, g, b)
                squaresArr.push(mySquare)

            } else if (squaresArr.length > 0) {
                indexOfRandomSquare = Math.floor(Math.random() * squaresArr.length);
                mySquare = squaresArr[indexOfRandomSquare]
                ruleNumber = Math.floor(Math.random() * 4)

                x = getNewCoordinates(ruleNumber, mySquare.x, mySquare.y).x
                y = getNewCoordinates(ruleNumber, mySquare.x, mySquare.y).y

                newSquare = new Square(x, y, r, g, b)
                squaresArr = addElementToIndividual(newSquare, squaresArr)

                // console.log("Rozmiar squaresArr:\t" + squaresArr.length)
            } else {
                console.log("Bledna ilosc elementow osobnika: " + squaresArr.length)
            }
        }

        return new Individual(squaresArr) // zwraca nowego osobnika
    }

    /**
     * Function returns new coordinates for square according to given rule number
     * @param {number} ruleNumber 
     * @param {number} x 
     * @param {number} y 
     */
    function getNewCoordinates(ruleNumber, x, y) {
        var x = x;
        var y = y;

        switch (ruleNumber) {
            case 0:     // prawy gorny
                x = displacement + x;
                y = (-1) * displacement + y;
                break;
            case 1:     // prawy dolny
                x = displacement + x;
                y = displacement + y;
                break;
            case 2:     // lewy dolny
                x = (-1) * displacement + x;
                y = displacement + y;
                break;
            case 3:     // lewy gorny 
                x = (-1) * displacement + x;
                y = (-1) * displacement + y;
                break;
            default:
                console.log("Wrong rule! (cannot be: -1 <= ruleNumber >= 4). RN: " + ruleNumber)
                break;
        }

        return {
            x: (() => { return x; })(),
            y: (() => { return y; })()
        }
    }

    /**
     * Function prevents adding repeated square.
     * If square is not repeated - it is added to an array of individual elements.
     * If is repeated - array of elements is not changed.
     * @param {Square} sq - single square
     * @param {array[Square]} squaresArr - array of individual elements (squares)
     */
    function addElementToIndividual(sq, squaresArr) {
        var isOK = true;
        squaresArr.forEach(square => {
            if (square.x == sq.x && square.y == sq.y) {
                // console.log("Square repeated!");
                isOK = false;
            }
        })
        if (isOK) { squaresArr.push(sq) }
        return squaresArr
    }


    /**
     * Function creates as much individuals as generationSize.
     * Returns generation (array of individuals)
     */
    function createFirstGeneration() {
        var individual;
        var generation = []

        for (let i = 0; i < generationSize; i++) {

            individual = createIndividual()
            generation.push(individual)
        }
        return generation
    }

    /**
     * Function evaluates square color.
     * The more green square, the higher mark. 
     * @param {Square} square - evaluated element 
     */
    function evaluateSingleSquareColor(square) {

        var colorMark = 0;

        if (square instanceof Square) {

            if (square.r > 0 && square.r < 125) { colorMark -= (80 + (Math.round(square.r / 10))) } else { colorMark -= square.r }
            if (square.b > 0 && square.b < 125) { colorMark -= (80 + (Math.round(square.b / 10))) } else { colorMark -= square.b; }

            if (square.g > 150 && square.g < 255) { colorMark += 300 + (Math.round(square.g / 10)) } else { colorMark += square.g; }

        } else {
            console.log("NOT Square object ");
            console.log(square);
        }

        return colorMark;
    }

    /**
     * Function evaluates whole figure (Individual instance)
     * @param {Individual} individual - evaluated figure
     */
    function evaluateFigure(individual) {

        if (individual instanceof Individual) {
            individual.squares.forEach(square => {
                individual.mark += evaluateSingleSquareColor(square); // ocena koloru z kazdego elementu figury
            });
            return individual.mark;

        } else {
            console.log("NOT Individual object ");
            console.log(individual);
            return 0;
        }
    }


    /**
     * Function eliminates individuals with lowest mark.
     * @param {array[Individual]} generation 
     */
    function eliminate(generation) {
        var removeElemNum;
        if (generation != undefined && generation.length != 0) {
            // console.log("Elimination start. Generation size: ", generation.length);

            removeElemNum = Math.round(generation.length / 2); // ~50% of generation is removed
            // console.log("Individuals to remove: " + (generation.length - removeElemNum));

            generation.sort(function (a, b) {
                return parseInt(b.mark) - parseInt(a.mark); 	// sort by mark ASCENDING
            });

            generation.splice(removeElemNum, removeElemNum)
            // console.log("Individuals after elimination: " + generation.length)

        } else {
            console.log("generation unknown/bad")
        }
        return generation
    }

    /**
     * Function responsible for crossing individuals in given generation.
     * 1st individual with 2nd indiwidual, 3rd ind. with 4th etc.
     * Returns new individuals (form 2 parents there are 4 children) in newGeneration array.
     * 
     * @param {array[Individual]} generation 
     */
    function crossing(generation) {
        var newGeneration = []
        if (generation != undefined && generation.length != 0) {

            for (let i = 1; i <= generation.length; i += 2) {

                // pair of Individual objects
                let parent1;
                let parent2;

                if (generation.length % 2 == 0) {
                    parent1 = generation[i - 1];
                    parent2 = generation[i];
                } else {
                    if (i < generation.length - 1) {
                        parent1 = generation[i - 1];
                        parent2 = generation[i];
                    } else if (i == generation.length) { // last individual crossed with himself
                        parent1 = generation[i - 1];
                        parent2 = generation[i - 1];
                    }
                }

                newGeneration = newGeneration.concat(createChild(parent1, parent2))
            }

            return newGeneration
        } else {
            console.log("generation unknown/bad")
            return 0
        }
    }

    /**
     * Returns array of children form each pair of Individuals
     * @param {Individual} parent1 
     * @param {Individual} parent2 
     */
    function createChild(parent1, parent2) {

        var childrenArr = []
        var squares1 = parent1.squares
        var squares2 = parent2.squares
        var numberOfChildren = 4;

        var sqaresArrForChild = [] // heird squares
        var newIndividual;

        var randomIndex = 0 // losujemy indeksy kwadratow dla dziecka
        var parentNum = 0

        var squareOld, squareNew;

        // sort by color (from most green squares)
        squares1.sort((a, b) => { return parseInt(b.g) - parseInt(a.g); });
        squares2.sort((a, b) => { return parseInt(b.g) - parseInt(a.g); });


        for (let i = 0; i < numberOfChildren; i++) {

            // crossing parents
            while (sqaresArrForChild.length < individualSize) {

                // random parent
                parentNum = (Math.floor(Math.random() * 1))

                // random square in parent
                randomIndex = (Math.floor(Math.random() * (individualSize - 1)))

                // get random square from chosen parent
                if (parentNum == 0) { sqaresArrForChild.push(squares1[randomIndex]) }
                else { sqaresArrForChild.push(squares2[randomIndex]) }
            }


            // create new individual from heird squares 
            newIndividual = createIndividual()
            newIndividual.changeColor(sqaresArrForChild) // correct colors


            // rare mutation

            if (Math.floor(Math.random() * (100)) >= 99) {
                newIndividual.mutateColor() // mutate one square element
                console.log("mutation")
            }

            childrenArr.push(newIndividual)
        }

        // array of 4 children from 2 parents
        return childrenArr
    }

    /**
     * Evolution of given generation.
     * Returns new generation
     * @param {array[Individual]} generation 
     */
    function evolve(generation) {
        var newGeneration = []

        if (generation != undefined && generation.length != 0) {

            generation.forEach(individual => { evaluateFigure(individual) })

            generation = eliminate(generation);

            newGeneration = crossing(generation)

            newGeneration.forEach(individual => { individual.mutateColor() })

            population.push(newGeneration)

            return newGeneration
        } else {
            console.log("generation unknown/bad")
            return 0
        }
    }

    function generatePopulation() { 
        while (population.length < populationSize - 1) {

            if (population.length == 0) {
                generation = createFirstGeneration();
                population.push(generation)
            } else {
                newGeneration = evolve(generation)

                population.push(newGeneration)

                generation = newGeneration

            }

        }
    }


    /**
     * Draw last generation
     */
    function draw() {
        d3.select("#population")
            .selectAll("div")
            .data([1])
            .enter()
            .append("div")
            .attr("class", function (d) { return "generation"; })

        d3.select(".generation")
            .selectAll("svg")
            .data(population[population.length - 1])
            .enter()
            .append("svg")
            .attr("class", function (d) { return "individual"; })
            .attr("width", function (d) { return 200; })
            .attr("height", function (d) { return 250; })


            .selectAll(".individual")
            .select("rect")
            .data(function (d, i) { return d.squares; })
            .enter()
            .append("rect")
            .attr("fill", function (d) { return d.color; })
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("width", function (d) { return d.width; })
            .attr("height", function (d) { return d.height; })
            // .on("click", function (d) { return d.getProperties(d.x, d.y, d.color) })




        // /** all generations one by one */

        //         d3.select("#population")
        //             .selectAll("div")       // okreslamy do ktorych elementow bedziemy dolaczac dane
        //             .data(population)       // Metoda data(data) wykonuje pętlę po tablic umieszczonej wewnątrz funkcji
        //             .enter()                // Aby stworzyć nowy element musimy użyć metody enter. Ta metoda patrzy na  nasze obecne zaznaczenie  i dane jakie posiadamy, zwraca miejsce w którym element ma się pojawić.
        //             .append("div")          // dodaje nowy  element
        //             .attr("class", function (d) { return "generation"; })
        //             .attr("width", function (d) { return 900; })
        //             .attr("height", function (d) { return 900; })


        //         d3.selectAll(".generation")
        //             .selectAll("svg")
        //             .data(function (d, k) { return d; }) // generation[i]   ////////////////
        //             .enter()
        //             .append("svg")
        //             .attr("class", function (d) { return "individual"; })
        //             .attr("width", function (d) { return 200; })
        //             .attr("height", function (d) { return 200; })


        //             .selectAll(".individual")
        //             .select("rect")
        //             .data(function (d, i) { return d.squares; }) // d is lastGeneration[i] kazdy osobnik (jego kwadraty)
        //             .enter()
        //             .append("rect")
        //             .attr("fill", function (d) { return d.color; })
        //             .attr("x", function (d) { return d.x; })
        //             .attr("y", function (d) { return d.y; })
        //             .attr("width", function (d) { return d.width; })
        //             .attr("height", function (d) { return d.height; })
        //            // .on("click", function (d) { return d.getProperties(d.x, d.y, d.color) })

    }

    /**
     * "Start" button:
     *  - set parameters
     *  - clean area
     *  - clean population array
     *  - generate population
     *  - draw last generation
     */
    $("#generateBtn").click(function () {
        individualSize = $("#individualSize").val();
        generationSize = $("#generationSize").val();
        populationSize = $("#populationSize").val();


        $(".generation").empty();
        population = []

        generatePopulation()

        draw()
        // console.log("Populacja: ")
        // console.log(population)
    })


});

