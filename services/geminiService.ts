
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Contact, Deal, IncomingLead } from "../types";

export interface PropertyFile {
  data: string; // base64
  mimeType: string;
  name: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    return null; // 使用免費模式，返回模擬數據
  }
  return new GoogleGenAI({ apiKey });
};

export const cleanAIOutput = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[#*~_>]/g, "") 
    .replace(/\n{3,}/g, "\n\n") 
    .trim();
};

/**
 * 強化一致性的虛擬裝修：嚴格鎖定建築結構
 */
export const generateStagedImage = async (originalFile: PropertyFile, style: string): Promise<string | null> => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回原始圖片
    return originalFile.data.includes(',') ? originalFile.data : `data:${originalFile.mimeType};base64,${originalFile.data}`;
  }
  const prompt = `Task: Professional Real Estate Virtual Staging. Style: ${style}. CRITICAL INSTRUCTION: Preserve the original architectural structure EXACTLY. Keep all windows, doors, walls, ceiling beams, and floor levels unchanged. Only add interior furniture, lighting fixtures, and decor items that fit naturally into the existing space. Do not alter the room's layout or dimensions. Photorealistic, high-end interior design quality.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: originalFile.data.includes(',') ? originalFile.data.split(',')[1] : originalFile.data, mimeType: originalFile.mimeType } },
        { text: prompt }
      ]
    },
    config: { imageConfig: { aspectRatio: "4:3" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateMarketingImage = async (prompt: string, aspectRatio: "16:9" | "9:16" | "1:1" = "16:9"): Promise<string | null> => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回 null（需要用戶上傳圖片）
    return null;
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Professional real estate high-end marketing visual: ${prompt}` }] },
    config: { imageConfig: { aspectRatio } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateMarketingPromptFromImage = async (file: PropertyFile): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本描述
    return "這是一張優質的房產照片，展現了現代化的室內設計與良好的採光條件。";
  }
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: file.data.includes(',') ? file.data.split(',')[1] : file.data, mimeType: file.mimeType } },
        { text: "請分析這張照片的格局，並將其轉化為一段具備『高級感、行銷美學』的視覺提詞。描述內容應包含：光影處理、裝修風格升級、材質細節（如大理石、原木、絲絨）。只需產出描述內容，不使用 Markdown。" }
      ]
    }
  });
  return cleanAIOutput(res.text || "");
};

export const generateAIPrompt = async (type: 'image' | 'video', style: string, analysis: string): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本提示詞
    return `Professional ${type} prompt: ${style} style, ${analysis}. Cinematic lighting, professional camera work, high-quality textures.`;
  }
  const prompt = `你是一位專業的 AI 視覺藝術家。基於以下空間分析：${analysis} 以及期望風格：${style} 請產出一段高品質的 ${type === 'image' ? 'Midjourney/Flux' : 'Sora/Veo'} 英文提詞 (Prompt)。要求：包含光影處理(Cinematic lighting)、相機鏡位(Camera movement)、材質(Textures)等專業描述。只需輸出英文提詞內容。`;
  const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
  return cleanAIOutput(res.text || "");
};

export const compareProperties = async (p1: string, p2: string) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本比較
    return { 
      text: `物件 A：${p1}\n\n物件 B：${p2}\n\n建議：請根據您的實際需求、預算和地點偏好來選擇最適合的物件。`, 
      sources: [] 
    };
  }
  const prompt = `你是一位資深房產顧問。請比對以下兩個物件：物件 A：${p1} 物件 B：${p2} 請提供優劣勢對照、銷售話術建議與最終決策建議。不使用 Markdown 標題。`;
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return { text: cleanAIOutput(res.text || ""), sources: [] };
};

export const generateOutreachMessage = async (scenario: string, target: string) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本文案模板
    return `情境：${scenario}\n目標：${target}\n\n建議文案：\n1. 親切問候型\n2. 專業服務型\n3. 價值導向型`;
  }
  const prompt = `房仲開發情境：${scenario}。目標客戶特徵/痛點：${target}。生成 3 種風格文案。不使用 Markdown。`;
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return cleanAIOutput(res.text || "");
};

export const getLatestRealEstateNews = async () => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回提示訊息
    return { 
      text: "請前往 591、信義房屋、永慶房屋等網站查看最新房市資訊。", 
      sources: [
        { title: "591 房屋交易網", uri: "https://www.591.com.tw" },
        { title: "信義房屋", uri: "https://www.sinyi.com.tw" },
        { title: "永慶房屋", uri: "https://www.yungching.com.tw" }
      ] 
    };
  }
  const res = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: `搜尋今日台灣房市最新重大新聞。列出 3 條關鍵摘要。不使用 ### 標題。`, 
    config: { tools: [{ googleSearch: {} }] } 
  });
  const sources = res.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || '房市來源',
    uri: chunk.web?.uri || '#'
  })) || [];
  return { text: cleanAIOutput(res.text || ""), sources };
};

export const analyzeInteriorImage = async (file: PropertyFile) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本分析
    return "這是一張室內空間照片。建議從空間佈局、採光條件、裝修風格等角度進行分析。";
  }
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: { parts: [{ inlineData: { data: file.data.includes(',') ? file.data.split(',')[1] : file.data, mimeType: file.mimeType } }, { text: "請深度分析這張室內照片空間佈局與採光。不使用 Markdown。" }] } });
  return cleanAIOutput(res.text || "");
};

export const analyzeVideoSceneImage = async (file: PropertyFile) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本分析
    return "這張照片的視覺重點包括構圖、色彩、光線等元素。建議從這些角度進行分析。";
  }
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: { parts: [{ inlineData: { data: file.data.includes(',') ? file.data.split(',')[1] : file.data, mimeType: file.mimeType } }, { text: "請分析這張照片的視覺重點。不使用 Markdown。" }] } });
  return cleanAIOutput(res.text || "");
};

/**
 * 加強版影音腳本生成
 */
export const generateVideoScript = async (propertyInfo: string, files: PropertyFile[], style: string, protagonistName: string, endingTagline: string) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本腳本模板
    return `【開場】\n${protagonistName || '專業房產經紀人'}：歡迎來到這個優質物件！\n\n【物件介紹】\n${propertyInfo}\n\n【結尾】\n${endingTagline || '立即預約看屋，讓我們為您找到理想的家。'}`;
  }
  const parts: any[] = files.map(file => ({ inlineData: { data: file.data.includes(',') ? file.data.split(',')[1] : file.data, mimeType: file.mimeType } }));
  const prompt = `你是一位專業的短影音導演與腳本家。請基於以下資訊為此房產產出一份極具吸引力的短影音腳本：物件資訊：${propertyInfo} 腳本風格：${style} 主角名稱：${protagonistName || '專業房產經紀人'} 結尾語/金句：${endingTagline || '立即預約看屋，讓我們為您找到理想的家。'} 腳本要求：1. 包含「視覺分鏡描述」與「口播文案」。2. 開場必須在前 3 秒內抓住觀眾（Hook）。3. 主角名稱應自然融入開場的自我介紹中。4. 結尾必須完美銜接指定的結尾語。5. 根據所選風格，語氣要精確（如：感性風要柔和，快剪風要銳利）。只需輸出腳本內容，不使用 Markdown。`;
  parts.push({ text: prompt });
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: { parts } });
  return cleanAIOutput(res.text || "");
};

export const parseRawLead = async (t: string) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本結構化數據
    return {
      name: "",
      phone: "",
      role: "buyer",
      budget: 0,
      preferredArea: "",
      purpose: "",
      urgency: "B (一般)"
    };
  }
  const res = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: `解析以下房仲客戶資訊並結構化：${t}`, 
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          phone: { type: Type.STRING },
          role: { type: Type.STRING, description: "buyer or seller" },
          budget: { type: Type.NUMBER },
          preferredArea: { type: Type.STRING },
          purpose: { type: Type.STRING },
          urgency: { type: Type.STRING }
        }
      }
    } 
  });
  return JSON.parse(res.text || "{}");
};

export const getGlobalSummary = async (c: any, d: any) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本摘要
    return "請根據客戶資料和交易記錄進行分析，產出銷售洞察摘要。";
  }
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "產出銷售洞察摘要，不使用 Markdown。" });
  return cleanAIOutput(res.text || "");
};

export const generateStrategySpeech = async (t: string) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回空字串（TTS 需要 API）
    return "";
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: t }] }],
    config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const getClosingTactics = async (c: Contact) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本建議
    return {
      persona: "一般客戶",
      resistance: "需要進一步了解",
      tactics: "建議深入了解客戶需求，提供專業建議和優質服務。"
    };
  }
  const res = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: `身為房產專家，請針對此客戶產出成交攻略。客戶資料：${JSON.stringify(c)}`, 
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING, description: "客戶性格簡述" },
          resistance: { type: Type.STRING, description: "客戶主要抗拒點" },
          tactics: { type: Type.STRING, description: "具體成交攻防建議" }
        },
        required: ["persona", "resistance", "tactics"]
      }
    } 
  });
  return JSON.parse(res.text || "{}");
};

/**
 * 智慧配案核心算法
 */
export const calculateMatchScore = async (buyer: Contact, seller: Contact) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：使用簡單規則計算匹配分數
    let score = 50;
    let location = 50;
    let value = 50;
    let layout = 50;
    
    // 地段匹配 (30%)
    if (buyer.preferredArea && seller.preferredArea && buyer.preferredArea === seller.preferredArea) {
      location = 100;
    } else if (buyer.preferredArea && seller.preferredArea && buyer.preferredArea.includes(seller.preferredArea.split('區')[0])) {
      location = 70;
    }
    
    // 價值評估 (30%)
    if (buyer.budget && seller.budget) {
      const ratio = seller.budget / buyer.budget;
      if (ratio <= 1.2) {
        value = 100;
      } else if (ratio <= 1.5) {
        value = 70;
      } else {
        value = 30;
      }
    }
    
    // 格局與條件 (40%)
    if (buyer.rooms && seller.rooms && buyer.rooms === seller.rooms) {
      layout += 20;
    }
    if (buyer.totalSize && seller.totalSize) {
      const sizeDiff = Math.abs(buyer.totalSize - seller.totalSize);
      if (sizeDiff <= 5) {
        layout += 20;
      } else if (sizeDiff <= 10) {
        layout += 10;
      }
    }
    
    score = Math.round(location * 0.3 + value * 0.3 + layout * 0.4);
    
    return {
      score: Math.min(100, Math.max(0, score)),
      reason: `此物件位於${seller.preferredArea}，開價${seller.budget}萬，符合您的基本需求。建議安排看屋進一步了解。`,
      breakdown: { location, value, layout }
    };
  }
  
  const prompt = `身為專業房產顧問 AI，請深度評估此買方與物件的匹配程度。
  
  買方精確需求：
  - 預算：${buyer.budget}萬
  - 目標行政區：${buyer.preferredArea}
  - 房數要求：${buyer.rooms}
  - 坪數偏好：${buyer.totalSize}坪
  - 車位需求：${buyer.parkingPref}
  - 樓層偏好：${buyer.floorPref}
  - 屋齡偏好：${buyer.agePref}
  - 方位偏好：${buyer.orientation}
  - 捷運需求：${buyer.mrtDistance}
  - 陽台需求：${buyer.balconyPref}
  - 核心痛點/備註：${buyer.requirement}
  
  物件實際現況：
  - 開價：${seller.budget}萬
  - 所在地：${seller.preferredArea}
  - 實際坪數：${seller.totalSize}坪
  - 實際方位：${seller.orientation || '未註記'}
  - 所在樓層：${seller.floorPref || '未註記'}
  - 屋齡：${seller.buildingAge || '未註記'}年
  - 屋況細節：${seller.propertyCondition || '未註記'}
  
  請執行以下權重評估：
  1. 地段匹配 (30%)：行政區是否完全吻合？若捷運距離符合則加分。
  2. 價值評估 (30%)：開價是否在買方預算的 120% 以內？（有議價空間）。
  3. 格局與條件 (40%)：房數、坪數、方位、車位、陽台的符合程度。
  
  請回傳 JSON 結構。reason 必須是一段極具銷售話術、能打動買方去看屋的推薦理由。`;

  const res = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: prompt, 
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "0-100 的總匹配分數" },
          reason: { type: Type.STRING, description: "具備銷售張力的推薦理由" },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              location: { type: Type.NUMBER, description: "地段匹配度 (0-100)" },
              value: { type: Type.NUMBER, description: "CP值/價格匹配度 (0-100)" },
              layout: { type: Type.NUMBER, description: "格局與規格匹配度 (0-100)" }
            },
            required: ["location", "value", "layout"]
          }
        },
        required: ["score", "reason", "breakdown"]
      }
    } 
  });
  return JSON.parse(res.text || '{"score": 50, "reason": "分析異常", "breakdown": {"location": 50, "value": 50, "layout": 50}}');
};

export const analyzePropertyFiles = async (files: PropertyFile[]) => {
  const ai = getAI();
  if (!ai) {
    // 免費模式：返回基本分析
    return `已上傳 ${files.length} 個房產檔案。建議從空間佈局、裝修風格、採光條件等角度進行分析。`;
  }
  const parts: any[] = files.map(file => ({ inlineData: { data: file.data.includes(',') ? file.data.split(',')[1] : file.data, mimeType: file.mimeType } }));
  parts.push({ text: "分析房產檔案內容，不使用 Markdown。" });
  const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: { parts } });
  return cleanAIOutput(res.text || "");
};
