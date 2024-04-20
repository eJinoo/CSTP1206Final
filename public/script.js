
async function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = {
        name,
        email,
        password
    }

    try {
        const createdUser = await fetch('/api/blog/v1/users/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const createdUserJSON = await createdUser.json();

        if (createdUserJSON) {
            alert(createdUserJSON.message);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user: ' + error.message);
    }
}

async function loginUser(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const userSigninData = {
            email,
            password
        }
        try {
            const loggedInUser = await fetch('/api/blog/v1/users/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userSigninData)
            });

            const loggedInUserJSON = await loggedInUser.json();

            console.log(loggedInUserJSON)

            if (loggedInUserJSON) {
                localStorage.setItem('userId', loggedInUserJSON.data.id);
                localStorage.setItem('token', loggedInUserJSON.data.token);
                console.log(loggedInUserJSON.message);
                window.location.href = 'https://cstp1206final-myqb.onrender.com/home.html';
            }
        } catch(error) {
            console.log('There was an err client side!')
        }
}
