#!/usr/bin/env python3
"""插入苏州基础数据"""
import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine
from app.models.destination import Destination
from app.models.attraction import Attraction
from app.models.restaurant import Restaurant


SUZHOU_DESTINATIONS = [
    {"name": "拙政园", "city": "苏州", "description": "中国四大名园之一，江南园林的代表作", "image_url": "https://example.com/zhuozheng.jpg", "latitude": 31.3236, "longitude": 120.6226, "province": "江苏省", "country": "中国"},
    {"name": "平江路", "city": "苏州", "description": "苏州保存最完整的历史老街", "image_url": "https://example.com/pingjiang.jpg", "latitude": 31.3144, "longitude": 120.6322, "province": "江苏省", "country": "中国"},
    {"name": "苏州博物馆", "city": "苏州", "description": "贝聿铭设计，建筑本身就是一件艺术品", "image_url": "https://example.com/suzhou_museum.jpg", "latitude": 31.3211, "longitude": 120.6263, "province": "江苏省", "country": "中国"},
    {"name": "虎丘", "city": "苏州", "description": "吴中第一名胜，云岩寺塔是世界遗产", "image_url": "https://example.com/tiger_hill.jpg", "latitude": 31.2914, "longitude": 120.5972, "province": "江苏省", "country": "中国"},
    {"name": "周庄", "city": "苏州", "description": "中国第一水乡，保存完好的古镇", "image_url": "https://example.com/zhouzhuang.jpg", "latitude": 31.1167, "longitude": 120.8500, "province": "江苏省", "country": "中国"},
]

SUZHOU_ATTRACTIONS = [
    {"name": "拙政园", "city": "苏州", "description": "始建于明正德年间，占地78亩 | 建议游览2-3小时 | 门票: ¥70", "address": "苏州市姑苏区东北街178号", "latitude": 31.3236, "longitude": 120.6226, "ticket_price": 70, "rating": 4.8, "tags": "古典园林,世界遗产,摄影", "is_recommended": True, "recommended_duration": "2-3小时"},
    {"name": "苏州博物馆", "city": "苏州", "description": "贝聿铭设计1997年作品 | 建议游览1-2小时 | 门票: 免费", "address": "苏州市姑苏区东北街204号", "latitude": 31.3211, "longitude": 120.6263, "ticket_price": 0, "rating": 4.7, "tags": "博物馆,建筑,历史文化", "is_recommended": True, "recommended_duration": "1-2小时"},
    {"name": "虎丘", "city": "苏州", "description": "云岩寺塔又称虎丘塔 | 建议游览2-3小时 | 门票: ¥60", "address": "苏州市姑苏区虎丘山塘街8号", "latitude": 31.2914, "longitude": 120.5972, "ticket_price": 60, "rating": 4.6, "tags": "古迹,登高,寺庙", "is_recommended": True, "recommended_duration": "2-3小时"},
    {"name": "平江路", "city": "苏州", "description": "保存最完整的历史老街 | 全天开放 | 门票: 免费", "address": "苏州市姑苏区平江路", "latitude": 31.3144, "longitude": 120.6322, "ticket_price": 0, "rating": 4.5, "tags": "古街,美食,文艺", "is_recommended": True, "recommended_duration": "2-3小时"},
    {"name": "山塘街", "city": "苏州", "description": "七里山塘，白居易任苏州刺史时修建 | 门票: 免费", "address": "苏州市姑苏区山塘街", "latitude": 31.3097, "longitude": 120.6178, "ticket_price": 0, "rating": 4.5, "tags": "古街,夜景,美食", "is_recommended": False, "recommended_duration": "2小时"},
    {"name": "周庄", "city": "苏州", "description": "中国第一水乡 | 建议游览半天 | 门票: ¥88", "address": "苏州市昆山市周庄镇", "latitude": 31.1167, "longitude": 120.8500, "ticket_price": 88, "rating": 4.4, "tags": "古镇,水乡,摄影", "is_recommended": False, "recommended_duration": "4-5小时"},
    {"name": "网师园", "city": "苏州", "description": "小型园林典范 | 建议游览1小时 | 门票: ¥30", "address": "苏州市姑苏区阔家头巷11号", "latitude": 31.3167, "longitude": 120.6289, "ticket_price": 30, "rating": 4.6, "tags": "园林,夜游,昆曲", "is_recommended": True, "recommended_duration": "1-2小时"},
    {"name": "金鸡湖", "city": "苏州", "description": "现代化景区 | 建议游览2小时 | 门票: 免费", "address": "苏州市工业园区金鸡湖", "latitude": 31.3097, "longitude": 120.6917, "ticket_price": 0, "rating": 4.3, "tags": "夜景,现代,音乐喷泉", "is_recommended": False, "recommended_duration": "2小时"},
]

SUZHOU_RESTAURANTS = [
    {"name": "得月楼", "city": "苏州", "description": "百年老字号，苏帮菜代表 | 人均: ¥200", "address": "苏州市姑苏区太监弄27号", "latitude": 31.3139, "longitude": 120.6289, "cuisine_type": "苏帮菜", "average_price": 200, "rating": 4.5, "tags": "老字号,苏帮菜,约会", "is_recommended": True, "opening_hours": "10:30-14:00 16:30-20:30"},
    {"name": "松鹤楼", "city": "苏州", "description": "苏帮菜四大名园之一 | 人均: ¥180", "address": "苏州市姑苏区观前街43号", "latitude": 31.3156, "longitude": 120.6278, "cuisine_type": "苏帮菜", "average_price": 180, "rating": 4.4, "tags": "苏帮菜,老字号,历史", "is_recommended": True, "opening_hours": "10:00-21:00"},
    {"name": "协和菜馆", "city": "苏州", "description": "本地人常去的地道苏帮菜 | 人均: ¥80", "address": "苏州市姑苏区十全街117号", "latitude": 31.3092, "longitude": 120.6328, "cuisine_type": "苏帮菜", "average_price": 80, "rating": 4.6, "tags": "本地菜,实惠,家常", "is_recommended": True, "opening_hours": "10:00-21:00"},
    {"name": "同得兴", "city": "苏州", "description": "苏州老字号面馆 | 人均: ¥40", "address": "苏州市姑苏区嘉馀坊6号", "latitude": 31.3167, "longitude": 120.6303, "cuisine_type": "苏式面", "average_price": 40, "rating": 4.5, "tags": "面馆,老字号,早餐", "is_recommended": True, "opening_hours": "06:30-14:00"},
    {"name": "桃花源记", "city": "苏州", "description": "网红苏帮菜店 | 人均: ¥100", "address": "苏州市姑苏区平江路97号", "latitude": 31.3144, "longitude": 120.6322, "cuisine_type": "苏帮菜", "average_price": 100, "rating": 4.3, "tags": "苏帮菜,网红,平江路", "is_recommended": False, "opening_hours": "10:00-21:00"},
    {"name": "阿坤奶茶", "city": "苏州", "description": "苏州本地奶茶品牌 | 人均: ¥25", "address": "苏州市姑苏区观前街", "latitude": 31.3156, "longitude": 120.6278, "cuisine_type": "饮品", "average_price": 25, "rating": 4.2, "tags": "奶茶,本地,观前街", "is_recommended": False, "opening_hours": "10:00-22:00"},
]


async def seed_data():
    async with AsyncSessionLocal() as session:
        # 插入目的地
        for d in SUZHOU_DESTINATIONS:
            dest = Destination(**d)
            session.add(dest)
        
        # 插入景点
        for a in SUZHOU_ATTRACTIONS:
            attr = Attraction(**a)
            session.add(attr)
        
        # 插入餐厅
        for r in SUZHOU_RESTAURANTS:
            rest = Restaurant(**r)
            session.add(rest)
        
        await session.commit()
        print("✅ 苏州数据插入成功！")


if __name__ == "__main__":
    asyncio.run(seed_data())
