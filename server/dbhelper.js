/**
 * SQL Statements
 */

function getCourses(user_id) {
	return "SELECT C.* FROM courses C, register R WHERE C.course_id = R.course_id AND R.user_id = " + user_id;
}

function getAssignments(user_id) {
	return "SELECT W.* FROM work W, register R WHERE W.course_id = R.course_id AND R.user_id = " + user_id;
}

function getFiles(user_id) {
	return "SELECT F.* FROM file F, file_storage FS WHERE F.fs_id = FS.fs_id AND FS.user_id = " + user_id;
}

function getUsers() {
	return "SELECT * FROM users";
}

function getSolutions(user_id) {
	return "SELECT S.* FROM solution WHERE S.user_id = " + user_id;
}

function getSolution(work_id, user_id) {
	return "SELECT * FROM solution WHERE work_id = " + work_id + " AND user_id = " + userId;
}