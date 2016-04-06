import java.util.Random;

public class DieSimulator
{
	public static void main(String[] args)
	{
		Random Die = new Random();
		System.out.println(Die.nextInt(6) + 1);
		/*The Plus 1 compensates the fact this picks a Niuber between 0-5
		    and now will pick a number from 1-6 */
		//Shane Butt 200621753
	}
}
		
