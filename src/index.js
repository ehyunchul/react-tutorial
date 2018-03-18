import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Square extends React.Component {
    // toggleValue(v) {
    //     return this.state.value ? {value: null} : {value: v};
    // }

    // toggleValue2(v) {
    //     if (this.state.value) {
    //         this.setState({value: null})
    //     } else {
    //         this.setState({value: v})
    //     }
    // }

    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
            {/*<button className="square" name={this.props.value} onClick={() => this.toggleValue2('X')}>*/}
                {this.props.value}
            </button>
        );
    }
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
        }
    }

    handleClick(i) {
        console.log(i)
        const squares = this.state.squares.slice();
        squares[i] = 'X'
        this.setState({squares: squares})
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]}
                       key={'square_'.concat(i)}
                       onClick={() => this.handleClick(i)} />;
    }

    createBlocks(size) {
        let blocks = [];

        let count = 0;
        for (let c = 0; c < size; c++) {
            const rows = [];
            for (let r = 0; r < size; r++) {
                rows.push(this.renderSquare(count++));
            }
            blocks.push(<Blocks blocks={rows} key={'board_'.concat(c.toString())} />)
        }
        return blocks;
    }

    render() {
        const status = 'Next player: X';

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
                    <Board size={this.props.size} />
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
    <ExtensibleGame size={16}/>,
    document.getElementById('root')
);