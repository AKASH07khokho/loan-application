from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DB_NAME = "digital_loan_application.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS loan_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            employment TEXT NOT NULL,
            loan_amount REAL,
            loan_type TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    conn.close()

init_db()
@app.route('/')
def home():
    return "Digital Loan Application Backend is running."


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
        user_id = c.lastrowid
        return jsonify({"message": "User registered successfully", "user_id": user_id, "name": name})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400
    finally:
        conn.close()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "All fields are required"}), 400

    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, name, password FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    conn.close()

    if not user or user[2] != password:
        return jsonify({"error": "Invalid email or password"}), 400

    return jsonify({"user_id": user[0], "name": user[1]})


@app.route('/loan_applications', methods=['POST'])
def apply_loan():
    data = request.get_json()
    user_id = data.get('user_id')
    full_name = data.get('full_name')
    date_of_birth = data.get('date_of_birth')
    employment = data.get('employment')
    loan_amount = data.get('loan_amount')
    loan_type = data.get('loan_type')

    if not all([user_id, full_name, date_of_birth, employment, loan_amount, loan_type]):
        return jsonify({"error": "Required fields missing"}), 400

    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        INSERT INTO loan_applications (user_id, full_name, date_of_birth, employment, loan_amount, loan_type)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, full_name, date_of_birth, employment, loan_amount, loan_type))
    conn.commit()
    conn.close()

    return jsonify({"message": "Loan application submitted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
