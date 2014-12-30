# aitp-app

a [Sails](http://sailsjs.org) api for the aitp applicaitons

Models:

##Announcements
id (integer)  
creator (string)  
title (string)  
text (string)   
start_date (date)  
end_date (date)  
roles (populated announcements_roles)  
  
##Announcements_Roles
*announcement_id (integer)  
*role_id (integer)  
  
##Answers
*question_id (integer)  
*text (string)  
  
##CardIDToEmail
*card_id (string)  
*email (string)  
  
##CheckIns
*email (string)  
date_scanned (date)  
  
##ClassBonus
*id (integer)  
*course_code (string)  
*semester (string)  
  
##Notes
id (integer)  
*person_email (string)  
public_to_person (boolean)  
title (string)  
text (string)  
  
##Person_Role
*email (string)  
*role_id (integer)  

##Person_ClassBonus
*email (string)  
*class_bonus_id (integer)  

##Person
*email (string)  
*password (string)  
*first_name (string)  
*last_name (string)  
expire_date (date)  
mobile_number (string)  
is_local_paid (boolean)  
is_member (boolean)  
class_year (string, ["freshman", "sophomore", "junior", "senior"])  
last_sync_date (date)  
checkins (populated checkins)    
class_bonuses (populated person_classbonus)    
roles (populated person_role) 

##PossibleAnswers
*id (integer)  
*question_id (integer) 
text (string)  

##Questions
id (integer)  
*survey_id (string)  
*question_text (string)  
*type (string ["text", "checkbox", "radio"])  
possible_answers (populated possibleanswers)  
roles (populated question_roles)  
  
##Questions_Roles
*question_id (integer)  
*role_id (integer)  
  
##Roles
*id (integer)  
*name (string)  
  
##Surveys
id (integer)  
creator (string)  
name (string)  
start_date (date)  
end_date (date)  
questions (populated questions)  
roles (populated surveys_roles)  
  
##Surveys_Roles
*survey_id (integer)  
*role_id (integer)  
  
  
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
 
Person/resetPassword/
Given an email, reset the person associated's password

Person/findWithExtras/<email/cardID>
Same as find but populates nested associations

Surveys/findWithExtras/<email/cardID>
Same as find but populates nested associations

Questions/findWithExtras/<email/cardID>
Same as find but populates nested associations

Announcements/findWithExtras/<email/cardID>
Same as find but populates nested associations
