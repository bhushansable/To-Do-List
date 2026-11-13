
# this api.py make api to hlep in send and request from database

from fastapi import FastAPI ,HTTPException
from pydantic import BaseModel
from main import register,verify_user,delete_user,add_data,get_notes,delete_data
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Resigter(BaseModel):
    name : str
    password : str

class Notes(BaseModel):
    user_id : int
    date : str
    titel : str
    discription : str
    priority : str

class DeleteNotes(BaseModel):
    user_id: int
    date: str

@app.get("/")
def home():
    return { " Do To List Running "}

@app.post("/register")
def add_user(resigters : Resigter):
    register(
        resigters.name,
        resigters.password
    )

    return{
        "message":"user are register succsessfull",
        "registers" : resigters
    }

@app.post("/login")
def login_user(user:Resigter):
    user_id = verify_user(user.name,user.password)

    if user_id is None:
        raise HTTPException(
            status_code= 401,
            detail="password or name are invalide"
        )


    return{
        "message":"login are succesefull",
        "user_id": user_id
    }

@app.delete("/delete_user")
def deltet_user_(user : Resigter):
    deleted = delete_user(user.name,user.password)

    if deleted is None:
        raise HTTPException(
            status_code=401,
            detail="password and name are invalide"
        )

    return{
        "message":"user deletd succsufully",
        "deleted" : deleted
    }

@app.post("/notes")
def add_notes(notes: Notes):
    try:
        add_data(
            notes.user_id,
            notes.date,
            notes.titel,
            notes.discription,
            notes.priority
        )

        return {
            "message": "Notes added successfully",
            "notes": notes
        }

    except Exception as e:
        print("ADD NOTES ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/notes/{date}")
def read_notes(date: str):
    notes = get_notes(date)

    return {
        "date": date,
        "notes": [
            {
                "id": row[0],
                "date": row[1],
                "titel": row[2],
                "discription": row[3],
                "priority": row[4]
            }
            for row in notes
        ]
    }



@app.delete("/delete_notes")
def delete_notes(user: DeleteNotes):
    deleted = delete_data(user.user_id,user.date)

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="No tasks found for this user on this date"
        )

    return {
        "message": "Tasks deleted successfully",
        "deleted_count": deleted
    }