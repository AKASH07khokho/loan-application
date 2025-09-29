from flask import Blueprint, request, jsonify
from db_models import db, Loan

loan_bp = Blueprint('loan', __name__)

@loan_bp.route('/create', methods=['POST'])
def create_loan():
    data = request.get_json()
    user_id = data.get('user_id')
    amount = data.get('amount')

    new_loan = Loan(user_id=user_id, amount=amount, status='pending')
    db.session.add(new_loan)
    db.session.commit()

    return jsonify({"message": "Loan application created"}), 201

@loan_bp.route('/all', methods=['GET'])
def get_loans():
    loans = Loan.query.all()
    return jsonify([
        {"id": l.id, "user_id": l.user_id, "amount": l.amount, "status": l.status}
        for l in loans
    ])
