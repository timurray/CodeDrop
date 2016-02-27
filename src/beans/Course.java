package beans;

import java.util.Collection;

public class Course {
	private int id;
	private String name;
	private Collection<Work> assignments;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Collection<Work> getAssignments() {
		return assignments;
	}
	
	public void setAssignments(Collection<Work> assignments) {
		this.assignments = assignments;
	}
}
