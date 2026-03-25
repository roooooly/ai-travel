import httpx
import json
from typing import Optional
from ..core.config import settings


class AIService:
    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_url = "https://api.siliconflow.cn/v1/chat/completions"
        self.embedding_url = "https://api.siliconflow.cn/v1/embeddings"

    async def generate_itinerary(self, destination: str, days: int, preferences: Optional[dict] = None) -> dict:
        """Generate travel itinerary using DeepSeek API."""
        if not self.api_key:
            return self._generate_mock_itinerary(destination, days)

        prompt = self._build_itinerary_prompt(destination, days, preferences)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-ai/DeepSeek-V3",
                    "messages": [
                        {"role": "system", "content": "你是一个专业的旅行规划助手，为用户生成个性化的旅行行程。"},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            )
            result = response.json()
            content = result["choices"][0]["message"]["content"]

        return {
            "title": f"{destination}{days}日游推荐行程",
            "content": content
        }

    def _build_itinerary_prompt(self, destination: str, days: int, preferences: Optional[dict] = None) -> str:
        preference_text = ""
        if preferences:
            preference_text = f"用户偏好: {json.dumps(preferences, ensure_ascii=False)}"

        return f"""请为用户规划{days}天的{destination}旅行行程。

{preference_text}

请以JSON格式返回行程，格式如下：
{{
    "title": "行程标题",
    "days": [
        {{
            "day": 1,
            "theme": "今日主题",
            "morning": {{"景点": "景点名", "时长": "2小时", "门票": "免费", "tips": "建议"}},
            "lunch": {{"餐厅": "餐厅名", "推荐菜": "招牌菜", "人均": "50元"}},
            "afternoon": {{"景点": "景点名", "时长": "3小时", "门票": "50元", "tips": "建议"}},
            "evening": {{"景点": "景点名或夜游地点", "时长": "2小时", "tips": "建议"}},
            "dinner": {{"餐厅": "餐厅名", "推荐菜": "招牌菜", "人均": "80元"}}
        }}
    ],
    "tips": ["总体建议1", "总体建议2"]
}}

请确保行程合理，包含具体景点、餐厅推荐、门票价格和游览时长。"""

    def _generate_mock_itinerary(self, destination: str, days: int) -> dict:
        """Generate a mock itinerary when API key is not set."""
        mock_content = {
            "title": f"{destination}{days}日游推荐行程",
            "days": [
                {
                    "day": i,
                    "theme": f"第{i}天主题",
                    "morning": {"景点": f"{destination}经典景点A", "时长": "2-3小时", "门票": "约50元", "tips": "建议早上前往，避开人流"},
                    "lunch": {"餐厅": f"{destination}特色餐厅", "推荐菜": "当地特色菜", "人均": "约80元"},
                    "afternoon": {"景点": f"{destination}经典景点B", "时长": "3-4小时", "门票": "约80元", "tips": "下午光线好，适合拍照"},
                    "evening": {"景点": f"{destination}夜景推荐", "时长": "1-2小时", "tips": "晚上灯光很美"},
                    "dinner": {"餐厅": f"{destination}夜市美食", "推荐菜": "小吃一条街", "人均": "约50元"}
                }
                for i in range(1, days + 1)
            ],
            "tips": [f"{destination}旅行建议1", f"{destination}旅行建议2"]
        }
        return {
            "title": f"{destination}{days}日游推荐行程",
            "content": json.dumps(mock_content, ensure_ascii=False, indent=2)
        }

    async def get_embedding(self, text: str) -> list:
        """Get text embedding from DeepSeek API."""
        if not self.api_key:
            return [0.0] * 1536  # Mock embedding

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                self.embedding_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-text-embedding",
                    "input": text
                }
            )
            result = response.json()
            return result["data"][0]["embedding"]

        return [0.0] * 1536
