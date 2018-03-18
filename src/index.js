import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    toggleValue(v) {
        return this.state.value ? {value: null} : {value: v};
    }


    toggleValue2(v) {
        if (this.state.value) {
            this.setState({value: null})
        } else {
            this.setState({value: v})
        }
    }

    render() {
        return (
            <button className="square" name={this.props.value}
                // onClick={() => this.state.value ? this.setState({value: null}) : this.setState({value: 'X'})}>
                // onClick={() => this.setState(this.toggleValue('X'))}>
                    onClick={() => this.toggleValue2('X')}>
                {this.state.value}
                {/*this.props.value*/}
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
    renderSquare(i) {
        return <Square value={i}/>;
    }

    createBlocks(size) {
        let blocks = []

        let count = 0;
        for (let c = 0; c < size; c++) {
            const rows = [];
            for (let r = 0; r < size; r++) {
                rows.push(this.renderSquare(count++))
            }
            blocks.push(<Blocks blocks={rows}/>)
        }
        return blocks
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                {this.createBlocks(6)}
                {/*
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        */}
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
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
    <Game/>,
    document.getElementById('root')
);
