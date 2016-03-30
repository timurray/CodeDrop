CREATE TABLE files (file_name VARCHAR (64) PRIMARY KEY UNIQUE, file_type VARCHAR (64), contents BLOB, fs_id INTEGER REFERENCES file_storage (fs_id));
CREATE TABLE solution (work_id REFERENCES work (work_id), user_id INTEGER REFERENCES users (user_id), contents BLOB, grade INTEGER, feedback BLOB, PRIMARY KEY (work_id, user_id));
CREATE TABLE users (user_id INTEGER PRIMARY KEY UNIQUE, first_name VARCHAR (64), last_name VARCHAR (64), email VARCHAR (64), phone VARCHAR (13), password VARCHAR (64));
CREATE TABLE work (work_id INTEGER PRIMARY KEY, course_id INTEGER REFERENCES courses (course_id), title VARCHAR (64), due_date DATE, contents BLOB);
CREATE TABLE courses (course_id INT PRIMARY KEY UNIQUE, name VARCHAR (64), section INTEGER, startdate VARCHAR(50), enddate VARCHAR(50));
CREATE TABLE file_storage (fs_id INTEGER PRIMARY KEY UNIQUE, capacity INTEGER, user_id INTEGER REFERENCES users (user_id));
CREATE TABLE register (user_id INTEGER REFERENCES users (user_id), course_id INTEGER REFERENCES courses (course_id), role INTEGER, PRIMARY KEY (user_id, course_id));
