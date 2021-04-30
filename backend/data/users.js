import bcrypt from 'bcryptjs';

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("passw0rd", 10),
        isAdmin: true
    }, 
    {
        name: "John Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("passw0rd", 10)
    },
    {
        name: "Nikhil Goswami",
        email: "nikhil@goswami.com",
        password: bcrypt.hashSync("passw0rd", 10)
    }
]

export default users;