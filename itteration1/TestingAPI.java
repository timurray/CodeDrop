/** TestingAPI -- Interface for the Docker-based testing backend 
* @author Dean Massecar
*/

public class TestingAPI {

	
	/** Setup the testing environment using the specified language, as identified
	* @param language		What language to use (eg. "java", "c++")
	public TestingAPI(String language) {
		
	}
	
	/** Returns the test result string for the specified test
	* @param testNum		Which test number info is desired
	* @return				A string representing the actual test output
	*/
	public String getTestResultingOutput(int testNum) {
		return "";
	}
	
	/** Returns the test expected output string for the specified test
	* @param testNum		Which test number's info is desired
	* @return				A string representing the expected test output
	*/
	public String getTestExpectedOutput(int testNum) {
		return "";
	}
	
	/**Returns the test input string for the specified test
	* @param testNum		Which test number info is desired
	* @return				A string representing the test input
	*/
	public String getTestInput(int testNum) {
		return "";
	}	
	
	
	/** Pushes a command/string to the testing environment console
	* @param conIn			What is to be pushed via 'console';
	*/
	public void pushConsoleLine(String consoleIn) {
		
	}
	
	/** Returns the desired number of previous console lines
	* @param numOfLines		How many lines are desired
	* @return				A string representing the desired number of console output lines
	*/
	public String getConsoleLines(int numOfLines) {
		return "";
	}
	
	/** Returns the desired number of previous console lines
	* @return				A string representing the last line of output
	*/
	public String getLastConsoleLine() {
		return getConsoleLines(1);
	}
	
	/** Code submission method for testing
	* @param code			The code to be tested
	*/
	public void submitCode(Object code) {
		//probably will need to encode the code as a compressed file using
		//base64 encoding, then uncompress within the container.
	}
	
	
}
