from db_models import db, User, Loan
from app import create_app

app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()

    users = [
        User(username="akash", password="pass123"),
        User(username="arun", password="pass123"),
        User(username="vignesh", password="pass123")
    ]
    db.session.add_all(users)
    db.session.commit()

    loans = [
        Loan(user_id=users[0].id, amount=50000, status='approved'),
        Loan(user_id=users[1].id, amount=25000, status='pending')
    ]
    db.session.add_all(loans)
    db.session.commit()

    print("✅ Sample users and loans added")
