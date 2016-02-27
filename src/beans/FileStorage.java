package beans;

import java.util.Collection;

public class FileStorage {
	private int id;
	private int capacity;
	private Collection<CDFile> files;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getCapacity() {
		return capacity;
	}
	
	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}
	
	public Collection<CDFile> getFiles() {
		return files;
	}
	
	public void setFiles(Collection<CDFile> files) {
		this.files = files;
	}
}
