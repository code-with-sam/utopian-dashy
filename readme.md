## Utopian Dashy 🚀
Utopian Dashy aims to be a reference and discovery tools for projects and developers on the Utopian.io platform. This project was born out of my desire to have a single place of reference for the development projects I am working on.

## Usage
The current version of Dashy can be viewed online [here](https://utopian-portfolio-tiiapweqqe.now.sh/). Initial release is on a default domain as the final project name is still TBD.

Dashy aims to be a reference tool for recent statistics, a discovery tool for interesting project & developers and a portfolio tool to showcase a developers projects. Not too much to ask right 😉.

```/``` - Base url shows latest projects and statistics
```/users/sambillingham``` - Portfolio url can specify any utopian contributor name

To use locally please follow setup below.

## Install & Setup
Dashy is an [Express.js](https://expressjs.com/) App. You will need the latest version of [Node.js](https://nodejs.org/en/) installed to setup and run this project locally.

If you have Git installed you can clone the project from the command line.
```
git clone git@github.com:code-with-sam/utopian-dashy.git // if you have ssh keys setup
git clone https://github.com/code-with-sam/utopian-dashy.git // if you are using https auth
```
Alternatively [download the project directly from Github](https://github.com/code-with-sam/utopian-dashy/archive/master.zip)

Once downloaded run the following commands to install.

```
cd utopian-dashy/
npm install
npm start
```
An Express server will start. Navigate to http://localhost:3000 to view the project.

# Features
![user-profile](https://user-images.githubusercontent.com/34964560/37840487-20b6cb80-2eb5-11e8-8ad9-1fbe600230f6.png)
## Portfolio/Tracker
The aim of this page is to answer the questions “What are you working on?” & “What have you made?”.

![dashboard](https://user-images.githubusercontent.com/34964560/37840474-1786b886-2eb5-11e8-89e4-d018e05b1495.png)
## Dashboard/Lastest
The aim of this page is to answer the questions “What are the latest approval/reject rates?” & “What projects have been approved recently?”.

#Roadmap
- Use for all utopian categories not just development. Allow switching between them and an ‘all’ view.
- Expand project card to see all updates or link to individual project view. (Not all projects are updated by the same author)
- Regularly Cache results or move to database
- Personal feed to see only who you follow
- Differentiate owner/contributor on profile page
- Infinite scroll for more content
- preload animations
- Add overall approval rate of user on profile page

# contributions
You can connect me on Discord[sambillingham#7927] or [Steemit @sambillingham](https://steemit.com/@sambillingham)
