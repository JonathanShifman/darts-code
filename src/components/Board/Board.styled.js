import styled, {keyframes} from "styled-components";

const pulse = keyframes`
  0% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(2);
  }

  100% {
    transform: scaleX(1);
  }
`;

export const StyledBoard = styled.div`
  width: ${props => props.boardSize + 'px'};
  height: ${props => props.boardSize + 'px'};
  //background-color: #4c2f29;
  user-select: none;
`;

export const BoardSvg = styled.svg`
    width: 100%;
    height: 100%;
    cursor: crosshair;
`;

