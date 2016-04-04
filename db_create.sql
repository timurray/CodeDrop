-- Table: courses
CREATE TABLE courses ( 
	course_id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
	name VARCHAR (64), 
	course_title VARCHAR (64),
	section INTEGER DEFAULT 0, 
	startdate VARCHAR(50), 
	enddate VARCHAR(50)
);

INSERT INTO courses (course_id, name, course_title, section, startdate, enddate) VALUES 
	(1, 'COMP4770', 'Team Project', 0, 'Jan. 6th, 2016', 'Apr. 6th, 2016'),
	(2, 'PSYC1001', 'Psychology II',0, 'Jan. 6th, 2016', 'Apr. 20th, 2016'),
	(3, 'PSYC1001', 'Psychology II',1, 'Jan. 6th, 2016', 'Apr. 20th, 2016'),
	(4, 'MATH2000', 'Calculus 3'    0, 'Jan. 6th, 2016', 'Apr. 20th, 2016');

-- Table: users
CREATE TABLE users ( 
	user_id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
	first_name VARCHAR (64), 
	last_name VARCHAR (64), 
	email VARCHAR (64) UNIQUE, 
	phone VARCHAR (13), 
	password VARCHAR (64), 
	role_admin BOOLEAN DEFAULT 0
);

INSERT INTO users (user_id, first_name, last_name, email, phone, password, role_admin) VALUES 
	(1, 'John', 'Doe', 'student1@microhex.net', '18005550123', '12345', 0),
	(2, 'Jane', 'Doe', 'student2@microhex.net', '18005550123', '12345', 0),
	(3, 'Mister','Smith', 'admin@microhex.net', '18005550123', 'admin', 1),
	(4, 'Philip', 'St. Croix', 'pmsc73@mun.ca', '7464946', 'Leet@1337', 0)
;

-- Table: files
CREATE TABLE files (
	file_name VARCHAR (64) NOT NULL PRIMARY KEY UNIQUE, 
	file_type VARCHAR (64), 
	contents BLOB, 
	fs_id INTEGER REFERENCES file_storage (fs_id) ON DELETE CASCADE
);

-- Table: work
CREATE TABLE work ( 
	work_id INTEGER NOT NULL PRIMARY KEY, 
	course_id INTEGER REFERENCES courses (course_id) ON DELETE CASCADE, 
	title VARCHAR (64), 
	due_date DATE, 
	contents BLOB
);

INSERT INTO work (work_id, course_id, title, due_date, contents) VALUES 
	(1, 1, 'Iteration 0', NULL, NULL),
	(2, 1, 'Iteration 1', NULL, NULL),
	(3, 2, 'Midterm 1', NULL, NULL),
	(4, 2, 'Midterm 2', NULL, NULL),
	(5, 3, 'Assignment 1', NULL, NULL),
	(6, 3, 'Assignment 2', NULL, NULL),
	(7, 3, 'Assignment 3', NULL, NULL),
	(8, 3, 'Final Assignment', NULL, NULL)
;

-- Table: file_storage
CREATE TABLE file_storage ( 
	fs_id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
	capacity INTEGER, 
	user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE
);

-- Table: sessions
CREATE TABLE sessions ( 
	session_id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
	user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE
);

-- Table: register
CREATE TABLE register ( 
	user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE, 
	course_id INTEGER REFERENCES courses (course_id) ON DELETE CASCADE, 
	role INTEGER, 
	PRIMARY KEY (user_id, course_id)
);

INSERT INTO register (user_id, course_id, role) VALUES 
	(1, 1, 0),
	(2, 1, 0),
	(3, 1, 1),
	(4, 1, 0),
	(4, 2, 0),
	(3, 2, 1),
	(2, 3, 2),
	(3, 3, 1),
	(4, 3, 0)
;

-- Table: solution
CREATE TABLE solution ( 
	work_id INTEGER REFERENCES work (work_id), 
	user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE, 
	contents BLOB, 
	grade INTEGER, 
	feedback BLOB, 
	PRIMARY KEY (work_id, user_id)
);
