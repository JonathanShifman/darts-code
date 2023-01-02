import React, {useState} from 'react';
import {
    StyledHit,
} from './Hit.styled';

function Hit(props) {
    let [radius, setRadius] = useState(props.radius);

    let updateRadius = () => {

    };


    return (
        <circle cx={props.x} cy={props.y} r={radius} fill={'#ffcb24'} stroke={'black'} strokeWidth="1"/>
    );
}



export default Hit;
