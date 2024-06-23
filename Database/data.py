import sqlite3
import pandas as pd

db = sqlite3.connect('figurines.sqlite')

db.execute('DROP TABLE IF EXISTS figurines')
db.execute('DROP TABLE IF EXISTS order_table')
db.execute('DROP TABLE IF EXISTS shippingaddress')
db.execute('DROP TABLE IF EXISTS users')
db.execute('DROP TABLE IF EXISTS rating_figure')

# Create the figurines table
db.execute('''CREATE TABLE figurines(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    series TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    category TEXT NOT NULL,
    tab_category TEXT NOT NULL,
    price TEXT NOT NULL,
    specification TEXT NOT NULL,
    sculptor TEXT NOT NULL,
    cooperation TEXT NOT NULL,
    image1 TEXT NOT NULL,
    image2 TEXT NOT NULL,
    image3 TEXT NOT NULL,
    image4 TEXT NOT NULL,
    average_rating REAL DEFAULT 0,
    number_of_ratings INTEGER DEFAULT 0
);''')

# Create the users table
db.execute('''CREATE TABLE users(
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(225) NOT NULL,
    balance REAL
);''')

# Create the shippingaddress table
db.execute('''CREATE TABLE shippingaddress(
    shippingaddressid INTEGER PRIMARY KEY AUTOINCREMENT,
    userid INTEGER NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT NOT NULL,
    address3 TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(userid)
);''')

# Create the order_table
db.execute('''CREATE TABLE order_table(
    orderid INTEGER PRIMARY KEY AUTOINCREMENT,
    userid INTEGER NOT NULL,
    figurineid INTEGER NOT NULL,
    shippingaddressid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (figurineid) REFERENCES figurines(id),
    FOREIGN KEY (shippingaddressid) REFERENCES shippingaddress(shippingaddressid)
);''')

db.execute('''CREATE TRIGGER update_order_table
            AFTER UPDATE ON order_table
            FOR EACH ROW
            BEGIN
                UPDATE order_table SET updated_at = CURRENT_TIMESTAMP WHERE orderid = OLD.orderid;
            END;''')

db.execute('''CREATE TABLE rating_figure(
    rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
    figurineid INTEGER NOT NULL,
    rating REAL NOT NULL,
    FOREIGN KEY (figurineid) REFERENCES figurines(id)
);''')


def import_csv_to_sqlite(csv_file, sqlite_db, table_name):
    # Read CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file)
    
    # Connect to SQLite database
    conn = sqlite3.connect(sqlite_db)
    
    # Write DataFrame to SQLite database
    df.to_sql(table_name, conn, if_exists='append', index=False)  # Append data without dropping the table

    
    # Close database connection
    conn.close()
    
    print(f"Data from '{csv_file}' imported into '{sqlite_db}.{table_name}' successfully.")

# Replace these paths with your CSV file path, SQLite database path, and table name
csv_file = 'C:/Users/60167/Desktop/FigurineApp/Database/FullFigureList.csv'
sqlite_db = 'figurines.sqlite'
table_name = 'figurines'

# Call the function to import CSV data into SQLite database
import_csv_to_sqlite(csv_file, sqlite_db, table_name)


db.close()