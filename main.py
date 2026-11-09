
# this is a to-do-list funtion and data base code file


# this is our database system
import sqlite3

DB = 'list_data.DB'

conn = sqlite3.connect(DB)
cursor = conn.cursor()

conn.execute('''
            CREATE TABLE IF NOT EXISTS user_data(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VANCHAR(50),
            password TEXT NOT NULL) ''')

conn.execute('''
            CREATE TABLE IF NOT EXISTS notes_data(
            id INTEGER PRIMARY KEY AUTOINCREMENT ,
            user_id INTEGER NOT NULL ,
            date TEXT,
            titel VANCHAR(50),
            discription VANCHAR(100),
            priority TEXT DEFAULT 'Medium',
            FOREIGN KEY (user_id) REFERENCES user_data(id)
            )                      
 ''')

conn.commit()

# this section of function that help to add data and get data from database

def register(name ,password):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()

    cursor.execute('''
                  INSERT INTO user_data (name ,password) VALUES (?,?) ''',(name ,password))
    conn.commit()

def verify_user(name ,password):
    with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
    
    cursor.execute('''
                   SELECT * FROM user_data
                   WHERE name = ? AND password = ?
                   ''', (name ,password)
                   )

    result = cursor.fetchone()

    if result:
        return result[0]

    return None


def delete_user(name, password):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM user_data
            WHERE name = ? AND password = ?
        """, (name, password))

        deleted = cursor.rowcount

    return deleted


def add_data(user_id,date,title,discripion,priority):
    with sqlite3.connect(DB) as conn:
           cursor = conn.cursor()
   
    cursor.execute('''
                  INSERT INTO notes_data (user_id,date,title,discripion,priority)
                   VALUES(?,?,?,?,?)'''
                  ,(user_id,date,title,discripion,priority)
                  )

    conn.commit()

def get_notes(user_id):
    with sqlite3.connect(DB) as conn:
           cursor = conn.cursor()
   
    cursor.execute('''
                  SELECT * FROM notes_data
                  WHERE user_id = ? ''',
                  (user_id)
                  )

    return cursor.fetchall()



    