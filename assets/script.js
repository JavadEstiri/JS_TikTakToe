var player = 'X'; // X or O

const getCurrentState = () => {

    var temp = [['', '', ''], ['', '', ''], ['', '', '']];

    temp[0][0] = document.getElementById('b11').innerText;
    temp[0][1] = document.getElementById('b12').innerText;
    temp[0][2] = document.getElementById('b13').innerText;
    temp[1][0] = document.getElementById('b21').innerText;
    temp[1][1] = document.getElementById('b22').innerText;
    temp[1][2] = document.getElementById('b23').innerText;
    temp[2][0] = document.getElementById('b31').innerText;
    temp[2][1] = document.getElementById('b32').innerText;
    temp[2][2] = document.getElementById('b33').innerText;

    return temp;
}

var getPlayerMoves = () => {
    var temp = getCurrentState();

    for (var i = 0; i < temp.length; i++) {
        for (var j = 0; j < 3; j++) {
            if (temp[i][j] !== player)
                temp[i][j] = '';
        }
    }

    return temp;

}

var resetBoard = () => {

    document.getElementById('b11').innerText = '';
    document.getElementById('b12').innerText = '';
    document.getElementById('b13').innerText = '';
    document.getElementById('b21').innerText = '';
    document.getElementById('b22').innerText = '';
    document.getElementById('b23').innerText = '';
    document.getElementById('b31').innerText = '';
    document.getElementById('b32').innerText = '';
    document.getElementById('b33').innerText = '';
}

const changePlayer = () => {
    if (player === 'X')
        player = 'O';
    else
        player = 'X';
}

const checkIdValidity = (id) => {
    if (id !== undefined && id !== null) {
        if (id.length === 3)
            return true;
        else return false;
    }
    else return false;
}

const disableForm = () => {
    document.getElementById('disabled').style.zIndex = 2
}

const enableForm = () => {
    document.getElementById('disabled').style.zIndex = 0
}

const updateboard = (element) => {

    let id = element.id.substring(1);

    // Insert Data
    element.innerText = player;
}


const setWinner = (type) => {
    console.log('we have a winner : ' + type);
}

const checkForWin = () => {
    var playerMoves = getPlayerMoves();

    if (playerMoves === undefined)
        console.log('Error on Getting Player Moves');
    //else console.log(playerMoves,player);

    if (playerMoves[0][0] === player && playerMoves[0][1] === player && playerMoves[0][2] === player)
        setWinner(1);

    if (playerMoves[1][0] === player && playerMoves[1][1] === player && playerMoves[1][2] === player)
        setWinner(2);

    if (playerMoves[2][0] === player && playerMoves[2][1] === player && playerMoves[2][2] === player)
        setWinner(3);

    if (playerMoves[0][0] === player && playerMoves[1][0] === player && playerMoves[2][0] === player)
        setWinner(4);

    if (playerMoves[0][1] === player && playerMoves[1][1] === player && playerMoves[2][1] === player)
        setWinner(5);

    if (playerMoves[0][2] === player && playerMoves[1][2] === player && playerMoves[2][2] === player)
        setWinner(6);

    if (playerMoves[0][0] === player && playerMoves[1][1] === player && playerMoves[2][2] === player)
        setWinner(7);

    if (playerMoves[0][2] === player && playerMoves[1][1] === player && playerMoves[2][0] === player)
        setWinner(8);
}


const played = (event, pcMove = null) => {
    disableForm();
    var element = null;
    if (player == 'O' && pcMove !== null) {
        // pc Move

        // Check ID
        if (!checkIdValidity('b' + pcMove))
            return;

        // Get Element
        element = document.getElementById('b' + pcMove);
        if (element === undefined && element === null) {
            console.log("Element Error For Event: ", event);
            enableForm();
            return;
        }
    }
    else {
        // Check ID
        if (!checkIdValidity(event.target.id))
            return;

        // Get Element
        element = document.getElementById(event.target.id);
        if (element === undefined && element === null) {
            console.log("Element Error For Event: ", event);
            enableForm();
            return;
        }

    }

    if (element.innerText !== '') {
        enableForm();
        return;
    }

    // updateboard
    updateboard(element);

    // check for winner
    checkForWin();

    changePlayer();
    
    if(player == 'O')
        CPUTurn();

    enableForm();
}

/* AI */

const DoBlindMove = (available) => {
    var Move = available[Math.floor(Math.random() * (available.length - 1))];
    played(null,Move);
}

const getDataModel = () =>{
    var temp = getCurrentState();

    var dataModel = [];

    // Get Rows
    for(var i = 0; i < temp.length; i++) {
        dataModel.push(temp[i]);
    }

    // Get Columns
    dataModel.push([temp[0][0], temp[1][0], temp[2][0]])
    dataModel.push([temp[0][1], temp[1][1], temp[2][1]])
    dataModel.push([temp[0][2], temp[1][2], temp[2][2]])

    // Get Diameter
    dataModel.push([temp[0][0], temp[1][1], temp[2][2]])
    dataModel.push([temp[0][2], temp[1][1], temp[2][0]])

    return dataModel;

}

const findTheBestMoveForX = () => {
    var bestMoves = [];

    var dataModel = getDataModel();

    for(var i = 0; i < dataModel.length; i++){
        if(dataModel[i].filter((item) => {item === 'X'}).length == 2 && dataModel[i].filter((item) => {item === ''}).length == 2)
            bestMoves.push(dataModel[i]);
    }
}

const DoMasterMove = (available) => {
    var Move = available[Math.floor(Math.random() * (available.length - 1))];
    played(null,Move);
}

const CPUTurn = () => {
    var temp = getCurrentState();
    var available = [];

    temp.map((rItem, rIndex) => {
        rItem.map((cItem, cIndex) => {
            if (cItem == '')
                available.push((rIndex+1).toString() + (cIndex+1).toString());
        })
    })

    if (available.length > 7)
        DoBlindMove(available);
    else if (available.length == 0)
        return;
    else
        DoMasterMove(available);

}