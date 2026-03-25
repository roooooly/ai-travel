from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str  # username only, no email required
    password: str


class UserResponse(BaseModel):
    id: int
    email: str | None  # optional
    username: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str  # login with username
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
