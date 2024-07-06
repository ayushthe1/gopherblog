# GopherBlog

## Overview
This project is a fully-featured blog website built using a microservices architecture. Users can sign up, create, update, and publish blogs. Other users can comment on the blogs. The project uses a variety of technologies and tools to ensure scalability, efficiency, and a seamless user experience. The website is deployed live on AWS . Link : https://gopherblog.ayushsharma.co.in/


https://github.com/ayushthe1/gopherblog/assets/114604338/f17473b0-3e68-4af1-bb68-0844d1ecd61e

## Rich text editor support for creating comments and posts
![image](https://github.com/ayushthe1/gopherblog/assets/114604338/581157f4-ebf4-471a-8a1c-256674290190)
![image](https://github.com/ayushthe1/gopherblog/assets/114604338/03fde93b-546b-4e8d-9498-ed16c0c198fd)

## Architecture
![gopherblog-architecture](https://github.com/ayushthe1/gopherblog/assets/114604338/ff76e0d8-b4f1-4289-a636-a810d677584c)


## Technologies Used

- **Backend**: Golang
- **Frontend**: React
- **Database**: PostgreSQL
- **For Caching**: Redis
- **Messaging Queue**: RabbitMQ
- **Deployment**: Docker, AWS
- **Email Service**: Mailtrap
- **Rich Text Editor**: For creating posts and comments

## Features

- User Authentication: Signup and login functionalities.
- Blog Management: Create, update, and publish blogs.
- Comment System: Users can comment on blogs.
- Microservices Architecture: Organized into multiple services for better scalability and maintainability.
- Caching: Redis is used to cache frequently accessed data.
- Messaging: RabbitMQ for handling asynchronous messaging.
- Email Notifications: Email notifications sent using Mailtrap.
- Rich Text Editor: Enhanced text editing for posts and comments.
- Deployed on AWS: Utilizing Docker for containerization.


