import styled from "styled-components";

export const AppWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 40px 10px;
  box-sizing: border-box;
`;

export const ScoreBoard = styled.div`
  width: 600px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ScoreBoardTop = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ScoreBoardBottom = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ScoreBoardCell = styled.div`
  flex: 1;
  margin: 0 4px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #606060;
  border-radius: 8px;
`;