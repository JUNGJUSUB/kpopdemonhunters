
import { Character, Scene, GameState } from './types';
import { Type } from '@google/genai';

export const INITIAL_CHARACTER: Character = {
  name: '',
  hp: 100,
  style: 80,
  demonEnergy: 10,
};

export const INITIAL_SCENE: Scene = {
  sceneDescription: '게임 로딩 중...',
  choices: [],
};

export const GAME_SYSTEM_PROMPT = `
당신은 텍스트 기반 RPG 게임의 전문 게임 마스터입니다. 
게임의 테마는 '넷플릭스 케이팝 데몬헌터스'입니다. 
배경은 K팝 아이돌들이 비밀리에 악마를 사냥하는 어둡고 현대적인 서울입니다. 
당신의 모든 응답은 반드시 한국어로 작성되어야 합니다. 
항상 흥미로운 서사를 제공하고, 그 뒤에 플레이어를 위한 3가지 뚜렷한 선택지를 제시해야 합니다. 
플레이어의 체력(hp), 스타일(style), 또는 악마 에너지(demonEnergy)에 변화가 생기면 장면 설명에 괄호로 표시해주세요. 예: (체력 -10), (스타일 +5).
게임 오버 조건이 되면, 장면 설명에 'GAME_OVER' 라는 단어를 포함하고, 선택지는 빈 배열로 보내주세요.
응답은 'sceneDescription'(장면 설명)과 'choices'(선택지 배열, 각 선택지는 25자 이내)라는 키를 가진 JSON 객체 형식이어야 합니다.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sceneDescription: {
      type: Type.STRING,
      description: "현재 장면이나 상황에 대한 설명입니다. 플레이어의 스탯 변화나 게임 오버 상태를 포함할 수 있습니다.",
    },
    choices: {
      type: Type.ARRAY,
      description: "플레이어가 할 수 있는 3가지 선택지입니다. 게임 오버 시 빈 배열이 됩니다.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["sceneDescription", "choices"],
};
   