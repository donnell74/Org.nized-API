# aitp-app

a [Sails](http://sailsjs.org) api for the aitp applicaitons

Models:

Announcements  
Announcements_Roles  
Answers  
CardIDToEmail  
CheckIns  
ClassBonus  
Notes  
Person  
Person_ClassBonus  
Person_Role  
PossibleAnswers  
Questions  
Questions_Roles  
Roles  
Surveys  
Surveys_Roles  

functions:

Person/InsertPerson
Given the query data for a person row, insert into person table given person does not exist.  If the query data contains a first name and last name that exist in the database but has a different email, will return error PossibleDuplicatePerson and query data (with the old email and new email).  Developer's can then call Update with same data.

Person/CheckIfUserExist/<email/cardID>
Given an email or cardID, return true if an entry exists in Person table associated with this email

CheckIns/CheckIfUserCheckedInToday/<email/cardID>
Given an email or cardID, check if user has been checked in today.

Person/DeletePerson
Given an email or cardID, remove Person row from database

Person/UpdateEmail
Given the first name, last name, old email, and new email in the post data, update the old email with the new email of the person and any rows in CardIDToEmail where email equals old email.

Person/GetFirstPerson/<email/cardID>
Given an email or cardID, return the first Person row

Person/GetClassBonusesByPerson/<email/cardID>
Given an email or cardID, return list of Course Codes associated with the person who matches the email/cardID.

CheckIns/GetCheckInsByDate/<mm-dd-yyyy>
Given a date, return list of persons with a datechecked of that day.

CheckIns/GetTotalCheckInsByDate/<mm-dd-yyyy>
Given a date, return sum of members and sum of non-members with a datechecked of that day

CheckIns/CheckInPerson/<email/cardID>
Given an email or cardID, create a new record in CheckIns with the current datetime and the email of the person returned by the given.  Also, checks that no log ins for the current day exist.

ClassBonus/GetPersonsByClassBonus/<course_code>
Given a courseCode, return all persons that belong to the bonus class with that course code in the current semester.  Course_code must have no spaces

CardIDToEmail/find/<CardID>
Given the CardID, returns the email associated with that cardID.

Person/Update/
Given the query data through POST for a person row, update the database where email matches given email.  CardID will not work for this.

Person/Login/
Given the hash and email, attempt to login.

Person/findWithExtras/<email/cardID>
Same as find but populates nested associations

Surveys/findWithExtras/<email/cardID>
Same as find but populates nested associations

Questions/findWithExtras/<email/cardID>
Same as find but populates nested associations

Announcements/findWithExtras/<email/cardID>
Same as find but populates nested associations
