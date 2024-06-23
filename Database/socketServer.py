from flask import Flask
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash , check_password_hash
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/60167/Desktop/FigurineApp/android/app/src/main/assets/figurines.sqlite'
db = SQLAlchemy(app)
socketio = SocketIO(app)

class User(db.Model):
    __tablename__ = 'users'
    userid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(225), nullable=False)
    balance = db.Column(db.Integer, nullable=True)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        # Serialize the user object, excluding the password
        return json.dumps({
            'userid': self.userid,
            'username': self.username,
            'email': self.email,
            'balance': self.balance
        })
        
# Order model
class Order(db.Model):
    __tablename__ = 'order_table'
    orderid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    figurineid = db.Column(db.Integer, nullable=False)  # Assuming a figurines table exists
    shippingaddressid = db.Column(db.Integer, nullable=False)  # Assuming a shippingaddress table exists
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def to_dict(self):
        return json.dumps({
            'orderid': self.orderid,
            'userid': self.userid,
            'figurineid': self.figurineid,
            'shippingaddressid': self.shippingaddressid,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        })


class Figurine(db.Model):
    __tablename__ = 'figurines'
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    product_description = db.Column(db.String, nullable=False)
    series = db.Column(db.String, nullable=False)
    manufacturer = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    tab_category = db.Column(db.String, nullable=False)
    price = db.Column(db.String, nullable=False)
    specification = db.Column(db.String, nullable=False)
    sculptor = db.Column(db.String, nullable=False)
    cooperation = db.Column(db.String, nullable=False)
    image1 = db.Column(db.String, nullable=False)
    image2 = db.Column(db.String, nullable=False)
    image3 = db.Column(db.String, nullable=False)
    image4 = db.Column(db.String, nullable=False)
    average_rating = db.Column(db.Float, default=0)
    number_of_ratings = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Figurine {self.product_name}>'


class ShippingAddress(db.Model):
    __tablename__ = 'shippingaddress'
    shippingaddressid = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('users.userid'), nullable=False)
    address1 = db.Column(db.Text, nullable=False)
    address2 = db.Column(db.Text, nullable=False)
    address3 = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<ShippingAddress {self.shippingaddressid}>'

    
@socketio.on('connect', namespace ='/figurinesData')
def handle_connection():
    print('Connected to /figurinesData')

@socketio.on('add_user', namespace='/figurinesData')
def add_user(data):
    try:
        # Extract user data from the incoming request
        username = data['username']
        password = data['password']
        email = data['email']

        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            # Emit a failure message back to the client if username exists
            emit('add_user_response', {'success': False, 'error': 'Username already exists'}, namespace='/figurinesData')
            return

        # Create a new User object
        new_user = User(username=username, password=password, email=email, balance=0.0)

        # Add the new user to the database session
        db.session.add(new_user)

        # Commit the changes to the database
        db.session.commit()

        # Emit a success message back to the client
        emit('add_user_response', {'success': True}, namespace='/figurinesData')
    except Exception as e:
        # Handle exceptions and emit an error message back to the client
        emit('add_user_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')
        # Rollback the transaction in case of an error
        db.session.rollback()

@socketio.on('edit_userpass', namespace='/figurinesData')
def edit_userpass(data):
    try:
        # Get the user ID from the session (assuming the user is logged in)
        user_id = data.get('user_id')
        new_userpass = data.get('new_password')
        
        # Query the database to find the logged-in user
        user = User.query.filter_by(userid=user_id).first()

        if user:
            # Update the username
            user.password = new_userpass

            # Commit the changes to the database
            db.session.commit()

            # Emit a success message back to the client
            emit('edit_userpass_response', {'success': True, 'message': 'Password Changed Succesfully'}, namespace='/figurinesData')
        else:
            # If user is not found, emit a failure message back to the client
            emit('edit_userpass_response', {'success': False, 'error': 'User Not Found!'}, namespace='/figurinesData')
    except Exception as e:
        # Handle exceptions and emit an error message back to the client
        emit('edit_userpass_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')



@socketio.on('login', namespace='/figurinesData')
def login(user_username, user_password):
    try:
        username = user_username
        password = user_password

        # Query the database for the user by username
        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            # If the password matches, prepare user data to send back
            user_info = user.to_dict()
            # Ensure to_dict() does not include the password
            emit('login_response', {'success': True, 'message': 'Login successful.', 'user': user_info}, namespace='/figurinesData')
        else:
            # If the password doesn't match or user doesn't exist
            emit('login_response', {'success': False, 'message': 'Invalid username or password.'}, namespace='/figurinesData')
    except Exception as e:
        # Handle exceptions and emit an error message
        emit('login_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')


@socketio.on('get_user_orders', namespace='/figurinesData')
def get_user_orders(data):
    try:
        userid = data['userid']

        # Query the order_table for orders associated with the userid
        orders = Order.query.filter_by(userid=userid).all()

        # Convert each order to a dictionary and prepare the JSON data
        orders_data = [order.to_dict() for order in orders]

        # Emit the orders back to the client
        emit('user_orders_response', {'success': True, 'orders': orders_data}, namespace='/figurinesData')
    except Exception as e:
        # Handle exceptions and emit an error message
        emit('user_orders_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')


@socketio.on('add_cart', namespace='/figurinesData')
def add_order(data):
    try:
        userid= data.get('userid')
        figurineid=data.get('figurineid')
        shippingaddressid=data.get('shippingaddressid')
        
        # Check if all required fields are provided
        if not all([userid, figurineid, shippingaddressid]):
            emit('add_order_response', {'success': False, 'error': 'Missing data'}, namespace='/figurinesData')
            return

        # Create a new Order object
        new_order = Order(userid=userid, figurineid=figurineid, shippingaddressid=shippingaddressid)
        db.session.add(new_order)
        db.session.commit()

        emit('add_order_response', {'success': True, 'message': 'Added to cart successfully!'}, namespace='/figurinesData')
    except Exception as e:
        db.session.rollback()
        emit('add_order_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')


@socketio.on('checkout', namespace='/figurinesData')
def handle_checkout(data):
    try:
        userid = data.get('userid')
        order_ids = data.get('order_ids')
        
        
        # Validate input
        if not userid or not order_ids:
            emit('checkout_response', {'success': False, 'error': 'Missing data'}, namespace='/figurinesData')
            return

        # Calculate total cost of the selected items
        total_cost = db.session.query(db.func.sum(Figurine.price)).join(Order, Order.figurineid == Figurine.id)\
            .filter(Order.userid == userid, Order.orderid.in_(order_ids)).scalar()

        # Check for None value which might indicate no orders found or other issues
        if total_cost is None:
            total_cost = 0

        # Fetch the user's current balance
        user = User.query.filter_by(userid=userid).first()
        if not user:
            emit('checkout_response', {'success': False, 'error': 'User not found'}, namespace='/figurinesData')
            return

        # Debugging output
        print(f"Total cost: {total_cost}, User balance: {user.balance}")

        # Check if the user's balance covers the total cost
        if user.balance < total_cost:
            emit('checkout_response', {'success': False, 'error': 'Insufficient funds'}, namespace='/figurinesData')
        else:
            user.balance -= total_cost
            db.session.commit()
            emit('checkout_response', {'success': True, 'message': 'Checkout successful'}, namespace='/figurinesData')

    except Exception as e:
        db.session.rollback()
        emit('checkout_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')




@socketio.on('update_balance', namespace='/figurinesData')
def update_balance(data, new_balance):
    try:
        userid = data['userid']

        # Input validation, ensure new_balance is a float
        if not isinstance(new_balance, int):
            emit('update_balance_response', {'success': False, 'error': 'Invalid balance format. Balance must be a number.'}, namespace='/figurinesData')
            return

        # Find the user by user_id
        user = User.query.filter_by(userid=userid).first()

        if user:
            # Update the user's balance
            user.balance = new_balance

            # Commit the changes to the database
            db.session.commit()

            # Emit a success message back to the client
            emit('update_balance_response', {'success': True, 'message': 'User balance updated successfully.', 'new_balance': new_balance}, namespace='/figurinesData')
        else:
            # Emit an error if the user does not exist
            emit('update_balance_response', {'success': False, 'error': 'User not found'}, namespace='/figurinesData')

    except Exception as e:
        # Rollback in case of any error
        db.session.rollback()
        emit('update_balance_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')

@socketio.on('get_cart_items', namespace='/figurinesData')
def send_cart_items(data):
    try:
        userid = data.get('userid')
        # Ensure the user ID is passed as an integer
        orders = db.session.query(
            Order.orderid,
            Figurine.product_name,
            Figurine.price,
            Figurine.image1
        ).join(Figurine, Figurine.id == Order.figurineid)\
          .filter(Order.userid == userid)\
          .all()

        cart_items = [
            {
                'orderid': order.orderid,
                'product_name': order.product_name,
                'price': order.price,
                'image1': order.image1,
                'checked': False
            } for order in orders
        ]

        socketio.emit('cart_items_response', {'success': True, 'cart_items': cart_items}, namespace='/figurinesData')

    except Exception as e:
        socketio.emit('cart_items_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')

@socketio.on('delete_cart_items', namespace='/figurinesData')
def delete_cart_items(data):
    try:
        order_ids = data.get('order_ids')
        if not order_ids:
            raise ValueError("No order IDs provided")

        for order_id in order_ids:
            order = Order.query.get(order_id)
            db.session.delete(order)
        db.session.commit()

        socketio.emit('delete_items_response', {'success': True}, namespace='/figurinesData')
    except Exception as e:
        socketio.emit('delete_items_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')


@socketio.on('add_shipping_address', namespace='/figurinesData')
def add_shipping_address(data):
    try:
        userid = data['userid']
        address1 = data['address1']
        address2 = data['address2']
        address3 = data['address3']

        # Validate input data
        if not all([userid, address1, address2, address3]):
            emit('add_shipping_address_response', {'success': False, 'error': 'All fields are required'}, namespace='/figurinesData')
            return

        # Create new ShippingAddress object
        new_address = ShippingAddress(
            userid=userid,
            address1=address1,
            address2=address2,
            address3=address3
        )

        # Add to the session and commit to the database
        db.session.add(new_address)
        db.session.commit()

        # Emit a success message back to the client
        emit('add_shipping_address_response', {'success': True, 'message': 'Shipping address added successfully'}, namespace='/figurinesData')
    except Exception as e:
        # If any error occurs, rollback the session and emit an error
        db.session.rollback()
        emit('add_shipping_address_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')

@socketio.on('list_user_address', namespace='/figurinesData')
def list_user_address(data):
    try:
        userid = data['userid']
        addresses = ShippingAddress.query.filter_by(userid=userid).all()

        # Convert each address to a dictionary format
        addresses_data = [{
            'shippingaddressid': address.shippingaddressid,
            'address1': address.address1,
            'address2': address.address2,
            'address3': address.address3
        } for address in addresses]

        # Emit the list of addresses back to the client
        emit('user_addresses_response', {'success': True, 'addresses': addresses_data}, namespace='/figurinesData')

    except Exception as e:
        # If any error occurs, send an error message back to the client
        emit('user_addresses_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')

@socketio.on('delete_shipping_address_list', namespace='/figurinesData')
def delete_shipping_address_list(data):
    try:
        # Extract user ID and list of shipping address IDs to delete
        userid = data['userid']
        address_ids = data['address_ids']  # This should be a list of IDs

        # Check if all required data is provided
        if not all([userid, address_ids]):
            emit('delete_shipping_address_response', {'success': False, 'error': 'Missing user ID or address IDs'}, namespace='/figurinesData')
            return

        # Query and delete the specified addresses that belong to the user
        ShippingAddress.query.filter(ShippingAddress.userid == userid, ShippingAddress.shippingaddressid.in_(address_ids)).delete(synchronize_session=False)

        # Commit the changes to the database
        db.session.commit()

        # Emit a success message back to the client
        emit('delete_shipping_address_response', {'success': True, 'message': 'Selected addresses deleted successfully'}, namespace='/figurinesData')

    except Exception as e:
        # Rollback in case of any errors
        db.session.rollback()
        emit('delete_shipping_address_response', {'success': False, 'error': str(e)}, namespace='/figurinesData')


if(__name__) == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, debug='true')
    