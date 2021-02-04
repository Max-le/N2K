 
   function openNetlifyWidget() {
    netlifyIdentity.open();
}

function greetUser() {
    let user = netlifyIdentity.currentUser()
    if (user == null){
        document.getElementById('greeting').innerHTML = "You're not logged in."
    } else {
        document.getElementById('greeting').innerHTML = "Welcome back, "+ user.user_metadata.full_name
        
    }
}

netlifyIdentity.on('init', user => {
    //User is not logged in
    if (user == null) {
        console.log('No user logged in.')

    }else {
        console.log('Welcome back, '+user);
        greetUser(user)
    }
});

netlifyIdentity.on('login', user => {
    console.log('Login succesfull for', user);
    greetUser(user)
    
});

netlifyIdentity.on('logout', user => {
    console.log('Logout');
    greetUser(user)
})

window.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded.');

    if( getArticleLinkFromShareIntent() ) {
        if (netlifyIdentity.currentUser() == null) {
            netlifyIdentity.open('login', user => {
                if (user != null) {
                    sendRequestToAWS(getArticleLinkFromShareIntent());
                } else {
                    alert('You must be logged in to perform this action.')
                }
            })
        } else {
            sendRequestToAWS(getArticleLinkFromShareIntent());
        }
        
    }
});





function getArticleLinkFromShareIntent(){
    let parsedUrl = new URL(window.location.toString());
    let articleTitle = parsedUrl.searchParams.get('title')
    let articleLink = parsedUrl.searchParams.get('text')
    console.log('Title shared: ' + articleTitle );
    console.log('Text shared: ' + articleLink );
    
    if (articleTitle){
        document.getElementById("articleShared").innerHTML = "Sharing " + articleTitle;
    }
    
    return articleLink ;
    
    
}


function sendRequestToAWS(linkArticle) {
    
    var apiAWS = "https://bhn3zq0bak.execute-api.us-east-1.amazonaws.com/dev/sendtokindle?q="
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open("GET", apiAWS+linkArticle)
    console.log("request to "+apiAWS+linkArticle)
    if (linkArticle != null) {
        xmlHttp.send();
    }
    console.log("Response :", xmlHttp.response)
    
}







