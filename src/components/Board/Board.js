import React, {Fragment} from 'react';
import {BoardSvg, StyledBoard} from './Board.styled';
import random from 'random';
import Hit from "../Hit/Hit";

const normal = random.normal(0, 16/700);

const segmentValues = [6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13];

// Wiki
// let innerBullRadiusRatio = 0.03737;
// let outerBullRadiusRatio = 0.09352;
// let tripleInnerRadiusRatio = 0.582;
// let tripleOuterRadiusRatio = 0.629;
// let doubleInnerRadiusRatio = 0.953;

let innerBullRadiusRatio = 0.04;
let outerBullRadiusRatio = 0.095;
let tripleInnerRadiusRatio = 0.58;
let tripleOuterRadiusRatio = 0.64;
let doubleInnerRadiusRatio = 0.94;

function Board(props) {
    let boardSize = Math.min(700, props.screenWidth - 20);
    let center = boardSize / 2;
    let radiusRatio = 0.8;
    let radius = center * radiusRatio;

    return (
        <StyledBoard boardSize={boardSize}>
            <BoardSvg onClick={e => onBoardClick(props, e, boardSize, radius)}>
                {getSegments(center, radius)}
                {getStrips(center, radius * doubleInnerRadiusRatio, radius)}
                {getStrips(center, radius * tripleInnerRadiusRatio, radius * tripleOuterRadiusRatio)}
                {getBullRings(center, radius)}
                {getLabels(center, radius * 1.07, props.screenWidth)}
                {getHits(props.hits, center, radius, boardSize)}
            </BoardSvg>
        </StyledBoard>
    );
}

function onBoardClick(props, e, boardSize, radius) {
    let relativeX = e.nativeEvent.offsetX;
    let relativeY = e.nativeEvent.offsetY;
    let center = boardSize / 2;
    let hitX = relativeX + normal() * boardSize;
    let hitY = relativeY + normal() * boardSize;
    let score = calcScore(hitX, hitY, center, radius);
    let hit = {
        x: (hitX - center) / radius,
        y: (hitY - center) / radius,
    };
    props.onHit(hit, score);
}

function calcScore(hitX, hitY, center, radius) {
    let hitRadius = Math.hypot(hitX - center, hitY - center);
    let hitRadiusRatio = hitRadius / radius;

    if (hitRadiusRatio <= innerBullRadiusRatio) return 'BULL';
    if (hitRadiusRatio <= outerBullRadiusRatio) return 'OUTER BULL';
    if (hitRadiusRatio > 1) return 'NO SCORE';

    let segmentValue = getSegmentValue(hitX, hitY, center);
    if (hitRadiusRatio >= tripleInnerRadiusRatio && hitRadiusRatio <= tripleOuterRadiusRatio) {
        return {
            type: 'TRIPLE',
            value: segmentValue,
        };
    }
    if (hitRadiusRatio >= doubleInnerRadiusRatio) {
        return {
            type: 'DOUBLE',
            value: segmentValue,
        };
    }
    return {
        type: 'SINGLE',
        value: segmentValue,
    };
}

function getSegmentValue(hitX, hitY, center) {
    let xDiff = hitX - center;
    let yDiff = hitY - center;
    let angle;
    if (xDiff == 0) {
        angle = yDiff > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
    } else {
        let tan = yDiff / xDiff;
        angle = Math.atan(tan);
        if (xDiff < 0) {
            if (yDiff == 0) {
                angle = Math.PI;
            } else {
                angle = yDiff > 0 ? Math.PI + angle : angle - Math.PI;
            }
        }
    }
    angle = toDegrees(normalizeAngle(angle));
    let segmentIndex = getSegmentIndex(angle);
    return segmentValues[segmentIndex];
}

function getSegmentIndex(angle) {
    if (angle >= 351 || angle < 9) return 0;
    return Math.floor((angle + 9) / 18);
}

function getHits(hits, center, radius, boardSize) {
    let hitElements = [];
    let index = 0;
    for (let hit of hits) {
        hitElements.push(getHit(hit, index, center, radius, boardSize));
        index++;
    }
    return hitElements;
}

function getHit(hit, index, center, radius, boardSize) {
    let x = center + hit.x * radius;
    let y = center + hit.y * radius;
    return (
        <Hit x={x} y={y} radius={boardSize / 200} key={index}/>
    );
}

function getSegments(center, radius) {
    let segments = [];
    for (let i = 0; i < 20; i++) {
        segments.push(getSegment(i * 360 / 20, i, center, radius));
    }
    return segments;
}

function getSegment(segmentMiddleAngle, segmentIndex, center, radius) {
    let segmentAngle = 360 / 20;
    let segmentStartAngle = toRadians(segmentMiddleAngle - (segmentAngle / 2));
    let segmentEndAngle = toRadians(segmentMiddleAngle + (segmentAngle / 2));
    let segmentStartX = center + radius * Math.cos(segmentStartAngle);
    let segmentStartY = center + radius * Math.sin(segmentStartAngle);
    let segmentEndX = center + radius * Math.cos(segmentEndAngle);
    let segmentEndY = center + radius * Math.sin(segmentEndAngle);
    let pathCommand = ['M', center, center, 'L', segmentStartX, segmentStartY, 'A', radius, radius, 0, 0, 1, segmentEndX, segmentEndY, 'L', center, center].join(' ');
    let fill = segmentIndex % 2 == 0 ?
        '#F9DFBC' :
        '#000000';
    return <path d={pathCommand} fill={fill} stroke={'#c0c0c0'} strokeWidth={'1'} key={segmentIndex}/>;
}

function getBullRings(center, radius) {
    return (
        <Fragment>
            <circle cx={center} cy={center} r={outerBullRadiusRatio * radius} stroke="#c0c0c0" strokeWidth="1"
                    fill={'#2E9966'}/>
            <circle cx={center} cy={center} r={innerBullRadiusRatio * radius} stroke="#c0c0c0" strokeWidth="1"
                    fill={'#DA272C'}/>
        </Fragment>
    );
}

function getStrips(center, innerRadius, outerRadius) {
    let strips = [];
    for (let i = 0; i < 20; i++) {
        strips.push(getStrip(i * 360 / 20, i, center, innerRadius, outerRadius));
    }
    return strips;
}

function getStrip(segmentMiddleAngle, segmentIndex, center, innerRadius, outerRadius) {
    let segmentAngle = 360 / 20;
    let segmentStartAngle = toRadians(segmentMiddleAngle - (segmentAngle / 2));
    let segmentEndAngle = toRadians(segmentMiddleAngle + (segmentAngle / 2));
    let stripInnerStartX = center + innerRadius * Math.cos(segmentStartAngle);
    let stripInnerStartY = center + innerRadius * Math.sin(segmentStartAngle);
    let stripInnerEndX = center + innerRadius * Math.cos(segmentEndAngle);
    let stripInnerEndY = center + innerRadius * Math.sin(segmentEndAngle);
    let stripOuterStartX = center + outerRadius * Math.cos(segmentStartAngle);
    let stripOuterStartY = center + outerRadius * Math.sin(segmentStartAngle);
    let stripOuterEndX = center + outerRadius * Math.cos(segmentEndAngle);
    let stripOuterEndY = center + outerRadius * Math.sin(segmentEndAngle);
    let pathCommand = ['M', stripInnerStartX, stripInnerStartY, 'L', stripOuterStartX, stripOuterStartY, 'A', outerRadius, outerRadius, 0, 0, 1, stripOuterEndX, stripOuterEndY, 'L', stripInnerEndX, stripInnerEndY, 'A', innerRadius, innerRadius, 0, 0, 0, stripInnerStartX, stripInnerStartY].join(' ');
    let fill = segmentIndex % 2 == 0 ?
        '#2E9966' :
        '#DA272C';
    return <path d={pathCommand} fill={fill} stroke={'#c0c0c0'} strokeWidth={'1'} key={segmentIndex}/>;
}

function getLabels(center, radius, screenWidth) {
    let labels = [];
    for (let i = 0; i < 20; i++) {
        labels.push(getLabel(toRadians(i * 360 / 20), i, center, radius, screenWidth));
    }
    return labels;
}

function getLabel(segmentMiddleAngle, segmentIndex, center, radius, screenWidth) {
    let labelX = center + radius * Math.cos(segmentMiddleAngle);
    let labelY = center + radius * Math.sin(segmentMiddleAngle);
    let fontSize = screenWidth > 960 ? 24 : screenWidth / 32;
    return (
        <text x={labelX} y={labelY} textAnchor={"middle"} alignmentBaseline={"middle"} fill={'#686868'} fontSize={fontSize} fontWeight={'bold'} key={segmentIndex}>
            {segmentValues[segmentIndex]}
        </text>
    );
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function normalizeAngle(angle) {
    while (angle < 0) angle += 2 * Math.PI;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
    return angle;
}


export default Board;
