# GopherBlog 

Live link : https://gopherblog.ayushsharma.co.in/

GopherBlog is a dynamic blogging platform that empowers users to create, publish, and interact with engaging content. Crafted with a powerful combination of Golang and React, GopherBlog offers a seamless experience for both creators and readers.



https://github.com/ayushthe1/gopherblog/assets/114604338/92fd6dd4-9b96-476b-a78b-e0d649bf7a2c



![gopherblog](https://github.com/ayushthe1/gopherblog/assets/114604338/f648f964-7fb8-497b-8c09-6cc92539d6f8)



## Key Features

- **User Authentication**: Secure user authentication system enables seamless login and registration processes, with JWT tokens for enhanced security.
- **Blog Creation**: Users can effortlessly draft and publish their own blog posts. They can also post comments.
- **Microservices Architecture**: The project is organized in a microservice architecture consisting of multiple services using Docker Compose, facilitating scalability, modularity, and maintainability.
- **Redis**: is used for Caching and increasing response time. [go-redis](https://redis.io/docs/latest/develop/connect/clients/go/) client is used.
- **RabbitMQ**: is used as the messaging queue.
- **Deployment**: The website is deployed live on an AWS ec2 instance. 
- **Responsive Design**: GopherBlog boasts a sleek and intuitive design, optimized for seamless navigation across various devices and screen sizes.

## Tech Stack

- **Backend**: GopherBlog's backend is powered by Golang, leveraging the efficiency and performance of the[Fiber](https://gofiber.io/) web framework. [Gorm](https://gorm.io/index.html) serves as the ORM library, facilitating smooth interactions with the MySQL database.
- **Frontend**: The frontend is built with React. Tailwind CSS is used for styling.
- **Data Management**: MySQL serves as the primary database for storing blog posts and user data, while Redis handles caching for improved performance. RabbitMQ facilitates asynchronous communication, enabling efficient event handling and message queuing.
- **Email Integration**: GopherBlog integrates with Mailtrap for streamlined email notifications, ensuring smooth communication with users.

## Deployment

GopherBlog follows a microservices architecture, with Docker Compose orchestrating the deployment of multiple services. The application is hosted on AWS, providing scalability and reliability for seamless user experiences.

