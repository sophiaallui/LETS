const db = require("./db");
const bcrypt = require("bcryptjs");
const { BCRYPT_WORK_FACTOR } = require("./config");

async function seedData() {
	try {
		const adminHashedPW = await bcrypt.hash("admin", BCRYPT_WORK_FACTOR);
		const charlesHashedPW = await bcrypt.hash("charles", BCRYPT_WORK_FACTOR);
		const jaeHashedPW = await bcrypt.hash("cjp0116", BCRYPT_WORK_FACTOR);
    	
    	const dueDate = new Date(2021, 10, 17, 3, 24, 0);
  		const dueDate2 = new Date(2022, 10, 17, 3, 24, 0);
  		const dueDate3 = new Date(2022, 11, 17, 3, 24, 0);

		await db.query(
   			`INSERT INTO users 
   			(username, email, password, first_name, last_name, is_admin)
   			VALUES 
   			('admin',   'admin@test.com',     $1, 'admin FirstName', 'admin LastName', true),
   			('charles','charles@test.com',   $2, 'Charles',         'Park',          false),
   			('jae',    'jae@test.com',       $3, 'Jae',             'Cho',           false)
   			 RETURNING username`,
   		[adminHashedPW, charlesHashedPW, jaeHashedPW]
  		);

		await db.query(
    		`INSERT INTO users_measurements
    		( id, 
    		  created_by, 
    		  height_in_inches, 
    		  weight_in_pounds, 
    		  arms_in_inches, 
    		  legs_in_inches, 
    		  waist_in_inches
    		)
    		VALUES
    		(1, 'charles', 68.0, 150.0, 15.0, 27.0, 30.0),
    		(2, 'jae', 69.0, 151.0, 16.0, 28.0, 31.0);

    		INSERT INTO room 
    		(id, name) VALUES
    		(1, 'gains'),
    		(2, 'something');

    		INSERT INTO participants
    		 (id, user_id, room_id) VALUES
    		 (1, 'charles', 2),
    		 (2, 'jae', 2),
    		 (3, 'admin', 1),
    		 (4, 'charles', 1),
    		 (5, 'jae', 1);

    		INSERT INTO messages 
    		 (id, sent_by, text, room_id) VALUES
    		 (1, 'charles', 'wsup', 2),
    		 (2, 'jae', 'this shit sucks', 2),
    		 (3, 'admin', 'I am admin', 1),
    		 (4, 'jae', 'I know I made you', 1),
    		 (5, 'charles', 'This calendar is stupid', 1);

    		INSERT INTO goals
     		(id, created_by, content, due_date, is_complete) VALUES
     		(1, 'charles', 'testing content', '2021/11/1', 'FALSE'),
     		(2, 'charles', 'testing content2', '2021/12/1', 'FALSE'),
     		(3, 'jae', 		'bleh', '2021/10/9', 'TRUE');

     		INSERT INTO calendar_event
		      (id, posted_by, event_title, start_date, end_date, radios)
		        VALUES  
		      (1, 'charles', 'Charles title', '2021/10/31', '2021/11/1', 'bg-info'),
		      (2, 'jae', 	 'Jae title',     '2021/10/31', '2021/11/1', 'bg-danger');

		    INSERT INTO posts 
			  (id, posted_by, content) 
			    VALUES
			   (1, 'charles', 'testContent1'),
			   (2, 'charles', 'testContent2'),
			   (3, 'jae', 'testContent3'),
			   (4, 'jae', 'testContent4');

			INSERT INTO posts_comments
		    	(id, post_id, posted_by, content) 
		    	VALUES
		    (1, 1, 'jae', 'this post sucks'),
		    (2, 1, 'charles', 'yours suck too'),
		    (3, 3, 'charles', 'testing comment');
    		`
  		);
	}
	catch(e) {
		console.log("Something went wrong!");
		console.log(e);
		process.exit(1);
	}
}

seedData().then(() => {
	console.log("successfully seeded db");
	process.exit();
});
