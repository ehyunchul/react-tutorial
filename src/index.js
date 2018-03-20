import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'


function Input(props) {
    return (
        <input type="number" onKeyPress={props.onKeyPress}/>
    )
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Blocks extends React.Component {
    constructor(props) {
        super(props);
        this.blocks = [];
    }

    render() {
        return (
            <div className="board-row">
                {this.props.blocks}
            </div>
        );
    }

}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]}
                       index={i}
                       key={'square_'.concat(i)}
                       onClick={() => this.props.onClick(i)}/>;
    }

    createBlocks(size) {
        let blocks = [];

        let count = 0;
        for (let c = 0; c < size; c++) {
            const rows = [];
            for (let r = 0; r < size; r++) {
                rows.push(this.renderSquare(count++));
            }
            blocks.push(<Blocks blocks={rows} key={'board_'.concat(c.toString())}/>)
        }
        return blocks;
    }

    render() {
        return (
            <div>
                {this.createBlocks(this.props.size)}
            </div>
        );
    }

}


class ExtensibleGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 0,
            history: [{squares: null}],
            stepNumber: 0,
            xIsNext: true,
        };

    }

    resetGame() {
        this.setState({
            size: 0,
            history: [{squares: null}],
            stepNumber: 0,
            xIsNext: true,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: '.concat(this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
                {
                    !this.state.size ?
                        null :
                        <div className="game-info">
                            <a href="#" onClick={() => this.resetGame()}>reset game</a>
                            <div>{status}</div>
                            <ol>{moves}</ol>
                        </div>
                }
                <div className="game-board">
                    {
                        !this.state.size ?
                            <div>
                                Enter the game size and press Enter key.
                                <Input onKeyPress={e => {
                                    if (e.key === "Enter") {
                                        this.setState({
                                            size: e.target.value,
                                            history: [{
                                                squares: new Array(Math.pow(e.target.value, 2)).fill(null)
                                            }]
                                        });

                                    }
                                }}/>
                            </div> : <Board size={this.state.size}
                                            squares={current.squares}
                                            onClick={i => this.handleClick(i)}/>
                    }
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <ExtensibleGame/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    if (!squares) return;
    const size = Math.sqrt(squares.length);
    let winner = null;

    let horizonFill = function () {
        for (let i = 0; i < Math.pow(size, 2) - size; i = i + size) {
            let player = squares[i];
            if (player && allEqualsValueInArray(player, () => squares.slice(i, i + size))) {
                winner = player;
            }
        }
    };

    let verticalFill = function () {
        for (let i = 0; i < size; i++) {
            let player = squares[i];
            if (player &&
                allEqualsValueInArray(player,
                    () => {
                        let verticals = [player];
                        let index = i;
                        for (let j = 0; j < size; j++) {
                            verticals.push(squares[index]);
                            index += size;
                        }
                        return verticals;
                    })) {
                winner = player;
            }
        }
    };

    let crossFill = function () {
        let player = squares[0];
        let index = 0;

        if (squares[0] &&
            allEqualsValueInArray(player,
                () => {
                    let cross = [];
                    for (let i = 0; i < size; i++) {
                        cross.push(squares[index]);
                        index += 1 + size;
                    }
                    return cross;
                }
            )) {
            winner = player;
        }

        player = squares[size - 1];
        index = size - 1;
        if (squares[size - 1] &&
            allEqualsValueInArray(player,
                () => {
                    let cross = [];
                    for (let i = 0; i < size; i++) {
                        cross.push(squares[index]);
                        index = (size - 1) * (i + 2);
                    }
                    return cross;
                }
            )) {
            winner = player;
        }
    };

    let allEqualsValueInArray = function (value, supplier) {
        return supplier().every(x => x === value);
    };

    horizonFill();
    verticalFill();
    crossFill();

    return winner;
}