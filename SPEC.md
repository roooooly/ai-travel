# AI Travel - 智能旅行规划平台

## 愿景
让用户在陌生城市轻松规划完美行程 - 知道去哪里玩、怎么玩、怎么出行、吃什么、哪里拍照、当前热点，分享路线并获取AI推荐。

## 核心功能

### 1. 首页 (/)
- 热门目的地轮播
- 当前热点推荐
- AI旅行助手入口
- 用户当前位置显示（基于IP）
- 快捷功能入口

### 2. 目的地 (/destinations)
- 城市选择器（上海/北京/成都/杭州/苏州）
- 目的地详情页
  - 城市介绍
  - 必去景点 TOP5
  - 特色美食
  - 最佳拍照点
  - 热门路线
  - 用户评论

### 3. 景点 (/attractions)
- 城市筛选器
- 景点列表（卡片展示）
- 景点详情
  - 名称、描述、地址
  - 开放时间、门票价格
  - 评分、标签
  - 最佳拍照位置
  - 游览时长建议
  - 周边餐厅/酒店推荐
  - 用户评论

### 4. 美食 (/restaurants)  
- 城市+菜系筛选
- 餐厅列表
- 餐厅详情
  - 名称、地址、人均价格
  - 菜系、特色菜
  - 营业时间
  - 评分、环境
  - 必点推荐
  - 用户评论

### 5. AI行程规划 (/itinerary)
- 两种模式：
  - **AI智能推荐**：用户无想法，AI根据目的地+天数+偏好推荐
  - **自定义规划**：用户有想法，选择景点后AI优化路线
- 输入：
  - 目的地城市
  - 行程天数
  - 同行人员（单人/情侣/家庭/朋友）
  - 偏好类型（亲子/情侣/拍照/美食/文化/探险）
- 输出：
  - 每日行程安排
  - 包含景点、餐厅、交通建议
  - 预计费用
  - 拍照点推荐

### 6. 发现 (/discover)
- 当前热点区域
- 热门打卡地
- 新开餐厅/景点
- 用户分享的路线

### 7. 我的 (/profile)
- 我的收藏
- 我的路线
- 我的评论
- 设置

## 数据结构

### 目的地 (destinations)
```
id, name, city, province, country
description, cover_image
latitude, longitude
tags[], is_hot, hot_score
created_at
```

### 景点 (attractions)
```
id, destination_id, city
name, description, address
latitude, longitude
open_hours, ticket_price
rating, tags[]
image_url, photo_spots[]
recommended_duration
is_recommended, is_hot
```

### 餐厅 (restaurants)
```
id, destination_id, city
name, description, address
latitude, longitude
cuisine_type, signature_dishes[]
open_hours, average_price
rating, environment
is_featured, is_hot
```

### 路线 (itineraries)
```
id, user_id, city
title, description
days[], activities[]
is_public, likes, views
created_at
```

### 评论 (reviews)
```
id, user_id, target_type, target_id
rating, content, images[]
likes, created_at
```

### 用户 (users)
```
id, username, email, avatar
created_at
```

## 技术栈

### 后端
- FastAPI + SQLAlchemy (Async)
- SQLite (开发) / PostgreSQL (生产)
- DeepSeek API (硅基流动)

### 前端
- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (状态管理)
- Shadcn/ui

### 外部API
- 硅基流动 DeepSeek (AI生成)
- 高德/腾讯地图 (地图)

## 开发计划

### Phase 1: 数据完善
- 扩充目的地到10+城市
- 每城市20+景点
- 每城市15+餐厅
- 添加热点数据

### Phase 2: 核心功能
- 城市筛选器
- 景点/餐厅详情页
- 用户评论系统

### Phase 3: AI增强
- 智能行程生成
- AI景点描述
- AI餐厅推荐

### Phase 4: 社交
- 用户注册登录
- 路线分享
- 评论点赞

## 验收标准
- 18:00前完成核心功能
- 所有图片与内容匹配
- AI行程生成可用
- 外网可访问
