
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Scene, Character } from '../types';
import { GAME_SYSTEM_PROMPT, RESPONSE_SCHEMA } from '../constants';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateScene = async (prompt: string): Promise<Scene> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: GAME_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    // Gemini can sometimes wrap the JSON in ```json ... ```, so we strip that.
    const cleanJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    
    const parsedScene: Scene = JSON.parse(cleanJsonText);
    return parsedScene;

  } catch (error) {
    console.error("Error generating scene with Gemini:", error);
    return {
      sceneDescription: "오류가 발생했습니다. 잠시 후 다시 시도해주세요. API 키가 올바르게 설정되었는지 확인하세요.",
      choices: ["다시 시작"],
    };
  }
};

export const getInitialScenePrompt = (character: Character): string => {
  return `
    새로운 게임을 시작합니다.
    플레이어 캐릭터의 이름은 '${character.name}'입니다. 
    이들은 성공적인 K-Pop 아이돌이자 비밀스러운 악마 사냥꾼입니다. 
    이들의 첫 번째 임무가 시작되는 장면을 생성해주세요.
  `;
};

export const getNextScenePrompt = (lastScene: Scene, choice: string): string => {
  return `
    이전 장면은 다음과 같았습니다: "${lastScene.sceneDescription}"
    플레이어는 다음 선택을 했습니다: "${choice}"
    이 선택에 따라 다음에 일어날 일을 흥미진진하게 설명해주세요.
  `;
};
   