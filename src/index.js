import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

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
    constructor(props) {
        super(props);
        this.state = {
            squares: new Array(Math.pow(this.props.size, 2)).fill(null),
            xIsNext: true,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        })

        calculateWinner(squares);
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]}
                       index={i}
                       key={'square_'.concat(i)}
                       onClick={() => this.handleClick(i)}/>;
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
        const winner = calculateWinner(this.state.squares);
        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: '.concat(this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                {this.createBlocks(this.props.size)}
            </div>
        );
    }

}

class ExtensibleGame extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board size={this.props.size}/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <ExtensibleGame size={4}/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
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