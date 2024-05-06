//create html elements
let title = document.createElement(`h1`);
title.innerHTML = `<b>Flipping a Matrix Along a Diagonal<b/>`;

let page = document.createElement(`div`);
page.setAttribute(`class`, `page`);

let originalMatrixTitle = document.createElement(`h2`);
originalMatrixTitle.innerText = `Original Matrix`;

let flippedMatrixTitle = document.createElement(`h2`);
flippedMatrixTitle.innerText = `Flipped Matrix`;

let makeNewMatrix = (n) => {
    let matrix = [];
    let counter = 1;

    for (let row = 0; row < n; row++) {
        const tableRow = Array.from({ length: n }, () => counter++);
        matrix.push(tableRow);
    }

    return matrix;
};


let swap =  (matrix) => {
    let n =  matrix.length -1;
    for (let row = 0 ;row < n; row++){
        for (let column = 0; column < n - row; column++) {
            //swapping cells
            let temp = matrix[n - row][n - column];
            matrix[n - row][n - column] = matrix[row][column];
            matrix[row][column] = temp;
        }
    }
    return matrix;
};

let makeNewTable =  (matrix) => {
    let table = document.createElement(`table`);

    for (let row = 0 ;row < matrix.length; row++){
        let tr = table.insertRow();//create new table row

        for (let column = 0; column < matrix.length; column++)
        {
            let td = tr.insertCell(); //create a new cell

            if(column === (matrix.length-1 - row)){
                td.setAttribute(`class`, `diagonal`);
            }
            td.innerText = matrix[row][column]; //add the value
        }
    }
    return table;
};

window.onload = () => {

    let validInput = false;

    while(!validInput){
        let input = window.prompt(`Input your matrix size`);

        //check for valid input
        if(!isNaN(parseInt(input)) && parseInt(input) > 1){
            validInput = true;
            let matrix = makeNewMatrix(input);

            document.body.appendChild(title);
            document.body.appendChild(page);
            page.appendChild(originalMatrixTitle);
            page.appendChild(makeNewTable(matrix));

            let promise = new Promise(function(resolve) {
                swap(matrix);
                page.appendChild(flippedMatrixTitle);
                resolve(matrix);
            });

            //complete the swapped matrix
            promise.then((matrix) => {
                page.appendChild(makeNewTable(matrix));
            });

        }else{
            alert(`Please enter a integer value greater than 1`);
        }
    }
};
