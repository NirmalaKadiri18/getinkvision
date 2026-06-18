async function sendOTP() {

    const email = document.getElementById("email").value;

    const response = await fetch("http://localhost:3000/send-otp", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ email })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("message").innerText = data.message;
}

async function verifyOTP() {

    const otp = document.getElementById("otp").value;

    const response = await fetch("http://localhost:3000/verify-otp", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ otp })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("message").innerText = data.message;

    if (data.success) {

    localStorage.setItem("loggedIn","true");

    localStorage.setItem(
        "userEmail",
        document.getElementById("email").value
    );

    alert("Login Successful");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);

}

}