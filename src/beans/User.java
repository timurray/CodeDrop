package beans;

import java.util.Collection;

public class User {
	
	public enum UserType {
		STUDENT,
		INSTRUCTOR,
		MARKER,
		ADMIN
	}
	
	private int id;
	private String password;
	private Collection<Course> courses;
	private Collection<CDFile> files;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public Collection<Course> getCourses() {
		return courses;
	}
	
	public void setCourses(Collection<Course> courses) {
		this.courses = courses;
	}
	
	public Collection<CDFile> getFiles() {
		return files;
	}
	
	public void setFiles(Collection<CDFile> files) {
		this.files = files;
	}
	
}
