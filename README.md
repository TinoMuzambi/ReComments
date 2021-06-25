# ReComments

Ever wanted to comment on a video but the uploader has comments turned off? ReComments is your go to for commenting on YouTube videos with comments turned off.

## How it works:

1.  You sign into the app using your Google account.

1.1. ReComments makes a call to the Google People API to get some of your details and log you in. ReComments uses your name, surname, profile photo and email address.

1.2. ReComments will request access to your YouTube account. ReComments doesn't actually use your own personal YouTube data but this is required by the YouTube API.

2.  You will then be brought to the search page where you'll see some recommended videos as well as a search box. There you'll be able to enter a url to a YouTube video and search for it.
3.  ReComments will make a call to the YouTube API to get details on the video.
4.  You'll then be able to click on the video and be presented with a YouTube-like interface where you can see the title, channel name, video stats, video description as well as an embedded player for the YouTube video.
5.  Underneath the description will be a comment section where you'll be able to comment on the video, like comments, dislike comments as well as reply to people's comments. You'll also be able to edit and delete your own comments.

5.1 When you reply to a comment, the person you reply to receives an email notification that you replied to their comment.

5.2 If you don't want email notifications, there will be a link to unsubscribe in the email.

## Front-end

ReComments is a full-stack TypeScript Next.js app. The front-end is styled with Sass and takes inspiration from YouTube itself. It makes use of Sass variables, mixins and pseudo elements. It includes a dark mode as well that works well with the primary orange colour of the app.

## Database

The database of choice for storing all the comments and user data is MongoDB. ReComments uses the Mongoose wrapper for MongoDB. The api routes handle calls to the database using mongoose to retrieve, create, update and delete comment and user data.

## Back-end

The back-end uses Next.js serverless functions and handles all the interfacing with the database. It also handles sending emails through Nodemailer and getting the preview videos on the search page as well as handling the functionality of users unsubscribing/resubscribing to emails.
