import React, {useState, useEffect} from 'react';
import {
    AppWrapper,
    ScoreBoard,
    ScoreBoardTop,
    ScoreBoardBottom,
    ScoreBoardCell,
} from './App.styled';
import Board from "../Board/Board";

function App() {
    let [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let [scoreBoard, setScoreBoard] = useState(getInitialScoreBoard());
    let [hits, setHits] = useState([]);

    let state = {
        screenWidth, setScreenWidth,
        scoreBoard, setScoreBoard,
        hits, setHits,
    };

    useEffect(() => {
        let handler = () => state.setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    });

    return (
        <AppWrapper>
            <Board screenWidth={screenWidth} hits={state.hits} onHit={(hit, score) => onBoardHit(state, hit, score)} />
            <ScoreBoard>
                <ScoreBoardTop>
                    <ScoreBoardCell>{ state.scoreBoard.dartScores[0] }</ScoreBoardCell>
                    <ScoreBoardCell>{ state.scoreBoard.dartScores[1] }</ScoreBoardCell>
                    <ScoreBoardCell>{ state.scoreBoard.dartScores[2] }</ScoreBoardCell>
                    {/*<ScoreBoardCell>{ 0 }</ScoreBoardCell>*/}
                </ScoreBoardTop>
                <ScoreBoardBottom>
                    <ScoreBoardCell>{ state.scoreBoard.startScore }</ScoreBoardCell>
                    <ScoreBoardCell>{ state.scoreBoard.endScore }</ScoreBoardCell>
                </ScoreBoardBottom>
            </ScoreBoard>
        </AppWrapper>
    );
}

function onBoardHit(state, hit, score) {
    let newScoreBoard;
    let newHits;
    if (state.scoreBoard.endScore != null) {
        newHits = [];
        newScoreBoard = {
            startScore: state.scoreBoard.endScore == 0 ? 501 : state.scoreBoard.endScore,
            endScore: null,
            dartScores: []
        };
    } else {
        newHits = state.hits.slice();
        newScoreBoard = Object.assign({}, state.scoreBoard);
    }
    let scoreValue = getScoreValue(score);
    newScoreBoard.dartScores.push(scoreValue);
    newScoreBoard.endScore = calculateEndScore(newScoreBoard.startScore, newScoreBoard.dartScores, score);
    state.setScoreBoard(newScoreBoard);

    newHits.push(hit);
    state.setHits(newHits);

}

function calculateEndScore(startScore, dartScores, lastScore) {
    let dartScoresSum = dartScores.reduce((a, b) => a + b, 0);
    if (startScore - dartScoresSum > 1) {
        return dartScores.length < 3 ? null : startScore - dartScoresSum;
    }
    if (startScore - dartScoresSum == 1 || startScore - dartScoresSum < 0) {
        return startScore;
    }
    if (lastScore == 'BULL' || lastScore.type == 'DOUBLE') {
        return 0;
    }
    return startScore;
}


function getScoreValue(score) {
    if (score == 'NO SCORE') return 0;
    if (score == 'BULL') return 50;
    if (score == 'OUTER BULL') return 25;
    if (score.type == 'TRIPLE') return score.value * 3;
    if (score.type == 'DOUBLE') return score.value * 2;
    return score.value;
}

function getInitialScoreBoard() {
    return {
        startScore: 501,
        endScore: null,
        dartScores: []
    };
}

export default App;
