const activateEmailSubject = (name) => {
    return `
        Hello ${name}, activate your account
    `
}

const activateEmail = (name, link) => {
    return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-size:2rem;font-family:\"Arial\";gap:2rem;text-align:center;">
            <h3>Hello ${name}, you just signed up for knitting e-commerce website. Click on the below given button to activate your account.</h3>
            <a href=${link} "style="text-decoration:none;font-size:1.8rem; padding:1rem 2rem;background:orangered;color:#fff;">Activate Account</a>
        </div>
    `
}


module.exports = {
    activateEmailSubject,
    activateEmail
}