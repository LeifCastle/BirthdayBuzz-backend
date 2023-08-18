<div align="center">
    <img src="./public/images/BirthdayBuzz_Logo.png" alt="HomePage" style="border-radius: 0.4rem" width="600" height="90"/>
</div>

# **About**

Never forget another birthday! Birthday Buzz is a MERN stack application that sends you email reminders when it's someone's birthday. Simply add your friends and family to your "buzz list" and we'll automatically send you a customized reminder when they're birthday is coming up or on the day of.

### Features

- Email verification required for all user accounts (no spam/malicious usage)
- Quick & Simple process to add friends and family to your "buzz list" (reminder list)
- Choose when you want to be reminded
- Create a custom reminder message
  <br></br>

# **Built With**

![Javascript](https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NODE.JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind.css-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)

<br />

# Deployment

- Frontend deployed online at [BirthdayBuzz](http://www.birthdaybuz.net)
- Backend deployed on [Heroku](https://birthday-buzz-backend-85f63d7d1452.herokuapp.com/)
- Frontend Github Repo [Github](https://github.com/LeifCastle/BirthdayBuzz-frontend)
- Backend Github Repo [Github](https://github.com/LeifCastle/BirthdayBuzz-backend)

<br />

# Getting Started

### Prerequisites

- Node.js
- MongoDB database - local install or [Mongo Atlas](http://mongodb.com/atlas)
- A [Sendgrid](https://signup.sendgrid.com/) API key
- A [Twilio](https://www.twilio.com/try-twilio) Account (Account SID, Service SID, and AUTH Token needed)

### Backend

1. `fork` and `clone` the [Birthday Buzz Backend](https://github.com/LeifCastle/BirthdayBuzz-backend) repository.

```zsh
git clone https://github.com/your-username/BirthdayBuzz-backend.git
cd BirthdayBuzz-backend
```

2. Install dependencies.

```zsh
npm install
```

3. Create a `.env` file in the repository root and add the follow environment variables:

```
MONGO_URI=insert-your-database-uri-here
JWT_SECRET=secret-key-of-your-choice
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_SERVICE=your-twilio-service-sid
```

4. Start the backend server.

```zsh
npm run dev
```

### Frontend

1. `fork` and `clone` the [Birthday Buzz Frontend](https://github.com/LeifCastle/BirthdayBuzz-frontend) repository.

```zsh
git clone https://github.com/your-username/BirthdayBuzz-frontend
cd BirthdayBuzz-frontend
```

2. Install dependencies.

```zsh
npm install
```

3. Create a `.env` file in the repository root and add the following environment variable:

```
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

4. Start the frontend server.

```zsh
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your web browser to experience the app.

### Notification Engine

- Set up a recurring engine to run `node bin/sendDailyEmail.js` on the backend server.
- The deployed version of Birthday Buzz uses `Heroku Scheduler` for this purpose.

### Routes

- **/** - CRUD operations for a user's Buzz List
- **/account** - CRUD operations for viewing user account details and finding other users
- **/auth** - User management routes (authentication, registration, login, etc.)

### Project Structure

- **/controllers** - Route handlers
- **/models** - Mongoose schema models
- **/config** - Configuration files
- **/bin** - Script files for Heroku Scheduler to run

<br />

# **Screenshots**

...coming soon

<br />

# Backend Code Snippets

- See the README in the [Frontend Repo](https://github.com/LeifCastle/BirthdayBuzz-frontend) for frontend code snippets.

...coming soon

<br />

# Wireframing and Entity Relationship Diagram

<img src="./public/images/BirthdayBuzz_Design&ERD.png" style="border-radius:5px" alt="Design & ERD" width="800" height="375"/>

<br />

# Stretch Goals

### Coming Soon

- UI/UX styling overhaul
- Edit Buzzlist entries
- Delete Buzzlist entries
- Fix Find page bugs
- Implement "Day Before" reminder time frame option
- Implement entry specific reminder message

### Future Enhancements

- Add several more reminder time frame options
- Add an "Upcoming page" (stylized list of buzzlist entries with an upcoming birthday)
- Add alternative mobile reminder texts
- Let users bulk add buzzlist entries from their contacts

<br />

# Resources

- [Twilio](https://www.twilio.com) - A cloud communication platform that provides a range of APIs for developers to integrate text messaging, emailing, and more into their applications.
- [SendGrid](https://sendgrid.com) - A cloud-based emailing platform builty by Twilio that offers web service APIs to automate email messaging.
- [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) - A Heroku add-on for running jobs on your app at scheduled time intervals, much like cron in a traditional server environment.

<h2 align="center">Authors</h2>

<div align="center">
  <a href="https://github.com/darkartaudio">
    <img src="https://avatars.githubusercontent.com/u/122645830?v=4"
      alt="Contributor"
      width="15%" />
  </a>
   <a href="https://github.com/Ellehcim23">
    <img src="https://avatars.githubusercontent.com/u/125094114?v=4"
      alt="Contributor"
      width="15%" />
  </a>
</div>
